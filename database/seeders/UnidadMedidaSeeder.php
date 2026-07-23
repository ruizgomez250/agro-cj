<?php

namespace Database\Seeders;

use App\Models\UnidadMedida;
use Illuminate\Database\Seeder;

class UnidadMedidaSeeder extends Seeder
{
    public function run(): void
    {
        $unidades = [
            ['nombre' => 'Kilogramo', 'abreviatura' => 'kg'],
            ['nombre' => 'Gramo', 'abreviatura' => 'g'],
            ['nombre' => 'Litro', 'abreviatura' => 'L'],
            ['nombre' => 'Mililitro', 'abreviatura' => 'mL'],
            ['nombre' => 'Tonelada', 'abreviatura' => 't'],
            ['nombre' => 'Unidad', 'abreviatura' => 'un'],
            ['nombre' => 'Bolsa', 'abreviatura' => 'bolsa'],
            ['nombre' => 'Saco', 'abreviatura' => 'saco'],
            ['nombre' => 'Caja', 'abreviatura' => 'caja'],
            ['nombre' => 'Hectolitro', 'abreviatura' => 'hl'],
        ];

        foreach ($unidades as $u) {
            UnidadMedida::updateOrCreate(
                ['nombre' => $u['nombre']],
                ['abreviatura' => $u['abreviatura']]
            );
        }
    }
}
