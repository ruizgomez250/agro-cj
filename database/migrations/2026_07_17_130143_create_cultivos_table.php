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
        Schema::create('cultivos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre'); // 'maíz', 'soja', 'trigo'
            $table->string('variedad');
            $table->decimal('hectareas', 8, 2);
            $table->date('fecha_siembra');
            $table->date('fecha_cosecha')->nullable();
            $table->string('lote_parcela');
            $table->decimal('rendimiento_estimado', 10, 2)->nullable();
            $table->enum('estado', ['activo', 'cosechado', 'abandonado'])->default('activo');
            $table->text('observaciones')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cultivos');
    }
};
