<?php

namespace App\Http\Controllers;

use App\Models\GasoilDespacho;
use App\Models\GasoilRecepcion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class GasoilDespachoController extends Controller
{
    public function index(Request $request)
    {
        $query = GasoilDespacho::with('recepcion');

        if ($request->filled('destino')) {
            $query->where('destino', $request->destino);
        }

        if ($request->filled('responsable')) {
            $query->where('responsable', 'LIKE', "%{$request->responsable}%");
        }

        if ($request->filled('fecha_desde')) {
            $query->whereDate('fecha', '>=', $request->fecha_desde);
        }
        if ($request->filled('fecha_hasta')) {
            $query->whereDate('fecha', '<=', $request->fecha_hasta);
        }

        $despachos = $query->orderBy('fecha', 'desc')
            ->paginate(10)
            ->withQueryString();

        $resumen = [
            'total_galones' => (float) GasoilDespacho::sum('cantidad_galones'),
            'total_despachos' => GasoilDespacho::count(),
            'por_destino' => GasoilDespacho::select('destino', DB::raw('SUM(cantidad_galones) as total'))
                ->groupBy('destino')
                ->get(),
        ];

        return Inertia::render('Gasoil/Despacho/Index', [
            'despachos' => $despachos,
            'resumen' => $resumen,
            'filters' => $request->only(['destino', 'responsable', 'fecha_desde', 'fecha_hasta']),
        ]);
    }

    public function create()
    {
        $recepciones = $this->getRecepcionesConStock();

        return Inertia::render('Gasoil/Despacho/Create', [
            'recepciones' => $recepciones,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'fecha' => 'required|date|before_or_equal:today',
            'destino' => 'required|string|max:255',
            'responsable' => 'required|string|max:255',
            'equipo_vehiculo' => 'required|string|max:255',
            'cantidad_galones' => 'required|numeric|min:0.01',
            'kilometraje' => 'nullable|numeric|min:0',
            'observaciones' => 'nullable|string|max:500',
            'recepcion_id' => 'required|exists:gasoil_recepcion,id',
        ], [
            'fecha' => 'fecha',
            'destino' => 'destino',
            'responsable' => 'responsable',
            'equipo_vehiculo' => 'equipo/vehiculo',
            'cantidad_galones' => 'cantidad de litros',
            'kilometraje' => 'kilometraje',
            'observaciones' => 'observaciones',
            'recepcion_id' => 'recepcion de origen',
        ]);

        $recepcion = GasoilRecepcion::withSum('despachos', 'cantidad_galones')
            ->find($validated['recepcion_id']);

        $stockDisponible = $recepcion->cantidad_galones - ($recepcion->despachos_sum_cantidad_galones ?? 0);

        if ($validated['cantidad_galones'] > $stockDisponible) {
                return back()->withErrors(['cantidad_galones' => "Stock insuficiente. Disponible: {$stockDisponible} litros."]);
        }

        GasoilDespacho::create($validated);

        return redirect()->route('gasoil.despacho.index')
            ->with('success', 'Despacho registrado exitosamente.');
    }

    public function show(GasoilDespacho $despacho)
    {
        $despacho->load('recepcion');

        return Inertia::render('Gasoil/Despacho/Show', [
            'despacho' => $despacho,
        ]);
    }

    public function edit(GasoilDespacho $despacho)
    {
        $recepciones = $this->getRecepcionesConStock();

        return Inertia::render('Gasoil/Despacho/Edit', [
            'despacho' => $despacho,
            'recepciones' => $recepciones,
        ]);
    }

    public function update(Request $request, GasoilDespacho $despacho)
    {
        $validated = $request->validate([
            'fecha' => 'required|date|before_or_equal:today',
            'destino' => 'required|string|max:255',
            'responsable' => 'required|string|max:255',
            'equipo_vehiculo' => 'required|string|max:255',
            'cantidad_galones' => 'required|numeric|min:0.01',
            'kilometraje' => 'nullable|numeric|min:0',
            'observaciones' => 'nullable|string|max:500',
            'recepcion_id' => 'required|exists:gasoil_recepcion,id',
        ], [
            'fecha' => 'fecha',
            'destino' => 'destino',
            'responsable' => 'responsable',
            'equipo_vehiculo' => 'equipo/vehiculo',
            'cantidad_galones' => 'cantidad de litros',
            'kilometraje' => 'kilometraje',
            'observaciones' => 'observaciones',
            'recepcion_id' => 'recepcion de origen',
        ]);

        if ($despacho->recepcion_id != $validated['recepcion_id'] ||
            $despacho->cantidad_galones != $validated['cantidad_galones']) {

            $recepcion = GasoilRecepcion::withSum('despachos', 'cantidad_galones')
                ->find($validated['recepcion_id']);

            $stockDisponible = $recepcion->cantidad_galones - ($recepcion->despachos_sum_cantidad_galones ?? 0);

            if ($despacho->recepcion_id == $validated['recepcion_id']) {
                $stockDisponible += $despacho->cantidad_galones;
            }

            if ($validated['cantidad_galones'] > $stockDisponible) {
            return back()->withErrors(['cantidad_galones' => "Stock insuficiente. Disponible: {$stockDisponible} litros."]);
            }
        }

        $despacho->update($validated);

        return redirect()->route('gasoil.despacho.index')
            ->with('success', 'Despacho actualizado exitosamente.');
    }

    public function destroy(GasoilDespacho $despacho)
    {
        $despacho->delete();

        return redirect()->route('gasoil.despacho.index')
            ->with('success', 'Despacho eliminado exitosamente.');
    }

    public function stock()
    {
        $recepciones = GasoilRecepcion::withSum('despachos', 'cantidad_galones')
            ->get()
            ->map(function ($recepcion) {
                $despachado = (float) ($recepcion->despachos_sum_cantidad_galones ?? 0);
                $stock = $recepcion->cantidad_galones - $despachado;
                return [
                    'id' => $recepcion->id,
                    'proveedor' => $recepcion->proveedor,
                    'guia' => $recepcion->guia_remision,
                    'fecha' => $recepcion->fecha->format('d/m/Y'),
                    'recibido' => (float) $recepcion->cantidad_galones,
                    'despachado' => $despachado,
                    'stock' => (float) $stock,
                    'estado' => $stock > 0 ? 'Con stock' : 'Sin stock',
                ];
            });

        $totalStock = (float) $recepciones->sum('stock');
        $totalRecibido = (float) $recepciones->sum('recibido');
        $totalDespachado = (float) $recepciones->sum('despachado');

        return Inertia::render('Gasoil/Stock', [
            'recepciones' => $recepciones,
            'totalStock' => $totalStock,
            'totalRecibido' => $totalRecibido,
            'totalDespachado' => $totalDespachado,
        ]);
    }

    public function comprobante(GasoilDespacho $despacho)
    {
        $despacho->load('recepcion');
        $user = auth()->user();

        $logoPath = public_path('img/agrocj.png');
        $logoData = file_exists($logoPath) ? base64_encode(file_get_contents($logoPath)) : '';
        $logoTag = $logoData ? '<img src="data:image/png;base64,' . $logoData . '" style="width:60px;height:60px;" />' : '';

        $html = '<!DOCTYPE html><html><head><meta charset="utf-8">';
        $html .= '<style>';
        $html .= 'body{font-family:Helvetica,sans-serif;font-size:12px;color:#333;margin:0;padding:30px;}';
        $html .= '.header-table{width:100%;border-collapse:collapse;margin-bottom:20px;}';
        $html .= '.header-table td{vertical-align:middle;padding-bottom:15px;border-bottom:3px solid #047857;}';
        $html .= '.header-table td h1{font-size:20px;color:#047857;margin:0;}';
        $html .= '.header-table td h2{font-size:14px;color:#666;margin:5px 0 0;font-weight:normal;}';
        $html .= '.info-box{background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:15px;margin-bottom:20px;}';
        $html .= '.info-box h3{margin:0 0 10px;font-size:13px;color:#047857;text-transform:uppercase;}';
        $html .= '.info-row{margin-bottom:5px;}';
        $html .= '.info-label{font-weight:bold;color:#374151;}';
        $html .= 'table{width:100%;border-collapse:collapse;margin:20px 0;}';
        $html .= 'th{background:#047857;color:#fff;padding:10px;text-align:left;font-size:11px;text-transform:uppercase;}';
        $html .= 'td{padding:10px;border-bottom:1px solid #e5e7eb;}';
        $html .= '.signatures-table{width:100%;border-collapse:collapse;margin-top:60px;page-break-inside:avoid;}';
        $html .= '.signatures-table td{width:50%;text-align:center;vertical-align:top;padding:0 15px;}';
        $html .= '.sig-line{border-top:1px solid #333;margin-top:80px;padding-top:8px;}';
        $html .= '.sig-name{font-weight:bold;font-size:11px;}';
        $html .= '.sig-detail{font-size:10px;color:#666;}';
        $html .= '.footer{text-align:center;margin-top:40px;color:#999;font-size:10px;border-top:1px solid #e5e7eb;padding-top:10px;}';
        $html .= '</style></head><body>';

        $html .= '<table class="header-table"><tr>';
        $html .= '<td style="width:70px;padding-right:15px;">' . $logoTag . '</td>';
        $html .= '<td><h1>COMPROBANTE DE DESPACHO DE GASOIL</h1><h2>Agro CJ - Sistema de Gestion</h2></td>';
        $html .= '</tr></table>';

        $html .= '<div class="info-box">';
        $html .= '<h3>Detalles del Despacho</h3>';
        $html .= '<div class="info-row"><span class="info-label">N Despacho:</span> #' . $despacho->id . '</div>';
        $html .= '<div class="info-row"><span class="info-label">Fecha:</span> ' . $despacho->fecha->format('d/m/Y') . '</div>';
        $html .= '<div class="info-row"><span class="info-label">Destino:</span> ' . $despacho->destino . '</div>';
        $html .= '<div class="info-row"><span class="info-label">Responsable:</span> ' . $despacho->responsable . '</div>';
        $html .= '<div class="info-row"><span class="info-label">Equipo/Vehiculo:</span> ' . ($despacho->equipo_vehiculo ?? '-') . '</div>';
        $html .= '<div class="info-row"><span class="info-label">Kilometraje:</span> ' . ($despacho->kilometraje ?? '-') . '</div>';
        $html .= '</div>';

        $html .= '<table>';
        $html .= '<thead><tr><th>Concepto</th><th>Detalle</th><th>Cantidad</th></tr></thead>';
        $html .= '<tbody>';
        $detalle = 'Guia: ' . ($despacho->recepcion->guia_remision ?? 'N/A');
        $html .= '<tr><td>Gasoil</td><td>' . $detalle . '</td><td><strong>' . $despacho->cantidad_galones . ' litros</strong></td></tr>';
        $html .= '</tbody></table>';

        if ($despacho->observaciones) {
            $html .= '<div style="background:#fffbeb;border:1px solid #fde68a;border-radius:6px;padding:12px;margin:15px 0;">';
            $html .= '<strong>Observaciones:</strong> ' . $despacho->observaciones;
            $html .= '</div>';
        }

        $html .= '<table class="signatures-table"><tr>';
        $html .= '<td><div class="sig-line">';
        $html .= '<div class="sig-name">' . $user->name . '</div>';
        $html .= '<div class="sig-detail">Entregado por</div>';
        $html .= '<div class="sig-detail">' . $user->email . '</div>';
        $html .= '</div></td>';
        $html .= '<td><div class="sig-line">';
        $html .= '<div class="sig-name">' . $despacho->responsable . '</div>';
        $html .= '<div class="sig-detail">Recibido por</div>';
        $html .= '<div class="sig-detail">' . ($despacho->equipo_vehiculo ?? '') . '</div>';
        $html .= '</div></td>';
        $html .= '</tr></table>';

        $html .= '<div class="footer">';
        $html .= 'Documento generado el ' . now()->format('d/m/Y H:i:s') . ' - Agro CJ';
        $html .= '</div>';

        $html .= '</body></html>';

        return Pdf::loadHtml($html)->setPaper('a4', 'portrait')->download('Comprobante_Despacho_' . $despacho->id . '.pdf');
    }

    private function getRecepcionesConStock()
    {
        return GasoilRecepcion::withSum('despachos', 'cantidad_galones')
            ->get()
            ->filter(function ($recepcion) {
                $despachado = (float) ($recepcion->despachos_sum_cantidad_galones ?? 0);
                return $despachado < $recepcion->cantidad_galones;
            })
            ->map(function ($recepcion) {
                $stock = $recepcion->cantidad_galones - ($recepcion->despachos_sum_cantidad_galones ?? 0);
                return [
                    'id' => $recepcion->id,
                    'guia' => $recepcion->guia_remision,
                    'proveedor' => $recepcion->proveedor,
                    'stock_disponible' => (float) $stock,
                    'fecha' => $recepcion->fecha->format('d/m/Y'),
                ];
            })
            ->values();
    }
}
