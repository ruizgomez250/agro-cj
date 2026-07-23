<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('compras', function (Blueprint $table) {
            $table->id();
            $table->date('fecha');
            $table->foreignId('proveedor_id')->constrained('proveedores');
            $table->string('descripcion');
            $table->decimal('monto', 12, 2);
            $table->string('factura')->nullable();
            $table->string('estado')->default('pendiente'); // pendiente, pagada, cancelada
            $table->text('observaciones')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('compras');
    }
};
