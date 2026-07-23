<?php

namespace App\Http\Controllers;

use App\Models\Entrega;
use App\Models\Empleado;
use App\Models\Insumo;
use App\Models\GasoilRecepcion;
use App\Models\Producto;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class EntregaController extends Controller
{
    public function index(Request $request)
    {
        $query = Entrega::with(['empleado', 'user']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('empleado', function ($q) use ($search) {
                $q->where('nombre', 'LIKE', "%{$search}%")
                  ->orWhere('apellido', 'LIKE', "%{$search}%")
                  ->orWhere('cedula', 'LIKE', "%{$search}%");
            });
        }

        if ($request->filled('tipo')) {
            $query->where('tipo', $request->tipo);
        }

        $entregas = $query->latest()->paginate(10)->withQueryString();
        $empleados = Empleado::where('activo', true)->select('id', 'nombre', 'apellido', 'cedula')->get();

        return Inertia::render('Entregas/Index', [
            'entregas' => $entregas,
            'empleados' => $empleados,
            'filters' => $request->only(['search', 'tipo']),
        ]);
    }

    public function create(Request $request)
    {
        $empleados = Empleado::where('activo', true)->select('id', 'nombre', 'apellido', 'cedula')->get();
        $insumos = Insumo::select('id', 'nombre', 'cantidad', 'unidad')->where('cantidad', '>', 0)->get();
        $productos = Producto::where('activo', true)->select('id', 'nombre', 'stock', 'unidad')->where('stock', '>', 0)->get();

        return Inertia::render('Entregas/Create', [
            'empleados' => $empleados,
            'insumos' => $insumos,
            'productos' => $productos,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'empleado_id' => 'required|exists:empleados,id',
            'tipo' => 'required|in:insumo,gasoil,producto',
            'referencia_id' => 'required|numeric',
            'cantidad' => 'required|numeric|min:0.01',
            'fecha' => 'required|date|before_or_equal:today',
            'observaciones' => 'nullable|string|max:500',
        ]);

        $validated['user_id'] = auth()->id();

        $entrega = Entrega::create($validated);

        return redirect()->route('entregas.index')->with('success', 'Entrega registrada exitosamente.');
    }

    public function comprobante(Entrega $entrega)
    {
        $entrega->load(['empleado', 'user']);

        $item = null;
        $itemName = '';
        $itemDetail = '';

        if ($entrega->tipo === 'insumo') {
            $item = Insumo::find($entrega->referencia_id);
            $itemName = $item->nombre ?? 'Insumo eliminado';
            $itemDetail = $item ? $item->cantidad . ' ' . $item->unidad . ' disponible' : '';
        } elseif ($entrega->tipo === 'gasoil') {
            $item = GasoilRecepcion::find($entrega->referencia_id);
            $itemName = 'Gasoil - Guia: ' . ($item->guia_remision ?? 'N/A');
            $itemDetail = $item ? $item->cantidad_galones . ' galones disponibles' : '';
        } elseif ($entrega->tipo === 'producto') {
            $item = Producto::find($entrega->referencia_id);
            $itemName = $item->nombre ?? 'Producto eliminado';
            $itemDetail = $item ? $item->stock . ' ' . $item->unidad . ' disponible' : '';
        }

        $empleado = $entrega->empleado;
        $user = $entrega->user;

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
        $html .= '<td><h1>COMPROBANTE DE ENTREGA</h1><h2>Agro CJ - Sistema de Gestion</h2></td>';
        $html .= '</tr></table>';

        $html .= '<div class="info-box">';
        $html .= '<h3>Detalles de la Entrega</h3>';
        $html .= '<div class="info-row"><span class="info-label">N Entrega:</span> #' . $entrega->id . '</div>';
        $html .= '<div class="info-row"><span class="info-label">Fecha:</span> ' . $entrega->fecha->format('d/m/Y') . '</div>';
        $html .= '<div class="info-row"><span class="info-label">Tipo:</span> ' . ucfirst($entrega->tipo) . '</div>';
        $html .= '</div>';

        $html .= '<table>';
        $html .= '<thead><tr><th>Item</th><th>Detalle</th><th>Cantidad Entregada</th></tr></thead>';
        $html .= '<tbody>';
        $html .= '<tr><td>' . $itemName . '</td><td>' . $itemDetail . '</td><td><strong>' . $entrega->cantidad . '</strong></td></tr>';
        $html .= '</tbody></table>';

        if ($entrega->observaciones) {
            $html .= '<div style="background:#fffbeb;border:1px solid #fde68a;border-radius:6px;padding:12px;margin:15px 0;">';
            $html .= '<strong>Observaciones:</strong> ' . $entrega->observaciones;
            $html .= '</div>';
        }

        $html .= '<table class="signatures-table"><tr>';

        $html .= '<td><div class="sig-line">';
        $html .= '<div class="sig-name">' . $user->name . '</div>';
        $html .= '<div class="sig-detail">Entregado por (Sistema)</div>';
        $html .= '<div class="sig-detail">' . $user->email . '</div>';
        $html .= '</div></td>';

        $html .= '<td><div class="sig-line">';
        $html .= '<div class="sig-name">' . $empleado->nombre . ' ' . $empleado->apellido . '</div>';
        $html .= '<div class="sig-detail">Recibido por</div>';
        $html .= '<div class="sig-detail">CI: ' . $empleado->cedula . ($empleado->cargo ? ' - ' . $empleado->cargo : '') . '</div>';
        $html .= '</div></td>';

        $html .= '</tr></table>';

        $html .= '<div class="footer">';
        $html .= 'Documento generado el ' . now()->format('d/m/Y H:i:s') . ' - Agro CJ';
        $html .= '</div>';

        $html .= '</body></html>';

        return Pdf::loadHtml($html)->setPaper('a4', 'portrait')->download('Comprobante_Entrega_' . $entrega->id . '.pdf');
    }
}
