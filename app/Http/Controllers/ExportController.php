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
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\GenericExport;

class ExportController extends Controller
{
    private function buildPdf($title, $headers, $rows, $summary = null)
    {
        $html = '<!DOCTYPE html><html><head><meta charset="utf-8">';
        $html .= '<style>';
        $html .= 'body{font-family:Helvetica,sans-serif;font-size:11px;color:#333;}';
        $html .= 'h1{font-size:18px;color:#047857;margin-bottom:5px;}';
        $html .= 'h2{font-size:12px;color:#666;margin-bottom:20px;font-weight:normal;}';
        $html .= 'table{width:100%;border-collapse:collapse;margin-top:10px;}';
        $html .= 'th{background:#047857;color:#fff;padding:8px 6px;text-align:left;font-size:10px;text-transform:uppercase;}';
        $html .= 'td{padding:6px;border-bottom:1px solid #e5e7eb;font-size:10px;}';
        $html .= 'tr:nth-child(even){background:#f9fafb;}';
        $html .= '.text-right{text-align:right;}';
        $html .= '.summary{margin-top:20px;padding:10px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;}';
        $html .= '.summary strong{color:#047857;}';
        $html .= '.footer{margin-top:30px;text-align:center;color:#999;font-size:9px;}';
        $html .= '</style></head><body>';
        $html .= '<h1>' . $title . '</h1>';
        $html .= '<h2>Agro CJ - ' . now()->format('d/m/Y H:i') . '</h2>';

        if ($summary) {
            $html .= '<div class="summary">';
            foreach ($summary as $label => $value) {
                $html .= '<strong>' . $label . ':</strong> ' . $value . '&nbsp;&nbsp;&nbsp;';
            }
            $html .= '</div>';
        }

        $html .= '<table><thead><tr>';
        foreach ($headers as $h) {
            $html .= '<th>' . $h . '</th>';
        }
        $html .= '</tr></thead><tbody>';
        foreach ($rows as $row) {
            $html .= '<tr>';
            foreach ($row as $cell) {
                $html .= '<td>' . $cell . '</td>';
            }
            $html .= '</tr>';
        }
        if (empty($rows)) {
            $html .= '<tr><td colspan="' . count($headers) . '" style="text-align:center;color:#999;padding:20px;">No hay datos</td></tr>';
        }
        $html .= '</tbody></table>';
        $html .= '<div class="footer">Documento generado automaticamente</div>';
        $html .= '</body></html>';

        return Pdf::loadHtml($html)->setPaper('a4', 'landscape')->download($title . '.pdf');
    }

    private function buildExcel($title, $headers, $rows, $summary = null)
    {
        $data = [];
        if ($summary) {
            $data[] = array_values($summary);
            $data[] = array_keys($summary);
            $data[] = [];
        }
        $data[] = $headers;
        foreach ($rows as $row) {
            $data[] = $row;
        }
        return Excel::download(new GenericExport($data), $title . '.xlsx');
    }

    public function aportesSocios(Request $request)
    {
        $socios = Socio::all()->map(fn($s) => [
            $s->nombre_completo,
            (float) $s->aporte_inicial,
            (float) $s->aporte_mensual,
            (float) ($s->aporte_inicial + $s->aporte_mensual),
            $s->estado,
            $s->fecha_ingreso->format('Y-m-d'),
        ]);
        $totalInicial = (float) Socio::sum('aporte_inicial');
        $totalMensual = (float) Socio::sum('aporte_mensual');
        $headers = ['Socio', 'Aporte Inicial', 'Aporte Mensual', 'Total', 'Estado', 'Fecha Ingreso'];
        $summary = ['Total Socios' => $socios->count(), 'Aportes Iniciales' => number_format($totalInicial, 0, ',', '.'), 'Aportes Mensuales' => number_format($totalMensual, 0, ',', '.')];
        $rows = $socios->values()->all();

        if ($request->format === 'excel') return $this->buildExcel('Aportes de Socios', $headers, $rows, $summary);
        return $this->buildPdf('Aportes de Socios', $headers, $rows, $summary);
    }

    public function gastos(Request $request)
    {
        $gastos = Gasto::with('usuario')->get()->map(fn($g) => [
            $g->fecha->format('Y-m-d'),
            $g->concepto,
            $g->categoria,
            number_format((float) $g->monto, 0, ',', '.'),
            $g->usuario->name ?? 'N/A',
        ]);
        $total = (float) Gasto::sum('monto');
        $headers = ['Fecha', 'Concepto', 'Categoria', 'Monto', 'Responsable'];
        $summary = ['Total Gastos' => number_format($total, 0, ',', '.'), 'Registros' => $gastos->count()];
        $rows = $gastos->values()->all();

        if ($request->format === 'excel') return $this->buildExcel('Gastos Varios', $headers, $rows, $summary);
        return $this->buildPdf('Gastos Varios', $headers, $rows, $summary);
    }

