<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cultivo_insumos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cultivo_id')->constrained('cultivos')->cascadeOnDelete();
            $table->foreignId('insumo_id')->constrained('insumos')->cascadeOnDelete();
            $table->date('fecha_programada');
            $table->date('fecha_aplicacion')->nullable();
            $table->decimal('cantidad_aplicada', 10, 2);
            $table->enum('estado', ['programado', 'aplicado'])->default('programado');
            $table->foreignId('user_id')->constrained('users');
            $table->text('observaciones')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cultivo_insumos');
    }
};
