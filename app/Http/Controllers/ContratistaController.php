<?php

namespace App\Http\Controllers;

use App\Models\Contratista;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContratistaController extends Controller
{
    public function index(Request $request)
    {
        $query = Contratista::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nombre', 'LIKE', "%{$search}%")
                  ->orWhere('cedula', 'LIKE', "%{$search}%")
                  ->orWhere('especialidad', 'LIKE', "%{$search}%");
            });
        }

        if ($request->filled('especialidad')) {
            $query->where('especialidad', $request->especialidad);
        }

        $contratistas = $query->orderBy('nombre')
            ->paginate(10)
            ->withQueryString();

        $stats = [
            'total' => Contratista::count(),
            'total_especialidades' => Contratista::distinct('especialidad')->count(),
            'saldo_total' => (float) Contratista::sum('saldo_actual'),
        ];

        return Inertia::render('Contratistas/Index', [
            'contratistas' => $contratistas,
            'stats' => $stats,
            'filters' => $request->only(['search', 'especialidad']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Contratistas/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'cedula' => 'required|string|max:20|unique:contratistas,cedula',
            'telefono' => 'required|string|max:20',
            'especialidad' => 'required|string|max:100',
            'tarifa_hora' => 'nullable|numeric|min:0',
            'saldo_actual' => 'nullable|numeric|min:0',
            'observaciones' => 'nullable|string|max:500',
        ]);

        Contratista::create($validated);

        return redirect()->route('contratistas.index')
            ->with('success', 'Contratista creado exitosamente.');
    }

    public function show(Contratista $contratista)
    {
        return Inertia::render('Contratistas/Show', [
            'contratista' => $contratista,
        ]);
    }

    public function edit(Contratista $contratista)
    {
        return Inertia::render('Contratistas/Edit', [
            'contratista' => $contratista,
        ]);
    }

    public function update(Request $request, Contratista $contratista)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'cedula' => 'required|string|max:20|unique:contratistas,cedula,' . $contratista->id,
            'telefono' => 'required|string|max:20',
            'especialidad' => 'required|string|max:100',
            'tarifa_hora' => 'nullable|numeric|min:0',
            'saldo_actual' => 'nullable|numeric|min:0',
            'observaciones' => 'nullable|string|max:500',
        ]);

        $contratista->update($validated);

        return redirect()->route('contratistas.index')
            ->with('success', 'Contratista actualizado exitosamente.');
    }

    public function destroy(Contratista $contratista)
    {
        $contratista->delete();

        return redirect()->route('contratistas.index')
            ->with('success', 'Contratista eliminado exitosamente.');
    }
}
