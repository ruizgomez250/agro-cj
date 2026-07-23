<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Compra extends Model
{
    use HasFactory;

    protected $fillable = [
        'fecha',
        'tipo',
        'proveedor_id',
        'descripcion',
        'monto',
        'factura',
        'estado',
        'observaciones',
    ];

    protected $casts = [
        'fecha' => 'date',
        'monto' => 'decimal:2',
    ];

    public function proveedor()
    {
        return $this->belongsTo(Proveedor::class);
    }

    public function insumos()
    {
        return $this->hasMany(Insumo::class);
    }

    public function recepcionesGasoil()
    {
        return $this->hasMany(GasoilRecepcion::class);
    }
}
