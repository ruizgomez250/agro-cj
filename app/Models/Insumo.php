<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Insumo extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'tipo',
        'proveedor',
        'proveedor_id',
        'compra_id',
        'cantidad',
        'unidad',
        'costo_unitario',
        'total',
        'fecha_recepcion',
        'factura',
        'cultivo_id',
        'observaciones',
    ];

    protected $casts = [
        'cantidad' => 'decimal:2',
        'costo_unitario' => 'decimal:2',
        'total' => 'decimal:2',
        'fecha_recepcion' => 'date'
    ];

    // Relación con cultivo
    public function cultivo()
    {
        return $this->belongsTo(Cultivo::class);
    }

    public function proveedor_rel()
    {
        return $this->belongsTo(Proveedor::class);
    }

    public function compra()
    {
        return $this->belongsTo(Compra::class);
    }
}