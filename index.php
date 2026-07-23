<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

if (function_exists('opcache_invalidate')) {
    opcache_invalidate(realpath(__DIR__.'/app/Http/Controllers/CultivoInsumoController.php'));
}

if (file_exists($maintenance = __DIR__.'/storage/framework/maintenance.php')) {
    require $maintenance;
}

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';

$app->handleRequest(Request::capture());
