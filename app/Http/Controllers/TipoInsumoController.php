<?php

namespace App\Http\Controllers;

use App\Models\TipoInsumo;
use Illuminate\Http\Request;

class TipoInsumoController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:100|unique:tipo_insumos,nombre',
        ]);

        TipoInsumo::create($validated);

        return redirect()->back()->with('success', 'Tipo creado correctamente.');
    }
}