    public function gasoil(Request $request)
    {
        $recepciones = GasoilRecepcion::all()->map(fn($r) => [
            $r->fecha->format('Y-m-d'),
            $r->proveedor,
            $r->cantidad_galones,
            number_format((float) $r->precio_galon, 0, ',', '.'),
            number_format((float) $r->total, 0, ',', '.'),
        ]);
        $despachos = GasoilDespacho::all()->map(fn($d) => [
            $d->fecha->format('Y-m-d'),
            $d->destino,
            $d->responsable,
            $d->equipo_vehiculo,
            $d->cantidad_galones,
        ]);
        $totalRec = (float) GasoilRecepcion::sum('cantidad_galones');
        $totalDes = (float) GasoilDespacho::sum('cantidad_galones');
        $stock = $totalRec - $totalDes;
        $headers = ['Fecha', 'Proveedor', 'Galones', 'Precio/Galon', 'Total'];
        $summary = ['Recepcion' => number_format($totalRec, 2) . ' gal', 'Despacho' => number_format($totalDes, 2) . ' gal', 'Stock' => number_format($stock, 2) . ' gal'];
        $rows = $recepciones->values()->all();

        if ($request->format === 'excel') return $this->buildExcel('Gasoil - Recepciones', $headers, $rows, $summary);
        return $this->buildPdf('Gasoil - Recepciones', $headers, $rows, $summary);
    }

    public function contratistas(Request $request)
    {
        $contratistas = Contratista::all()->map(fn($c) => [
            $c->nombre,
            $c->especialidad,
            number_format((float) ($c->tarifa_hora ?? 0), 0, ',', '.'),
            number_format((float) $c->saldo_actual, 0, ',', '.'),
        ]);
        $totalSaldo = (float) Contratista::sum('saldo_actual');
        $headers = ['Nombre', 'Especialidad', 'Tarifa/Hora', 'Saldo Actual'];
        $summary = ['Total Contratistas' => $contratistas->count(), 'Saldo Total' => number_format($totalSaldo, 0, ',', '.')];
        $rows = $contratistas->values()->all();

        if ($request->format === 'excel') return $this->buildExcel('Contratistas', $headers, $rows, $summary);
        return $this->buildPdf('Contratistas', $headers, $rows, $summary);
    }

    public function cultivos(Request $request)
    {
        $cultivos = Cultivo::all()->map(fn($c) => [
            $c->nombre,
            $c->variedad,
            $c->hectareas,
            $c->lote_parcela,
            $c->fecha_siembra->format('Y-m-d'),
            $c->fecha_cosecha?->format('Y-m-d') ?? '-',
            $c->rendimiento_estimado ? number_format((float) $c->rendimiento_estimado, 0, ',', '.') . ' kg' : '-',
            $c->estado,
        ]);
        $totalHect = (float) Cultivo::sum('hectareas');
        $totalRend = (float) Cultivo::sum('rendimiento_estimado');
        $headers = ['Cultivo', 'Variedad', 'Hectareas', 'Lote', 'Siembra', 'Cosecha', 'Rend. Est.', 'Estado'];
        $summary = ['Total Cultivos' => $cultivos->count(), 'Hectareas' => number_format($totalHect, 2) . ' ha', 'Rendimiento' => number_format($totalRend, 0, ',', '.') . ' kg'];
        $rows = $cultivos->values()->all();

        if ($request->format === 'excel') return $this->buildExcel('Cultivos', $headers, $rows, $summary);
        return $this->buildPdf('Cultivos', $headers, $rows, $summary);
    }

    public function insumos(Request $request)
    {
        $insumos = Insumo::with('cultivo')->get()->map(fn($i) => [
            $i->fecha_recepcion->format('Y-m-d'),
            $i->nombre,
            $i->tipo,
            $i->proveedor,
            $i->cantidad . ' ' . $i->unidad,
            number_format((float) $i->costo_unitario, 0, ',', '.'),
            number_format((float) $i->total, 0, ',', '.'),
            $i->cultivo->nombre ?? 'N/A',
        ]);
        $totalCosto = (float) Insumo::sum('total');
        $headers = ['Fecha', 'Nombre', 'Tipo', 'Proveedor', 'Cantidad', 'Costo Unit.', 'Total', 'Cultivo'];
        $summary = ['Total Insumos' => $insumos->count(), 'Costo Total' => number_format($totalCosto, 0, ',', '.')];
        $rows = $insumos->values()->all();

        if ($request->format === 'excel') return $this->buildExcel('Insumos', $headers, $rows, $summary);
        return $this->buildPdf('Insumos', $headers, $rows, $summary);
    }
}
