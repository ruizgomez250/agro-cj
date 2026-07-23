<?php

namespace App\Http\Controllers;

use App\Models\Insumo;
use App\Models\Cultivo;
use App\Models\Proveedor;
use App\Models\UnidadMedida;
use App\Models\TipoInsumo;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class InsumoController extends Controller
{
    public function index(Request $request)
    {
        $query = Insumo::with('cultivo');

        if ($request->filled('tipo')) {
            $query->where('tipo', $request->tipo);
        }

        if ($request->filled('proveedor')) {
            $query->where('proveedor', 'LIKE', "%{$request->proveedor}%");
        }

        if ($request->filled('cultivo_id')) {
            $query->where('cultivo_id', $request->cultivo_id);
        }

        if ($request->filled('fecha_desde')) {
            $query->whereDate('fecha_recepcion', '>=', $request->fecha_desde);
        }
        if ($request->filled('fecha_hasta')) {
            $query->whereDate('fecha_recepcion', '<=', $request->fecha_hasta);
        }

        $insumos = $query->orderBy('fecha_recepcion', 'desc')
            ->paginate(10)
            ->withQueryString();

        $resumenTipos = Insumo::select('tipo', DB::raw('SUM(cantidad) as total_cantidad, SUM(total) as total_costo'))
            ->groupBy('tipo')
            ->get();

        $totalGeneral = (float) Insumo::sum('total');
        $cultivos = Cultivo::select('id', 'nombre', 'variedad')->get();

        return Inertia::render('Insumos/Index', [
            'insumos' => $insumos,
            'resumenTipos' => $resumenTipos,
            'totalGeneral' => $totalGeneral,
            'cultivos' => $cultivos,
            'filters' => $request->only(['tipo', 'proveedor', 'cultivo_id', 'fecha_desde', 'fecha_hasta']),
        ]);
    }

    public function create()
    {
        $cultivos = Cultivo::select('id', 'nombre', 'variedad', 'lote_parcela')
            ->where('estado', 'activo')
            ->get();

        $proveedores = Proveedor::where('activo', true)->select('id', 'nombre')->get();
        $unidades = UnidadMedida::orderBy('nombre')->get();
        $tipos = TipoInsumo::orderBy('nombre')->get();

        return Inertia::render('Insumos/Create', [
            'cultivos' => $cultivos,
            'proveedores' => $proveedores,
            'unidades' => $unidades,
            'tipos' => $tipos,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'tipo' => 'required|string|max:100',
            'proveedor_id' => 'nullable|exists:proveedores,id',
            'cantidad' => 'required|numeric|min:0.01',
            'unidad' => 'required|string|max:50',
            'costo_unitario' => 'required|numeric|min:0.01',
            'fecha_recepcion' => 'required|date|before_or_equal:today',
            'factura' => 'nullable|string|max:255',
            'cultivo_id' => 'nullable|exists:cultivos,id',
            'observaciones' => 'nullable|string|max:500',
        ]);

        $validated['total'] = $validated['cantidad'] * $validated['costo_unitario'];

        if (!empty($validated['proveedor_id'])) {
            $p = \App\Models\Proveedor::find($validated['proveedor_id']);
            $validated['proveedor'] = $p->nombre ?? '';
        } else {
            $validated['proveedor'] = '';
        }

        Insumo::create($validated);

        return redirect()->route('insumos.index')
            ->with('success', 'Insumo registrado exitosamente.');
    }

    public function show(Insumo $insumo)
    {
        $insumo->load('cultivo');

        return Inertia::render('Insumos/Show', [
            'insumo' => $insumo,
        ]);
    }

    public function edit(Insumo $insumo)
    {
        $cultivos = Cultivo::select('id', 'nombre', 'variedad', 'lote_parcela')
            ->where('estado', 'activo')
            ->get();

        $proveedores = Proveedor::where('activo', true)->select('id', 'nombre')->get();
        $unidades = UnidadMedida::orderBy('nombre')->get();
        $tipos = TipoInsumo::orderBy('nombre')->get();

        return Inertia::render('Insumos/Edit', [
            'insumo' => $insumo,
            'cultivos' => $cultivos,
            'proveedores' => $proveedores,
            'unidades' => $unidades,
            'tipos' => $tipos,
        ]);
    }

    public function update(Request $request, Insumo $insumo)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'tipo' => 'required|string|max:100',
            'proveedor_id' => 'nullable|exists:proveedores,id',
            'cantidad' => 'required|numeric|min:0.01',
            'unidad' => 'required|string|max:50',
            'costo_unitario' => 'required|numeric|min:0.01',
            'fecha_recepcion' => 'required|date|before_or_equal:today',
            'factura' => 'nullable|string|max:255',
            'cultivo_id' => 'nullable|exists:cultivos,id',
            'observaciones' => 'nullable|string|max:500',
        ]);

        $validated['total'] = $validated['cantidad'] * $validated['costo_unitario'];

        if (!empty($validated['proveedor_id'])) {
            $p = \App\Models\Proveedor::find($validated['proveedor_id']);
            $validated['proveedor'] = $p->nombre ?? '';
        } else {
            $validated['proveedor'] = '';
        }

        $insumo->update($validated);

        return redirect()->route('insumos.index')
            ->with('success', 'Insumo actualizado exitosamente.');
    }

    public function destroy(Insumo $insumo)
    {
        $insumo->delete();

        return redirect()->route('insumos.index')
            ->with('success', 'Insumo eliminado exitosamente.');
    }
}
