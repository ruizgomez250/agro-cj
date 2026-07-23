<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Proveedor extends Model
{
    use HasFactory;

    protected $table = 'proveedores';

    protected $fillable = [
        'nombre',
        'ruc',
        'telefono',
        'email',
        'direccion',
        'especialidad',
        'observaciones',
        'activo',
    ];

    protected $casts = [
        'activo' => 'boolean',
    ];

    public function insumos()
    {
        return $this->hasMany(Insumo::class);
    }

    public function compras()
    {
        return $this->hasMany(Compra::class);
    }

    public function recepcionesGasoil()
    {
        return $this->hasMany(GasoilRecepcion::class);
    }
}
