<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('compras', function (Blueprint $table) {
            $table->string('tipo')->default('general')->after('fecha');
        });

        Schema::table('insumos', function (Blueprint $table) {
            $table->foreignId('compra_id')->nullable()->after('id')->constrained('compras')->nullOnDelete();
        });

        Schema::table('gasoil_recepcion', function (Blueprint $table) {
            $table->foreignId('compra_id')->nullable()->after('id')->constrained('compras')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('gasoil_recepcion', function (Blueprint $table) {
            $table->dropForeign(['compra_id']);
            $table->dropColumn('compra_id');
        });

        Schema::table('insumos', function (Blueprint $table) {
            $table->dropForeign(['compra_id']);
            $table->dropColumn('compra_id');
        });

        Schema::table('compras', function (Blueprint $table) {
            $table->dropColumn('tipo');
        });
    }
};
