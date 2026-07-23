<?php

namespace App\Http\Controllers;

use App\Models\Cultivo;
use App\Models\Lote;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CultivoController extends Controller
{
    public function index(Request $request)
    {
        $query = Cultivo::withCount('insumos')->with('lote');

        if ($request->filled('estado')) {
            $query->where('estado', $request->estado);
        }

        if ($request->filled('nombre')) {
            $query->where('nombre', 'LIKE', "%{$request->nombre}%");
        }

        if ($request->filled('fecha_desde')) {
            $query->whereDate('fecha_siembra', '>=', $request->fecha_desde);
        }

        $cultivos = $query->orderBy('fecha_siembra', 'desc')
            ->paginate(10)
            ->withQueryString();

        $stats = [
            'total' => Cultivo::count(),
            'activos' => Cultivo::where('estado', 'activo')->count(),
            'cosechados' => Cultivo::where('estado', 'cosechado')->count(),
            'total_hectareas' => (float) Cultivo::sum('hectareas'),
        ];

        return Inertia::render('Cultivos/Index', [
            'cultivos' => $cultivos,
            'stats' => $stats,
            'filters' => $request->only(['estado', 'nombre', 'fecha_desde']),
        ]);
    }

    public function create()
    {
        $lotes = Lote::where('activo', true)->select('id', 'nombre', 'hectareas')->get();

        return Inertia::render('Cultivos/Create', ['lotes' => $lotes]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'variedad' => 'required|string|max:255',
            'hectareas' => 'required|numeric|min:0.01',
            'fecha_siembra' => 'required|date|before_or_equal:today',
            'fecha_cosecha' => 'nullable|date|after_or_equal:fecha_siembra',
            'lote_id' => 'nullable|exists:lotes,id',
            'rendimiento_estimado' => 'nullable|numeric|min:0',
            'estado' => 'required|in:activo,cosechado,abandonado',
            'observaciones' => 'nullable|string|max:500',
        ]);

        Cultivo::create($validated);

        return redirect()->route('cultivos.index')
            ->with('success', 'Cultivo registrado exitosamente.');
    }

    public function show(Cultivo $cultivo)
    {
        $cultivo->load(['insumos', 'lote']);

        return Inertia::render('Cultivos/Show', [
            'cultivo' => $cultivo,
        ]);
    }

    public function edit(Cultivo $cultivo)
    {
        $lotes = Lote::where('activo', true)->select('id', 'nombre', 'hectareas')->get();

        return Inertia::render('Cultivos/Edit', [
            'cultivo' => $cultivo,
            'lotes' => $lotes,
        ]);
    }

    public function update(Request $request, Cultivo $cultivo)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'variedad' => 'required|string|max:255',
            'hectareas' => 'required|numeric|min:0.01',
            'fecha_siembra' => 'required|date|before_or_equal:today',
            'fecha_cosecha' => 'nullable|date|after_or_equal:fecha_siembra',
            'lote_id' => 'nullable|exists:lotes,id',
            'rendimiento_estimado' => 'nullable|numeric|min:0',
            'estado' => 'required|in:activo,cosechado,abandonado',
            'observaciones' => 'nullable|string|max:500',
        ]);

        $cultivo->update($validated);

        return redirect()->route('cultivos.index')
            ->with('success', 'Cultivo actualizado exitosamente.');
    }

    public function destroy(Cultivo $cultivo)
    {
        if ($cultivo->insumos()->count() > 0) {
            return back()->with('error', 'No se puede eliminar: tiene insumos asociados.');
        }

        $cultivo->delete();

        return redirect()->route('cultivos.index')
            ->with('success', 'Cultivo eliminado exitosamente.');
    }
}
