<?php

namespace App\Http\Controllers;

use App\Models\UnidadMedida;
use Illuminate\Http\Request;

class UnidadMedidaController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:100|unique:unidad_medidas,nombre',
            'abreviatura' => 'required|string|max:20|unique:unidad_medidas,abreviatura',
        ]);

        $unidad = UnidadMedida::create($validated);

        return redirect()->back()->with('success', 'Unidad creada correctamente.');
    }
}
