<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Empleado extends Model
{
    use HasFactory;

    protected $fillable = ['nombre', 'apellido', 'cedula', 'cargo', 'telefono', 'email', 'direccion', 'activo'];

    protected $casts = [
        'activo' => 'boolean',
    ];

    public function nombreCompleto()
    {
        return $this->nombre . ' ' . $this->apellido;
    }

    public function entregas()
    {
        return $this->hasMany(Entrega::class);
    }
}
