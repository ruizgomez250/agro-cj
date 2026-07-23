<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lote extends Model
{
    use HasFactory;

    protected $fillable = ['nombre', 'descripcion', 'hectareas', 'latitud', 'longitud', 'activo'];

    protected $casts = [
        'hectareas' => 'decimal:2',
        'latitud' => 'decimal:7',
        'longitud' => 'decimal:7',
        'activo' => 'boolean',
    ];

    public function cultivos()
    {
        return $this->hasMany(Cultivo::class);
    }
}
