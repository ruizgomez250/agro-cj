<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CultivoInsumo extends Model
{
    use HasFactory;

    protected $table = 'cultivo_insumos';

    protected $fillable = [
        'cultivo_id',
        'insumo_id',
        'fecha_programada',
        'fecha_aplicacion',
        'cantidad_aplicada',
        'estado',
        'user_id',
        'observaciones',
    ];

    protected $casts = [
        'fecha_programada' => 'date',
        'fecha_aplicacion' => 'date',
        'cantidad_aplicada' => 'decimal:2',
    ];

    public function cultivo()
    {
        return $this->belongsTo(Cultivo::class);
    }

    public function insumo()
    {
        return $this->belongsTo(Insumo::class);
    }

    public function user()
    {
        return $this->belongsTo(\App\Models\User::class);
    }
}
