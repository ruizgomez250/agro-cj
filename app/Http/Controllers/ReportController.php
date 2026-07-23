<?php

namespace App\Http\Controllers;

use App\Models\Socio;
use App\Models\Cultivo;
use App\Models\Insumo;
use App\Models\Gasto;
use App\Models\GasoilRecepcion;
use App\Models\GasoilDespacho;
use App\Models\Contratista;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function index()
    {
        $resumen = [
            'total_socios' => Socio::count(),
            'socios_activos' => Socio::where('estado', 'activo')->count(),
            'total_cultivos' => Cultivo::count(),
            'cultivos_activos' => Cultivo::where('estado', 'activo')->count(),
            'total_hectareas' => Cultivo::sum('hectareas'),
            'total_gastos' => Gasto::sum('monto'),
            'total_gasoil_recepcion' => GasoilRecepcion::sum('total'),
            'total_gasoil_despacho' => GasoilDespacho::sum('cantidad_galones'),
            'total_contratistas' => Contratista::count(),
            'total_insumos' => Insumo::count(),
        ];

        return Inertia::render('Reports/Index', ['resumen' => $resumen]);
    }

    public function aportesSocios()
    {
        $socios = Socio::all()->map(fn($s) => [
            'id' => $s->id,
            'nombre_completo' => $s->nombre_completo,
            'aporte_inicial' => (float) $s->aporte_inicial,
            'aporte_mensual' => (float) $s->aporte_mensual,
            'total_aportes' => (float) ($s->aporte_inicial + $s->aporte_mensual),
            'estado' => $s->estado,
            'fecha_ingreso' => $s->fecha_ingreso->format('Y-m-d'),
        ]);

        $porEstado = Socio::select('estado', DB::raw('count(*) as total'))
            ->groupBy('estado')
            ->get();

        $totalInicial = $socios->sum('aporte_inicial');
        $totalMensual = $socios->sum('aporte_mensual');

        $porMes = Socio::select(
            DB::raw("DATE_FORMAT(fecha_ingreso, '%Y-%m') as mes"),
            DB::raw('count(*) as total'),
            DB::raw('sum(aporte_inicial) as aportes_iniciales')
        )
        ->groupBy('mes')
        ->orderBy('mes')
        ->get();

        return Inertia::render('Reports/AportesSocios', [
            'socios' => $socios,
            'porEstado' => $porEstado,
            'totalInicial' => $totalInicial,
            'totalMensual' => $totalMensual,
            'porMes' => $porMes,
        ]);
    }

    public function gastos()
    {
        $gastos = Gasto::with('usuario')->get()->map(fn($g) => [
            'id' => $g->id,
            'concepto' => $g->concepto,
            'categoria' => $g->categoria,
            'monto' => (float) $g->monto,
            'fecha' => $g->fecha->format('Y-m-d'),
            'usuario' => $g->usuario->name ?? 'N/A',
        ]);

        $porCategoria = Gasto::select('categoria', DB::raw('sum(monto) as total'), DB::raw('count(*) as cantidad'))
            ->groupBy('categoria')
            ->get();

        $porMes = Gasto::select(
            DB::raw("DATE_FORMAT(fecha, '%Y-%m') as mes"),
            DB::raw('sum(monto) as total'),
            DB::raw('count(*) as cantidad')
        )
        ->groupBy('mes')
        ->orderBy('mes')
        ->get();

        $totalGastos = Gasto::sum('monto');

        return Inertia::render('Reports/Gastos', [
            'gastos' => $gastos,
            'porCategoria' => $porCategoria,
            'porMes' => $porMes,
            'totalGastos' => $totalGastos,
        ]);
    }

    public function gasoil()
    {
        $recepciones = GasoilRecepcion::all()->map(fn($r) => [
            'id' => $r->id,
            'fecha' => $r->fecha->format('Y-m-d'),
            'proveedor' => $r->proveedor,
            'cantidad_galones' => (float) $r->cantidad_galones,
            'precio_galon' => (float) $r->precio_galon,
            'total' => (float) $r->total,
            'guia_remision' => $r->guia_remision,
        ]);

        $despachos = GasoilDespacho::all()->map(fn($d) => [
            'id' => $d->id,
            'fecha' => $d->fecha->format('Y-m-d'),
            'destino' => $d->destino,
            'responsable' => $d->responsable,
            'equipo_vehiculo' => $d->equipo_vehiculo,
            'cantidad_galones' => (float) $d->cantidad_galones,
            'kilometraje' => $d->kilometraje,
        ]);

        $totalRecepcionGalones = GasoilRecepcion::sum('cantidad_galones');
        $totalRecepcionMonto = GasoilRecepcion::sum('total');
        $totalDespachoGalones = GasoilDespacho::sum('cantidad_galones');

        $despachoPorDestino = GasoilDespacho::select('destino', DB::raw('sum(cantidad_galones) as total'))
            ->groupBy('destino')
            ->get();

        $despachoPorMes = GasoilDespacho::select(
            DB::raw("DATE_FORMAT(fecha, '%Y-%m') as mes"),
            DB::raw('sum(cantidad_galones) as total')
        )
        ->groupBy('mes')
        ->orderBy('mes')
        ->get();

        $stockActual = $totalRecepcionGalones - $totalDespachoGalones;

        return Inertia::render('Reports/Gasoil', [
            'recepciones' => $recepciones,
            'despachos' => $despachos,
            'totalRecepcionGalones' => (float) $totalRecepcionGalones,
            'totalRecepcionMonto' => (float) $totalRecepcionMonto,
            'totalDespachoGalones' => (float) $totalDespachoGalones,
            'stockActual' => (float) $stockActual,
            'despachoPorDestino' => $despachoPorDestino,
            'despachoPorMes' => $despachoPorMes,
        ]);
    }

    public function contratistas()
    {
        $contratistas = Contratista::all()->map(fn($c) => [
            'id' => $c->id,
            'nombre' => $c->nombre,
            'especialidad' => $c->especialidad,
            'tarifa_hora' => (float) ($c->tarifa_hora ?? 0),
            'saldo_actual' => (float) $c->saldo_actual,
        ]);

        $porEspecialidad = Contratista::select('especialidad', DB::raw('count(*) as total'), DB::raw('sum(saldo_actual) as saldo_total'))
            ->groupBy('especialidad')
            ->get();

        $totalSaldo = Contratista::sum('saldo_actual');

        return Inertia::render('Reports/Contratistas', [
            'contratistas' => $contratistas,
            'porEspecialidad' => $porEspecialidad,
            'totalSaldo' => (float) $totalSaldo,
        ]);
    }

    public function cultivos()
    {
        $cultivos = Cultivo::all()->map(fn($c) => [
            'id' => $c->id,
            'nombre' => $c->nombre,
            'variedad' => $c->variedad,
            'hectareas' => (float) $c->hectareas,
            'fecha_siembra' => $c->fecha_siembra->format('Y-m-d'),
            'fecha_cosecha' => $c->fecha_cosecha?->format('Y-m-d'),
            'lote_parcela' => $c->lote_parcela,
            'rendimiento_estimado' => $c->rendimiento_estimado ? (float) $c->rendimiento_estimado : null,
            'estado' => $c->estado,
        ]);

        $porTipo = Cultivo::select('nombre', DB::raw('sum(hectareas) as total_hectareas'), DB::raw('count(*) as cantidad'))
            ->groupBy('nombre')
            ->get();

        $porEstado = Cultivo::select('estado', DB::raw('count(*) as total'), DB::raw('sum(hectareas) as hectareas'))
            ->groupBy('estado')
            ->get();

        $totalHectareas = Cultivo::sum('hectareas');
        $totalRendimiento = Cultivo::sum('rendimiento_estimado');

        return Inertia::render('Reports/Cultivos', [
            'cultivos' => $cultivos,
            'porTipo' => $porTipo,
            'porEstado' => $porEstado,
            'totalHectareas' => (float) $totalHectareas,
            'totalRendimiento' => (float) $totalRendimiento,
        ]);
    }

    public function insumos()
    {
        $insumos = Insumo::with('cultivo')->get()->map(fn($i) => [
            'id' => $i->id,
            'nombre' => $i->nombre,
            'tipo' => $i->tipo,
            'proveedor' => $i->proveedor,
            'cantidad' => (float) $i->cantidad,
            'unidad' => $i->unidad,
            'costo_unitario' => (float) $i->costo_unitario,
            'total' => (float) $i->total,
            'fecha_recepcion' => $i->fecha_recepcion->format('Y-m-d'),
            'cultivo' => $i->cultivo->nombre ?? 'N/A',
        ]);

        $porTipo = Insumo::select('tipo', DB::raw('sum(total) as costo_total'), DB::raw('count(*) as cantidad'))
            ->groupBy('tipo')
            ->get();

        $porMes = Insumo::select(
            DB::raw("DATE_FORMAT(fecha_recepcion, '%Y-%m') as mes"),
            DB::raw('sum(total) as total'),
            DB::raw('count(*) as cantidad')
        )
        ->groupBy('mes')
        ->orderBy('mes')
        ->get();

        $totalCosto = Insumo::sum('total');

        return Inertia::render('Reports/Insumos', [
            'insumos' => $insumos,
            'porTipo' => $porTipo,
            'porMes' => $porMes,
            'totalCosto' => (float) $totalCosto,
        ]);
    }
}
