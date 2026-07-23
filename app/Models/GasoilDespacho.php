<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GasoilDespacho extends Model
{
    use HasFactory;

    protected $table = 'gasoil_despacho';

    protected $fillable = [
        'fecha',
        'destino',
        'responsable',
        'equipo_vehiculo',
        'cantidad_galones',
        'kilometraje',
        'observaciones',
        'recepcion_id'
    ];

    protected $casts = [
        'fecha' => 'date',
        'cantidad_galones' => 'decimal:2',
        'kilometraje' => 'decimal:2'
    ];

    // Relación con recepción
    public function recepcion()
    {
        return $this->belongsTo(GasoilRecepcion::class, 'recepcion_id');
    }
}