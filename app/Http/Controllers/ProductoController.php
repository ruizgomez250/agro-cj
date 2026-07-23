<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductoController extends Controller
{
    public function index(Request $request)
    {
        $query = Producto::query();

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

        $productos = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Productos/Index', [
            'productos' => $productos,
            'filters' => $request->only(['search', 'activo']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Productos/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255|unique:productos,nombre',
            'descripcion' => 'nullable|string|max:500',
            'precio_unitario' => 'required|numeric|min:0',
            'unidad' => 'required|string|max:20',
            'stock' => 'required|numeric|min:0',
        ]);

        Producto::create($validated);

        return redirect()->route('productos.index')->with('success', 'Producto creado exitosamente.');
    }

    public function edit(Producto $producto)
    {
        return Inertia::render('Productos/Edit', ['producto' => $producto]);
    }

    public function update(Request $request, Producto $producto)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255|unique:productos,nombre,' . $producto->id,
            'descripcion' => 'nullable|string|max:500',
            'precio_unitario' => 'required|numeric|min:0',
            'unidad' => 'required|string|max:20',
            'stock' => 'required|numeric|min:0',
        ]);

        $producto->update($validated);

        return redirect()->route('productos.index')->with('success', 'Producto actualizado exitosamente.');
    }

    public function destroy(Producto $producto)
    {
        $producto->delete();
        return redirect()->route('productos.index')->with('success', 'Producto eliminado exitosamente.');
    }
}
