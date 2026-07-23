<?php

namespace App\Http\Controllers;

use App\Models\Lote;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LoteController extends Controller
{
    public function index(Request $request)
    {
        $query = Lote::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nombre', 'LIKE', "%{$search}%")
                  ->orWhere('descripcion', 'LIKE', "%{$search}%");
            });
        }

        if ($request->filled('activo') !== null && $request->activo !== '') {
            $query->where('activo', $request->activo);
        }

        $lotes = $query->withCount('cultivos')->latest()->paginate(10)->withQueryString();

        return Inertia::render('Lotes/Index', [
            'lotes' => $lotes,
            'filters' => $request->only(['search', 'activo']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Lotes/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255|unique:lotes,nombre',
            'descripcion' => 'nullable|string|max:500',
            'hectareas' => 'nullable|numeric|min:0',
            'latitud' => 'nullable|numeric|between:-90,90',
            'longitud' => 'nullable|numeric|between:-180,180',
        ]);

        $validated['activo'] = true;

        Lote::create($validated);

        return redirect()->route('lotes.index')
            ->with('success', 'Lote creado exitosamente.');
    }

    public function edit(Lote $lote)
    {
        return Inertia::render('Lotes/Edit', ['lote' => $lote]);
    }

    public function update(Request $request, Lote $lote)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255|unique:lotes,nombre,' . $lote->id,
            'descripcion' => 'nullable|string|max:500',
            'hectareas' => 'nullable|numeric|min:0',
            'latitud' => 'nullable|numeric|between:-90,90',
            'longitud' => 'nullable|numeric|between:-180,180',
            'activo' => 'required|boolean',
        ]);

        $lote->update($validated);

        return redirect()->route('lotes.index')
            ->with('success', 'Lote actualizado exitosamente.');
    }

    public function destroy(Lote $lote)
    {
        if ($lote->cultivos()->count() > 0) {
            return back()->with('error', 'No se puede eliminar: tiene cultivos asociados.');
        }

        $lote->delete();

        return redirect()->route('lotes.index')
            ->with('success', 'Lote eliminado exitosamente.');
    }
}
