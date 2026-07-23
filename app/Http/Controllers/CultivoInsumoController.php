<?php

namespace App\Http\Controllers;

use App\Models\CultivoInsumo;
use App\Models\Cultivo;
use App\Models\Insumo;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CultivoInsumoController extends Controller
{
    public function index(Request $request)
    {
        $query = CultivoInsumo::with(['cultivo', 'insumo', 'user']);

        if ($request->filled('cultivo_id')) {
            $query->where('cultivo_id', $request->cultivo_id);
        }

        if ($request->filled('insumo_id')) {
            $query->where('insumo_id', $request->insumo_id);
        }

        if ($request->filled('estado')) {
            $query->where('estado', $request->estado);
        }

        if ($request->filled('fecha_desde')) {
            $query->where('fecha_programada', '>=', $request->fecha_desde);
        }

        if ($request->filled('fecha_hasta')) {
            $query->where('fecha_programada', '<=', $request->fecha_hasta);
        }

        $aplicaciones = $query->orderBy('fecha_programada', 'desc')->paginate(15)->withQueryString();

        $cultivos = Cultivo::where('estado', 'activo')
            ->select('id', 'nombre', 'variedad', 'lote_parcela')
            ->get();

        $insumos = Insumo::where('cantidad', '>', 0)
            ->select('id', 'nombre', 'cantidad', 'unidad', 'costo_unitario')
            ->get();

        $stats = [
            'programados' => CultivoInsumo::where('estado', 'programado')->count(),
            'aplicados' => CultivoInsumo::where('estado', 'aplicado')->count(),
            'costo_total' => (float) CultivoInsumo::where('estado', 'aplicado')
                ->join('insumos', 'cultivo_insumos.insumo_id', '=', 'insumos.id')
                ->sum(\DB::raw('cultivo_insumos.cantidad_aplicada * insumos.costo_unitario')),
        ];

        return Inertia::render('Cultivos/Insumos/Index', [
            'aplicaciones' => $aplicaciones,
            'cultivos' => $cultivos,
            'insumos' => $insumos,
            'stats' => $stats,
            'filters' => $request->only(['cultivo_id', 'insumo_id', 'estado', 'fecha_desde', 'fecha_hasta']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'cultivo_id' => 'required|exists:cultivos,id',
            'insumo_id' => 'required|exists:insumos,id',
            'fecha_programada' => 'required|date|after_or_equal:today',
            'cantidad_aplicada' => 'required|numeric|min:0.01',
            'observaciones' => 'nullable|string|max:500',
        ]);

        $validated['user_id'] = auth()->id();
        $validated['estado'] = 'programado';

        CultivoInsumo::create($validated);

        return redirect()->route('cultivo-insumos.index')
            ->with('success', 'Aplicación programada exitosamente.');
    }

    public function apply(Request $request, $id)
    {
        $aplicacion = CultivoInsumo::findOrFail($id);
        $insumo = Insumo::find($aplicacion->insumo_id);

        if ($aplicacion->estado === 'aplicado') {
            return back()->withErrors(['estado' => 'Esta aplicación ya fue aplicada.']);
        }

        if (!$insumo) {
            return back()->withErrors(['insumo' => 'El insumo asociado (ID: '.$aplicacion->insumo_id.') no existe.']);
        }

        $validated = $request->validate([
            'fecha_aplicacion' => 'required|date',
            'cantidad_aplicada' => 'required|numeric|min:0.01',
        ]);

        \DB::beginTransaction();

        try {
            if ($insumo->cantidad < $validated['cantidad_aplicada']) {
                \DB::rollBack();
                return back()->withErrors(['cantidad_aplicada' => "Stock insuficiente. Disponible: {$insumo->cantidad} {$insumo->unidad}"]);
            }

            $insumo->decrement('cantidad', $validated['cantidad_aplicada']);

            $aplicacion->update([
                'estado' => 'aplicado',
                'fecha_aplicacion' => $validated['fecha_aplicacion'],
                'cantidad_aplicada' => $validated['cantidad_aplicada'],
            ]);

            \DB::commit();

            return redirect()->route('cultivo-insumos.index')
                ->with('success', 'Aplicación registrada y stock descontado exitosamente.');

        } catch (\Exception $e) {
            \DB::rollBack();
            return back()->withErrors(['error' => 'Error al aplicar: ' . $e->getMessage()]);
        }
    }

    public function destroy(CultivoInsumo $aplicacion)
    {
        if ($aplicacion->estado === 'aplicado') {
            return back()->with('error', 'No se puede eliminar una aplicación ya aplicada.');
        }

        $aplicacion->delete();

        return redirect()->route('cultivo-insumos.index')
            ->with('success', 'Programación eliminada exitosamente.');
    }
}
