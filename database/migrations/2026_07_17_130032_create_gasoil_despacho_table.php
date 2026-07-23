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
        Schema::create('gasoil_despacho', function (Blueprint $table) {
            $table->id();
            $table->date('fecha');
            $table->string('destino'); // 'campo', 'maquinaria', 'venta'
            $table->string('responsable');
            $table->string('equipo_vehiculo');
            $table->decimal('cantidad_galones', 10, 2);
            $table->decimal('kilometraje')->nullable();
            $table->text('observaciones')->nullable();
            $table->foreignId('recepcion_id')->nullable()->constrained('gasoil_recepcion');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gasoil_despacho');
    }
};
