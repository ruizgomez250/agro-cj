<?php

namespace Database\Seeders;

use App\Models\Cultivo;
use Illuminate\Database\Seeder;

class CultivosSeeder extends Seeder
{
    public function run(): void
    {
        $cultivos = [
            ['nombre' => 'Soja', 'variedad' => 'Don Mario', 'hectareas' => 25.5, 'fecha_siembra' => '2025-10-15', 'fecha_cosecha' => null, 'lote_parcela' => 'Lote 1-A', 'rendimiento_estimado' => 3200, 'estado' => 'activo', 'observaciones' => 'Primera siembra de la temporada'],
            ['nombre' => 'Maiz', 'variedad' => 'DK 7088', 'hectareas' => 15.0, 'fecha_siembra' => '2025-11-01', 'fecha_cosecha' => null, 'lote_parcela' => 'Lote 2-B', 'rendimiento_estimado' => 8500, 'estado' => 'activo'],
            ['nombre' => 'Trigo', 'variedad' => 'Buck Dou', 'hectareas' => 10.0, 'fecha_siembra' => '2025-06-01', 'fecha_cosecha' => '2025-11-20', 'lote_parcela' => 'Lote 3-A', 'rendimiento_estimado' => 2800, 'estado' => 'cosechado', 'observaciones' => 'Cosecha exitosa'],
            ['nombre' => 'Girasol', 'variedad' => 'Syngenta', 'hectareas' => 8.0, 'fecha_siembra' => '2025-09-20', 'fecha_cosecha' => null, 'lote_parcela' => 'Lote 4-C', 'rendimiento_estimado' => 1800, 'estado' => 'activo'],
            ['nombre' => 'Mani', 'variedad' => 'Florunner', 'hectareas' => 12.0, 'fecha_siembra' => '2025-08-10', 'fecha_cosecha' => '2026-01-15', 'lote_parcela' => 'Lote 1-B', 'rendimiento_estimado' => 2200, 'estado' => 'cosechado'],
        ];

        foreach ($cultivos as $cultivo) {
            Cultivo::create($cultivo);
        }
    }
}
