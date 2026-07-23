<?php

namespace App\Http\Controllers;

use App\Models\Gasto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class GastoController extends Controller
{
    public function index(Request $request)
    {
        $query = Gasto::with('usuario');

        if ($request->filled('categoria')) {
            $query->where('categoria', $request->categoria);
        }

        if ($request->filled('fecha_desde')) {
            $query->whereDate('fecha', '>=', $request->fecha_desde);
        }
        if ($request->filled('fecha_hasta')) {
            $query->whereDate('fecha', '<=', $request->fecha_hasta);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('concepto', 'LIKE', "%{$search}%");
        }

        $sortField = $request->get('sort', 'fecha');
        $sortDirection = $request->get('direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        $gastos = $query->paginate(10)->withQueryString();

        $resumenCategorias = Gasto::select('categoria', DB::raw('SUM(monto) as total'))
            ->groupBy('categoria')
            ->get()
            ->pluck('total', 'categoria');

        $totalGeneral = (float) Gasto::sum('monto');

        return Inertia::render('Gastos/Index', [
            'gastos' => $gastos,
            'resumenCategorias' => $resumenCategorias,
            'totalGeneral' => $totalGeneral,
            'filters' => $request->only(['categoria', 'fecha_desde', 'fecha_hasta', 'search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Gastos/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'concepto' => 'required|string|max:255',
            'categoria' => 'required|string|max:100',
            'monto' => 'required|numeric|min:0.01',
            'fecha' => 'required|date|before_or_equal:today',
            'descripcion' => 'nullable|string|max:500',
            'comprobante' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
        ]);

        if ($request->hasFile('comprobante')) {
            $validated['comprobante'] = $request->file('comprobante')->store('comprobantes', 'public');
        }

        $validated['usuario_id'] = Auth::id();

        Gasto::create($validated);

        return redirect()->route('gastos.index')
            ->with('success', 'Gasto registrado exitosamente.');
    }

    public function show(Gasto $gasto)
    {
        $gasto->load('usuario');

        return Inertia::render('Gastos/Show', [
            'gasto' => $gasto,
        ]);
    }

    public function edit(Gasto $gasto)
    {
        return Inertia::render('Gastos/Edit', [
            'gasto' => $gasto,
        ]);
    }

    public function update(Request $request, Gasto $gasto)
    {
        $validated = $request->validate([
            'concepto' => 'required|string|max:255',
            'categoria' => 'required|string|max:100',
            'monto' => 'required|numeric|min:0.01',
            'fecha' => 'required|date|before_or_equal:today',
            'descripcion' => 'nullable|string|max:500',
            'comprobante' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
        ]);

        if ($request->hasFile('comprobante')) {
            if ($gasto->comprobante) {
                Storage::disk('public')->delete($gasto->comprobante);
            }
            $validated['comprobante'] = $request->file('comprobante')->store('comprobantes', 'public');
        }

        $gasto->update($validated);

        return redirect()->route('gastos.index')
            ->with('success', 'Gasto actualizado exitosamente.');
    }

    public function destroy(Gasto $gasto)
    {
        if ($gasto->comprobante) {
            Storage::disk('public')->delete($gasto->comprobante);
        }

        $gasto->delete();

        return redirect()->route('gastos.index')
            ->with('success', 'Gasto eliminado exitosamente.');
    }

    public function resumen()
    {
        $gastosMes = Gasto::select(
                DB::raw('MONTH(fecha) as mes'),
                DB::raw('SUM(monto) as total')
            )
            ->whereYear('fecha', now()->year)
            ->groupBy('mes')
            ->orderBy('mes')
            ->get();

        $meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        $datosGrafico = [];
        foreach ($meses as $index => $mes) {
            $datosGrafico[$mes] = (float) ($gastosMes->firstWhere('mes', $index + 1)?->total ?? 0);
        }

        $gastosCategoria = Gasto::select('categoria', DB::raw('SUM(monto) as total'))
            ->whereYear('fecha', now()->year)
            ->groupBy('categoria')
            ->get();

        $totalMes = (float) Gasto::whereMonth('fecha', now()->month)->whereYear('fecha', now()->year)->sum('monto');
        $totalAnio = (float) Gasto::whereYear('fecha', now()->year)->sum('monto');
        $totalGeneral = (float) Gasto::sum('monto');

        return Inertia::render('Gastos/Resumen', [
            'datosGrafico' => $datosGrafico,
            'gastosCategoria' => $gastosCategoria,
            'totalMes' => $totalMes,
            'totalAnio' => $totalAnio,
            'totalGeneral' => $totalGeneral,
        ]);
    }
}
