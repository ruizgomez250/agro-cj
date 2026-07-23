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
        Schema::create('contratistas', function (Blueprint $table) {
            $table->id();
            $table->string('nombre'); // Amarildo, Rudi, Sidinei, etc.
            $table->string('cedula')->unique();
            $table->string('telefono');
            $table->string('especialidad'); // 'agricultura', 'transporte', 'mantenimiento'
            $table->decimal('tarifa_hora', 10, 2)->nullable();
            $table->decimal('saldo_actual', 10, 2)->default(0);
            $table->text('observaciones')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contratistas');
    }
};
