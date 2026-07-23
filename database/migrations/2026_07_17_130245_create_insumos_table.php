<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('insumos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre'); // 'fertilizante', 'semilla', 'agroquímico'
            $table->string('tipo');
            $table->string('proveedor');
            $table->decimal('cantidad', 10, 2);
            $table->string('unidad'); // 'kg', 'litros', 'unidades'
            $table->decimal('costo_unitario', 10, 2);
            $table->decimal('total', 10, 2);
            $table->date('fecha_recepcion');
            $table->string('factura')->nullable();
            $table->foreignId('cultivo_id')->nullable()->constrained('cultivos');
            $table->text('observaciones')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('insumos');
    }
};
