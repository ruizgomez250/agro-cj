<?php

namespace App\Http\Controllers;

use App\Models\Compra;
use App\Models\Insumo;
use App\Models\GasoilRecepcion;
use App\Models\Producto;
use App\Models\Proveedor;
use App\Models\Cultivo;
use App\Models\TipoInsumo;
use App\Models\UnidadMedida;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class CompraController extends Controller
{
    public function index(Request $request)
    {
        $query = Compra::with('proveedor');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('descripcion', 'LIKE', "%{$search}%")
                  ->orWhere('factura', 'LIKE', "%{$search}%")
                  ->orWhereHas('proveedor', function ($q2) use ($search) {
                      $q2->where('nombre', 'LIKE', "%{$search}%");
                  });
            });
        }

        if ($request->filled('estado')) {
            $query->where('estado', $request->estado);
        }

        if ($request->filled('tipo')) {
            $query->where('tipo', $request->tipo);
        }

        if ($request->filled('proveedor_id')) {
            $query->where('proveedor_id', $request->proveedor_id);
        }

        $compras = $query->latest()->paginate(10)->withQueryString();
        $proveedores = Proveedor::where('activo', true)->select('id', 'nombre')->get();

        $totalCompras = (float) Compra::sum('monto');
        $totalPendiente = (float) Compra::where('estado', 'pendiente')->sum('monto');
        $totalPagada = (float) Compra::where('estado', 'pagada')->sum('monto');

        return Inertia::render('Compras/Index', [
            'compras' => $compras,
            'proveedores' => $proveedores,
            'stats' => [
                'total' => $totalCompras,
                'pendiente' => $totalPendiente,
                'pagada' => $totalPagada,
            ],
            'filters' => $request->only(['search', 'estado', 'tipo', 'proveedor_id']),
        ]);
    }

    public function create()
    {
        $proveedores = Proveedor::where('activo', true)->select('id', 'nombre')->get();
        $cultivos = Cultivo::where('estado', 'activo')->select('id', 'nombre', 'variedad', 'lote_parcela')->get();
        $tiposInsumo = TipoInsumo::orderBy('nombre')->get();
        $unidades = UnidadMedida::orderBy('nombre')->get();
        $productos = Producto::where('activo', true)->select('id', 'nombre', 'precio_unitario', 'unidad', 'stock')->get();

        return Inertia::render('Compras/Create', [
            'proveedores' => $proveedores,
            'cultivos' => $cultivos,
            'tiposInsumo' => $tiposInsumo,
            'unidades' => $unidades,
            'productos' => $productos,
        ]);
    }

    public function store(Request $request)
    {
        DB::beginTransaction();

        try {
            $validated = $request->validate([
                'fecha' => 'required|date|before_or_equal:today',
                'tipo' => 'required|in:general,insumo,gasoil,producto',
                'proveedor_id' => 'required|exists:proveedores,id',
                'descripcion' => 'required|string|max:500',
                'monto' => 'required|numeric|min:0.01',
                'factura' => 'nullable|string|max:255',
                'estado' => 'required|in:pendiente,pagada,cancelada',
                'observaciones' => 'nullable|string|max:500',
                'insumo_nombre' => 'required_if:tipo,insumo|nullable|string|max:255',
                'insumo_tipo' => 'nullable|string|max:100',
                'insumo_cantidad' => 'required_if:tipo,insumo|nullable|numeric|min:0.01',
                'insumo_unidad' => 'nullable|string|max:50',
                'insumo_costo_unitario' => 'nullable|numeric|min:0',
                'insumo_cultivo_id' => 'nullable|exists:cultivos,id',
                'gasoil_guia_remision' => 'required_if:tipo,gasoil|nullable|string|max:50',
                'gasoil_cantidad_galones' => 'required_if:tipo,gasoil|nullable|numeric|min:0.01',
                'gasoil_precio_galon' => 'nullable|numeric|min:0',
                'producto_id' => 'required_if:tipo,producto|nullable|exists:productos,id',
                'producto_cantidad' => 'required_if:tipo,producto|nullable|numeric|min:0.01',
            ]);

            $proveedor = Proveedor::find($validated['proveedor_id']);

            $compra = Compra::create([
                'fecha' => $validated['fecha'],
                'tipo' => $validated['tipo'],
                'proveedor_id' => $validated['proveedor_id'],
                'descripcion' => $validated['descripcion'],
                'monto' => $validated['monto'],
                'factura' => $validated['factura'] ?? null,
                'estado' => $validated['estado'],
                'observaciones' => $validated['observaciones'] ?? null,
            ]);

            if ($validated['tipo'] === 'insumo' && !empty($validated['insumo_nombre'])) {
                $costoU = $validated['insumo_costo_unitario'] ?? $validated['monto'];
                $cantidad = $validated['insumo_cantidad'] ?? 1;

                Insumo::create([
                    'nombre' => $validated['insumo_nombre'],
                    'tipo' => $validated['insumo_tipo'] ?? '',
                    'proveedor' => $proveedor->nombre ?? '',
                    'proveedor_id' => $validated['proveedor_id'],
                    'compra_id' => $compra->id,
                    'cantidad' => $cantidad,
                    'unidad' => $validated['insumo_unidad'] ?? '',
                    'costo_unitario' => $costoU,
                    'total' => $cantidad * $costoU,
                    'fecha_recepcion' => $validated['fecha'],
                    'factura' => $validated['factura'] ?? null,
                    'cultivo_id' => $validated['insumo_cultivo_id'] ?? null,
                ]);
            }

            if ($validated['tipo'] === 'gasoil' && !empty($validated['gasoil_guia_remision'])) {
                $galones = $validated['gasoil_cantidad_galones'] ?? 0;
                $precio = $validated['gasoil_precio_galon'] ?? 0;

                GasoilRecepcion::create([
                    'fecha' => $validated['fecha'],
                    'proveedor' => $proveedor->nombre ?? '',
                    'proveedor_id' => $validated['proveedor_id'],
                    'compra_id' => $compra->id,
                    'guia_remision' => $validated['gasoil_guia_remision'],
                    'cantidad_galones' => $galones,
                    'precio_galon' => $precio,
                    'total' => $galones * $precio,
                    'observaciones' => $validated['observaciones'] ?? null,
                ]);
            }

            if ($validated['tipo'] === 'producto' && !empty($validated['producto_id'])) {
                $producto = Producto::find($validated['producto_id']);
                $cantidad = $validated['producto_cantidad'] ?? 1;

                if ($producto) {
                    $producto->increment('stock', $cantidad);
                }
            }

            DB::commit();

            return redirect()->route('compras.index')
                ->with('success', 'Compra registrada exitosamente.');

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function edit(Compra $compra)
    {
        $proveedores = Proveedor::where('activo', true)->select('id', 'nombre')->get();
        $cultivos = Cultivo::where('estado', 'activo')->select('id', 'nombre', 'variedad', 'lote_parcela')->get();
        $tiposInsumo = TipoInsumo::orderBy('nombre')->get();
        $unidades = UnidadMedida::orderBy('nombre')->get();
        $productos = Producto::where('activo', true)->select('id', 'nombre', 'precio_unitario', 'unidad', 'stock')->get();

        $compra->load(['insumos', 'recepcionesGasoil']);

        return Inertia::render('Compras/Edit', [
            'compra' => $compra,
            'proveedores' => $proveedores,
            'cultivos' => $cultivos,
            'tiposInsumo' => $tiposInsumo,
            'unidades' => $unidades,
            'productos' => $productos,
        ]);
    }

    public function update(Request $request, Compra $compra)
    {
        DB::beginTransaction();

        try {
            $validated = $request->validate([
                'fecha' => 'required|date|before_or_equal:today',
                'tipo' => 'required|in:general,insumo,gasoil,producto',
                'proveedor_id' => 'required|exists:proveedores,id',
                'descripcion' => 'required|string|max:500',
                'monto' => 'required|numeric|min:0.01',
                'factura' => 'nullable|string|max:255',
                'estado' => 'required|in:pendiente,pagada,cancelada',
                'observaciones' => 'nullable|string|max:500',
                'insumo_nombre' => 'required_if:tipo,insumo|nullable|string|max:255',
                'insumo_tipo' => 'nullable|string|max:100',
                'insumo_cantidad' => 'required_if:tipo,insumo|nullable|numeric|min:0.01',
                'insumo_unidad' => 'nullable|string|max:50',
                'insumo_costo_unitario' => 'nullable|numeric|min:0',
                'insumo_cultivo_id' => 'nullable|exists:cultivos,id',
                'gasoil_guia_remision' => 'required_if:tipo,gasoil|nullable|string|max:50',
                'gasoil_cantidad_galones' => 'required_if:tipo,gasoil|nullable|numeric|min:0.01',
                'gasoil_precio_galon' => 'nullable|numeric|min:0',
                'producto_id' => 'required_if:tipo,producto|nullable|exists:productos,id',
                'producto_cantidad' => 'required_if:tipo,producto|nullable|numeric|min:0.01',
            ]);

            $proveedor = Proveedor::find($validated['proveedor_id']);

            $compra->update([
                'fecha' => $validated['fecha'],
                'tipo' => $validated['tipo'],
                'proveedor_id' => $validated['proveedor_id'],
                'descripcion' => $validated['descripcion'],
                'monto' => $validated['monto'],
                'factura' => $validated['factura'] ?? null,
                'estado' => $validated['estado'],
                'observaciones' => $validated['observaciones'] ?? null,
            ]);

            if ($validated['tipo'] === 'insumo') {
                $compra->insumos()->delete();

                $costoU = $validated['insumo_costo_unitario'] ?? $validated['monto'];
                $cantidad = $validated['insumo_cantidad'] ?? 1;

                Insumo::create([
                    'nombre' => $validated['insumo_nombre'] ?? '',
                    'tipo' => $validated['insumo_tipo'] ?? '',
                    'proveedor' => $proveedor->nombre ?? '',
                    'proveedor_id' => $validated['proveedor_id'],
                    'compra_id' => $compra->id,
                    'cantidad' => $cantidad,
                    'unidad' => $validated['insumo_unidad'] ?? '',
                    'costo_unitario' => $costoU,
                    'total' => $cantidad * $costoU,
                    'fecha_recepcion' => $validated['fecha'],
                    'factura' => $validated['factura'] ?? null,
                    'cultivo_id' => $validated['insumo_cultivo_id'] ?? null,
                ]);
            } elseif ($validated['tipo'] === 'gasoil') {
                $compra->recepcionesGasoil()->delete();

                $galones = $validated['gasoil_cantidad_galones'] ?? 0;
                $precio = $validated['gasoil_precio_galon'] ?? 0;

                GasoilRecepcion::create([
                    'fecha' => $validated['fecha'],
                    'proveedor' => $proveedor->nombre ?? '',
                    'proveedor_id' => $validated['proveedor_id'],
                    'compra_id' => $compra->id,
                    'guia_remision' => $validated['gasoil_guia_remision'] ?? '',
                    'cantidad_galones' => $galones,
                    'precio_galon' => $precio,
                    'total' => $galones * $precio,
                    'observaciones' => $validated['observaciones'] ?? null,
                ]);
            } elseif ($validated['tipo'] === 'producto' && !empty($validated['producto_id'])) {
                $producto = Producto::find($validated['producto_id']);
                $cantidad = $validated['producto_cantidad'] ?? 1;

                if ($producto) {
                    $producto->increment('stock', $cantidad);
                }
            }

            DB::commit();

            return redirect()->route('compras.index')
                ->with('success', 'Compra actualizada exitosamente.');

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function destroy(Compra $compra)
    {
        $compra->delete();

        return redirect()->route('compras.index')
            ->with('success', 'Compra eliminada exitosamente.');
    }
}
