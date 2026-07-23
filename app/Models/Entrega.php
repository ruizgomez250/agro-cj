<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Entrega extends Model
{
    use HasFactory;

    protected $fillable = ['empleado_id', 'user_id', 'tipo', 'referencia_id', 'cantidad', 'fecha', 'observaciones'];

    protected $casts = [
        'cantidad' => 'decimal:2',
        'fecha' => 'date',
    ];

    public function empleado()
    {
        return $this->belongsTo(Empleado::class);
    }

    public function user()
    {
        return $this->belongsTo(\App\Models\User::class);
    }

    public function referencia()
    {
        return $this->morphTo();
    }
}
