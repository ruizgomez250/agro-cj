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
        // En la migración
        Schema::create('socios', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('apellido');
            $table->string('cedula')->unique();
            $table->string('telefono')->nullable();
            $table->string('email')->nullable();
            $table->decimal('aporte_inicial', 10, 2)->default(0);
            $table->decimal('aporte_mensual', 10, 2)->default(0);
            $table->date('fecha_ingreso');
            $table->enum('estado', ['activo', 'inactivo', 'suspendido'])->default('activo');
            $table->text('observaciones')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('socios');
    }
};
