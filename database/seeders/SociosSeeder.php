<?php

namespace Database\Seeders;

use App\Models\Socio;
use Illuminate\Database\Seeder;

class SociosSeeder extends Seeder
{
    public function run(): void
    {
        $socios = [
            ['nombre' => 'Juan', 'apellido' => 'Gonzalez', 'cedula' => '4567890', 'telefono' => '0981 123456', 'email' => 'juan@email.com', 'aporte_inicial' => 500000, 'aporte_mensual' => 150000, 'fecha_ingreso' => '2024-01-15', 'estado' => 'activo', 'observaciones' => 'Socio fundador'],
            ['nombre' => 'Maria', 'apellido' => 'Lopez', 'cedula' => '4567891', 'telefono' => '0982 234567', 'email' => 'maria@email.com', 'aporte_inicial' => 300000, 'aporte_mensual' => 100000, 'fecha_ingreso' => '2024-02-20', 'estado' => 'activo'],
            ['nombre' => 'Pedro', 'apellido' => 'Ramirez', 'cedula' => '4567892', 'telefono' => '0983 345678', 'email' => 'pedro@email.com', 'aporte_inicial' => 400000, 'aporte_mensual' => 120000, 'fecha_ingreso' => '2024-03-10', 'estado' => 'activo'],
            ['nombre' => 'Ana', 'apellido' => 'Fernandez', 'cedula' => '4567893', 'telefono' => '0984 456789', 'email' => 'ana@email.com', 'aporte_inicial' => 250000, 'aporte_mensual' => 80000, 'fecha_ingreso' => '2024-05-01', 'estado' => 'activo'],
            ['nombre' => 'Carlos', 'apellido' => 'Martinez', 'cedula' => '4567894', 'telefono' => '0985 567890', 'email' => 'carlos@email.com', 'aporte_inicial' => 350000, 'aporte_mensual' => 110000, 'fecha_ingreso' => '2024-06-15', 'estado' => 'inactivo', 'observaciones' => 'Inactivo por mudanza'],
            ['nombre' => 'Lucia', 'apellido' => 'Torres', 'cedula' => '4567895', 'telefono' => '0986 678901', 'email' => 'lucia@email.com', 'aporte_inicial' => 200000, 'aporte_mensual' => 70000, 'fecha_ingreso' => '2025-01-10', 'estado' => 'activo'],
            ['nombre' => 'Roberto', 'apellido' => 'Diaz', 'cedula' => '4567896', 'telefono' => '0987 789012', 'email' => 'roberto@email.com', 'aporte_inicial' => 450000, 'aporte_mensual' => 130000, 'fecha_ingreso' => '2024-08-20', 'estado' => 'suspendido', 'observaciones' => 'Suspendido temporalmente'],
            ['nombre' => 'Sandra', 'apellido' => 'Acuna', 'cedula' => '4567897', 'telefono' => '0988 890123', 'email' => 'sandra@email.com', 'aporte_inicial' => 300000, 'aporte_mensual' => 90000, 'fecha_ingreso' => '2025-03-05', 'estado' => 'activo'],
        ];

        foreach ($socios as $socio) {
            Socio::create($socio);
        }
    }
}
