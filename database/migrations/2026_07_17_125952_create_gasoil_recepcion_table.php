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
        Schema::create('gasoil_recepcion', function (Blueprint $table) {
            $table->id();
            $table->date('fecha');
            $table->string('proveedor');
            $table->string('guia_remision');
            $table->decimal('cantidad_galones', 10, 2);
            $table->decimal('precio_galon', 10, 2);
            $table->decimal('total', 10, 2);
            $table->string('comprobante')->nullable();
            $table->text('observaciones')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gasoil_recepcion');
    }
};
