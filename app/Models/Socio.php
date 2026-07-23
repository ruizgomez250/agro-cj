<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Socio extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'apellido',
        'cedula',
        'telefono',
        'email',
        'aporte_inicial',
        'aporte_mensual',
        'fecha_ingreso',
        'estado',
        'observaciones',
    ];

    protected $casts = [
        'fecha_ingreso' => 'date',
        'aporte_inicial' => 'decimal:2',
        'aporte_mensual' => 'decimal:2'
    ];

    // Accessor para nombre completo
    public function getNombreCompletoAttribute()
    {
        return "{$this->nombre} {$this->apellido}";
    }
}