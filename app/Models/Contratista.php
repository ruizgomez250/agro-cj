<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contratista extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'cedula',
        'telefono',
        'especialidad',
        'tarifa_hora',
        'saldo_actual',
        'observaciones'
    ];

    protected $casts = [
        'tarifa_hora' => 'decimal:2',
        'saldo_actual' => 'decimal:2'
    ];
}