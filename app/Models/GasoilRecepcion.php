<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GasoilRecepcion extends Model
{
    use HasFactory;

    protected $table = 'gasoil_recepcion';

    protected $fillable = [
        'fecha',
        'proveedor',
        'proveedor_id',
        'compra_id',
        'guia_remision',
        'cantidad_galones',
        'precio_galon',
        'total',
        'comprobante',
        'observaciones',
    ];

    protected $casts = [
        'fecha' => 'date',
        'cantidad_galones' => 'decimal:2',
        'precio_galon' => 'decimal:2',
        'total' => 'decimal:2'
    ];

    // Relación con despachos
    public function despachos()
    {
        return $this->hasMany(GasoilDespacho::class, 'recepcion_id');
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