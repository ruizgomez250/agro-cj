<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProveedorController;
use App\Http\Controllers\CompraController;
use App\Http\Controllers\SocioController;
use App\Http\Controllers\CultivoController;
use App\Http\Controllers\InsumoController;
use App\Http\Controllers\GastoController;
use App\Http\Controllers\GasoilRecepcionController;
use App\Http\Controllers\GasoilDespachoController;
use App\Http\Controllers\UnidadMedidaController;
use App\Http\Controllers\TipoInsumoController;
use App\Http\Controllers\ExportController;
use App\Http\Controllers\ContratistaController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\EmpleadoController;
use App\Http\Controllers\EntregaController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\LoteController;
use App\Http\Controllers\CultivoInsumoController;
use App\Models\Socio;
use App\Models\Cultivo;
use App\Models\Insumo;
use App\Models\Gasto;
use App\Models\GasoilRecepcion;
use App\Models\GasoilDespacho;
use App\Models\Contratista;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('dashboard');
    }
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});

Route::get('/dashboard', function () {
    $stats = [
        'socios' => [
            'total' => Socio::count(),
            'activos' => Socio::where('estado', 'activo')->count(),
        ],
        'cultivos' => [
            'total' => Cultivo::count(),
            'activos' => Cultivo::where('estado', 'activo')->count(),
            'hectareas' => (float) Cultivo::sum('hectareas'),
        ],
        'insumos' => [
            'total' => Insumo::count(),
            'costo_total' => (float) Insumo::sum('total'),
        ],
        'gastos' => [
            'total_mes' => (float) Gasto::whereMonth('fecha', now()->month)->whereYear('fecha', now()->year)->sum('monto'),
            'total_anio' => (float) Gasto::whereYear('fecha', now()->year)->sum('monto'),
        ],
        'gasoil' => [
            'recepciones' => GasoilRecepcion::count(),
            'despachos' => GasoilDespacho::count(),
        ],
        'contratistas' => [
            'total' => Contratista::count(),
        ],
    ];

    return Inertia::render('Dashboard', ['stats' => $stats]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'admin'])->group(function () {
    Route::resource('users', UserController::class)->except(['show']);
});

Route::middleware('auth')->group(function () {
    Route::resource('socios', SocioController::class)->except(['show']);
    Route::get('socios/{socio}', [SocioController::class, 'show'])->name('socios.show');
    Route::get('socios-aportes', [SocioController::class, 'aportes'])->name('socios.aportes');
    Route::get('socios-export', [SocioController::class, 'export'])->name('socios.export');

    Route::resource('lotes', LoteController::class)->except(['show']);

    Route::resource('cultivos', CultivoController::class)->except(['show']);
    Route::get('cultivos/{cultivo}', [CultivoController::class, 'show'])->name('cultivos.show');

    Route::resource('cultivo-insumos', CultivoInsumoController::class)->except(['show', 'edit', 'update']);
    Route::post('cultivo-insumos/{cultivoInsumo}/apply', [CultivoInsumoController::class, 'apply'])->name('cultivo-insumos.apply');

    Route::resource('insumos', InsumoController::class)->except(['show']);
    Route::get('insumos/{insumo}', [InsumoController::class, 'show'])->name('insumos.show');

    Route::resource('gastos', GastoController::class)->except(['show']);
    Route::get('gastos/{gasto}', [GastoController::class, 'show'])->name('gastos.show');
    Route::get('caja/resumen', [GastoController::class, 'resumen'])->name('gastos.resumen');

    Route::prefix('gasoil')->name('gasoil.')->group(function () {
        Route::get('recepcion', [GasoilRecepcionController::class, 'index'])->name('recepcion.index');
        Route::get('recepcion/create', [GasoilRecepcionController::class, 'create'])->name('recepcion.create');
        Route::post('recepcion', [GasoilRecepcionController::class, 'store'])->name('recepcion.store');
        Route::get('recepcion/{recepcion}', [GasoilRecepcionController::class, 'show'])->name('recepcion.show');
        Route::get('recepcion/{recepcion}/edit', [GasoilRecepcionController::class, 'edit'])->name('recepcion.edit');
        Route::put('recepcion/{recepcion}', [GasoilRecepcionController::class, 'update'])->name('recepcion.update');
        Route::delete('recepcion/{recepcion}', [GasoilRecepcionController::class, 'destroy'])->name('recepcion.destroy');

        Route::get('despacho', [GasoilDespachoController::class, 'index'])->name('despacho.index');
        Route::get('despacho/create', [GasoilDespachoController::class, 'create'])->name('despacho.create');
        Route::post('despacho', [GasoilDespachoController::class, 'store'])->name('despacho.store');
        Route::get('despacho/{despacho}', [GasoilDespachoController::class, 'show'])->name('despacho.show');
        Route::get('despacho/{despacho}/edit', [GasoilDespachoController::class, 'edit'])->name('despacho.edit');
        Route::put('despacho/{despacho}', [GasoilDespachoController::class, 'update'])->name('despacho.update');
        Route::delete('despacho/{despacho}', [GasoilDespachoController::class, 'destroy'])->name('despacho.destroy');
        Route::get('despacho/{despacho}/comprobante', [GasoilDespachoController::class, 'comprobante'])->name('despacho.comprobante');

        Route::get('stock', [GasoilDespachoController::class, 'stock'])->name('stock');
    });

    Route::resource('contratistas', ContratistaController::class)->except(['show']);
    Route::get('contratistas/{contratista}', [ContratistaController::class, 'show'])->name('contratistas.show');

    Route::resource('proveedores', ProveedorController::class)->except(['show']);
    Route::resource('compras', CompraController::class)->except(['show']);

    Route::resource('productos', ProductoController::class)->except(['show']);
    Route::resource('empleados', EmpleadoController::class)->except(['show']);
    Route::resource('entregas', EntregaController::class)->except(['show']);
    Route::get('entregas/{entrega}/comprobante', [EntregaController::class, 'comprobante'])->name('entregas.comprobante');

    Route::post('unidades-medida', [UnidadMedidaController::class, 'store'])->name('unidades-medida.store');
    Route::post('tipo-insumos', [TipoInsumoController::class, 'store'])->name('tipo-insumos.store');

    Route::prefix('reportes')->name('reportes.')->group(function () {
        Route::get('/', [ReportController::class, 'index'])->name('index');
        Route::get('/aportes-socios', [ReportController::class, 'aportesSocios'])->name('aportes-socios');
        Route::get('/gastos', [ReportController::class, 'gastos'])->name('gastos');
        Route::get('/gasoil', [ReportController::class, 'gasoil'])->name('gasoil');
        Route::get('/contratistas', [ReportController::class, 'contratistas'])->name('contratistas');
        Route::get('/cultivos', [ReportController::class, 'cultivos'])->name('cultivos');
        Route::get('/insumos', [ReportController::class, 'insumos'])->name('insumos');

        Route::prefix('exportar')->name('export.')->group(function () {
            Route::get('/aportes-socios', [ExportController::class, 'aportesSocios'])->name('aportes-socios');
            Route::get('/gastos', [ExportController::class, 'gastos'])->name('gastos');
            Route::get('/gasoil', [ExportController::class, 'gasoil'])->name('gasoil');
            Route::get('/contratistas', [ExportController::class, 'contratistas'])->name('contratistas');
            Route::get('/cultivos', [ExportController::class, 'cultivos'])->name('cultivos');
            Route::get('/insumos', [ExportController::class, 'insumos'])->name('insumos');
        });
    });
});

require __DIR__ . '/auth.php';
