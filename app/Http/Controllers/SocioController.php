<?php

namespace App\Http\Controllers;

use App\Models\Socio;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class SocioController extends Controller
{
    public function index(Request $request)
    {
        $query = Socio::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nombre', 'LIKE', "%{$search}%")
                  ->orWhere('apellido', 'LIKE', "%{$search}%")
                  ->orWhere('cedula', 'LIKE', "%{$search}%")
                  ->orWhere(DB::raw("CONCAT(nombre, ' ', apellido)"), 'LIKE', "%{$search}%");
            });
        }

        if ($request->filled('estado')) {
            $query->where('estado', $request->estado);
        }

        $sortField = $request->get('sort', 'id');
        $sortDirection = $request->get('direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        $socios = $query->paginate(10)->withQueryString();

        $stats = [
            'total' => Socio::count(),
            'activos' => Socio::where('estado', 'activo')->count(),
            'inactivos' => Socio::where('estado', 'inactivo')->count(),
            'suspendidos' => Socio::where('estado', 'suspendido')->count(),
            'total_aportes' => (float) Socio::sum(DB::raw('aporte_inicial + aporte_mensual')),
        ];

        return Inertia::render('Socios/Index', [
            'socios' => $socios,
            'stats' => $stats,
            'filters' => $request->only(['search', 'estado']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Socios/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'apellido' => 'required|string|max:255',
            'cedula' => 'required|string|max:20|unique:socios,cedula',
            'telefono' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'aporte_inicial' => 'required|numeric|min:0',
            'aporte_mensual' => 'required|numeric|min:0',
            'fecha_ingreso' => 'required|date|before_or_equal:today',
            'estado' => 'required|in:activo,inactivo,suspendido',
            'observaciones' => 'nullable|string|max:500',
        ]);

        Socio::create($validated);

        return redirect()->route('socios.index')
            ->with('success', 'Socio creado exitosamente.');
    }

    public function show(Socio $socio)
    {
        return Inertia::render('Socios/Show', [
            'socio' => $socio,
        ]);
    }

    public function edit(Socio $socio)
    {
        return Inertia::render('Socios/Edit', [
            'socio' => $socio,
        ]);
    }

    public function update(Request $request, Socio $socio)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'apellido' => 'required|string|max:255',
            'cedula' => 'required|string|max:20|unique:socios,cedula,' . $socio->id,
            'telefono' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'aporte_inicial' => 'required|numeric|min:0',
            'aporte_mensual' => 'required|numeric|min:0',
            'fecha_ingreso' => 'required|date|before_or_equal:today',
            'estado' => 'required|in:activo,inactivo,suspendido',
            'observaciones' => 'nullable|string|max:500',
        ]);

        $socio->update($validated);

        return redirect()->route('socios.index')
            ->with('success', 'Socio actualizado exitosamente.');
    }

    public function destroy(Socio $socio)
    {
        $socio->delete();

        return redirect()->route('socios.index')
            ->with('success', 'Socio eliminado exitosamente.');
    }

    public function aportes()
    {
        $socios = Socio::select('id', 'nombre', 'apellido', 'aporte_inicial', 'aporte_mensual')
            ->where('estado', 'activo')
            ->get();

        $total_aportes = (float) $socios->sum(fn($s) => $s->aporte_inicial + $s->aporte_mensual);

        $chartData = [
            'labels' => $socios->map(fn($s) => $s->nombre . ' ' . $s->apellido),
            'datasets' => [
                [
                    'label' => 'Aporte Inicial',
                    'data' => $socios->map(fn($s) => (float) $s->aporte_inicial),
                    'backgroundColor' => 'rgba(59, 130, 246, 0.5)',
                    'borderColor' => 'rgb(59, 130, 246)',
                    'borderWidth' => 1,
                ],
                [
                    'label' => 'Aporte Mensual',
                    'data' => $socios->map(fn($s) => (float) $s->aporte_mensual),
                    'backgroundColor' => 'rgba(16, 185, 129, 0.5)',
                    'borderColor' => 'rgb(16, 185, 129)',
                    'borderWidth' => 1,
                ],
            ],
        ];

        return Inertia::render('Socios/Aportes', [
            'socios' => $socios,
            'total_aportes' => $total_aportes,
            'chartData' => $chartData,
        ]);
    }

    public function export()
    {
        return redirect()->back()->with('info', 'Funcion de exportacion en desarrollo');
    }
}
