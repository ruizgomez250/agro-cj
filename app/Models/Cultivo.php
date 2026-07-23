<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cultivo extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'variedad',
        'hectareas',
        'fecha_siembra',
        'fecha_cosecha',
        'lote_id',
        'rendimiento_estimado',
        'estado',
        'observaciones',
    ];

    protected $casts = [
        'fecha_siembra' => 'date',
        'fecha_cosecha' => 'date',
        'hectareas' => 'decimal:2',
        'rendimiento_estimado' => 'decimal:2'
    ];

    public function insumos()
    {
        return $this->hasMany(Insumo::class);
    }

    public function lote()
    {
        return $this->belongsTo(Lote::class);
    }
}