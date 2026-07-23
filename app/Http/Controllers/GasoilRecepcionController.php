<?php

namespace App\Http\Controllers;

use App\Models\GasoilRecepcion;
use App\Models\Proveedor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class GasoilRecepcionController extends Controller
{
    public function index(Request $request)
    {
        $query = GasoilRecepcion::withSum('despachos', 'cantidad_galones');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('guia_remision', 'LIKE', "%{$search}%")
                  ->orWhereHas('proveedor_rel', function ($q2) use ($search) {
                      $q2->where('nombre', 'LIKE', "%{$search}%");
                  });
            });
        }

        if ($request->filled('fecha_desde')) {
            $query->whereDate('fecha', '>=', $request->fecha_desde);
        }
        if ($request->filled('fecha_hasta')) {
            $query->whereDate('fecha', '<=', $request->fecha_hasta);
        }

        $recepciones = $query->orderBy('fecha', 'desc')
            ->paginate(10)
            ->withQueryString();

        $recepciones->each(function ($recepcion) {
            $recepcion->stock_disponible = $recepcion->cantidad_galones - ($recepcion->despachos_sum_cantidad_galones ?? 0);
        });

        $totalStock = (float) GasoilRecepcion::all()->sum(function ($r) {
            return $r->cantidad_galones - $r->despachos()->sum('cantidad_galones');
        });

        return Inertia::render('Gasoil/Recepcion/Index', [
            'recepciones' => $recepciones,
            'totalStock' => $totalStock,
            'filters' => $request->only(['search', 'fecha_desde', 'fecha_hasta']),
        ]);
    }

    public function create()
    {
        $proveedores = Proveedor::where('activo', true)->select('id', 'nombre')->get();

        return Inertia::render('Gasoil/Recepcion/Create', [
            'proveedores' => $proveedores,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'fecha' => 'required|date|before_or_equal:today',
            'proveedor_id' => 'required|exists:proveedores,id',
            'guia_remision' => 'required|string|unique:gasoil_recepcion,guia_remision',
            'cantidad_galones' => 'required|numeric|min:0.01',
            'precio_galon' => 'required|numeric|min:0',
            'observaciones' => 'nullable|string|max:500',
            'comprobante' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
        ], [
            'fecha' => 'fecha',
            'proveedor_id' => 'proveedor',
            'guia_remision' => 'guia de remision',
            'cantidad_galones' => 'cantidad de litros',
            'precio_galon' => 'precio por litro',
            'observaciones' => 'observaciones',
            'comprobante' => 'comprobante',
        ]);

        $proveedor = Proveedor::findOrFail($validated['proveedor_id']);
        $validated['proveedor'] = $proveedor->nombre;
        $validated['total'] = $validated['cantidad_galones'] * $validated['precio_galon'];

        if ($request->hasFile('comprobante')) {
            $validated['comprobante'] = $request->file('comprobante')->store('gasoil/comprobantes', 'public');
        }

        GasoilRecepcion::create($validated);

        return redirect()->route('gasoil.recepcion.index')
            ->with('success', 'Recepcion de gasoil registrada exitosamente.');
    }

    public function show(GasoilRecepcion $recepcion)
    {
        $recepcion->load('despachos');
        $recepcion->stock_disponible = $recepcion->cantidad_galones - $recepcion->despachos->sum('cantidad_galones');

        return Inertia::render('Gasoil/Recepcion/Show', [
            'recepcion' => $recepcion,
        ]);
    }

    public function edit(GasoilRecepcion $recepcion)
    {
        $proveedores = Proveedor::where('activo', true)->select('id', 'nombre')->get();

        return Inertia::render('Gasoil/Recepcion/Edit', [
            'recepcion' => $recepcion,
            'proveedores' => $proveedores,
        ]);
    }

    public function update(Request $request, GasoilRecepcion $recepcion)
    {
        $validated = $request->validate([
            'fecha' => 'required|date|before_or_equal:today',
            'proveedor_id' => 'required|exists:proveedores,id',
            'guia_remision' => 'required|string|unique:gasoil_recepcion,guia_remision,' . $recepcion->id,
            'cantidad_galones' => 'required|numeric|min:0.01',
            'precio_galon' => 'required|numeric|min:0',
            'observaciones' => 'nullable|string|max:500',
            'comprobante' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
        ], [
            'fecha' => 'fecha',
            'proveedor_id' => 'proveedor',
            'guia_remision' => 'guia de remision',
            'cantidad_galones' => 'cantidad de litros',
            'precio_galon' => 'precio por litro',
            'observaciones' => 'observaciones',
            'comprobante' => 'comprobante',
        ]);

        $proveedor = Proveedor::findOrFail($validated['proveedor_id']);
        $validated['proveedor'] = $proveedor->nombre;
        $validated['total'] = $validated['cantidad_galones'] * $validated['precio_galon'];

        if ($request->hasFile('comprobante')) {
            if ($recepcion->comprobante) {
                Storage::disk('public')->delete($recepcion->comprobante);
            }
            $validated['comprobante'] = $request->file('comprobante')->store('gasoil/comprobantes', 'public');
        }

        $recepcion->update($validated);

        return redirect()->route('gasoil.recepcion.index')
            ->with('success', 'Recepcion actualizada exitosamente.');
    }

    public function destroy(GasoilRecepcion $recepcion)
    {
        if ($recepcion->despachos()->count() > 0) {
            return back()->with('error', 'No se puede eliminar: tiene despachos asociados.');
        }

        if ($recepcion->comprobante) {
            Storage::disk('public')->delete($recepcion->comprobante);
        }

        $recepcion->delete();

        return redirect()->route('gasoil.recepcion.index')
            ->with('success', 'Recepcion eliminada exitosamente.');
    }
}
