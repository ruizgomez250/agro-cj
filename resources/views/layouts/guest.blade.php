<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>{{ config('app.name', 'Agro-CJ') }}</title>
        <link rel="icon" type="image/png" href="{{ asset('img/agrocj.png') }}">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @vite(['resources/css/app.css'])
    </head>
    <body class="font-sans text-gray-900 antialiased">
        <div class="login-bg min-h-screen flex flex-col justify-center items-center px-4 relative">
            <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:500px;height:500px;background:url('{{ asset('img/agrocj.png') }}') no-repeat center center;background-size:contain;opacity:0.08;pointer-events:none;"></div>
            <div class="text-center mb-6 relative z-10">
                <a href="/">
                    <div class="mx-auto h-24 w-24 rounded-full shadow-lg overflow-hidden bg-white/10 backdrop-blur-sm flex items-center justify-center p-2">
                        <x-application-logo class="h-full w-full" />
                    </div>
                </a>
                <h1 class="mt-4 text-3xl font-bold text-white drop-shadow-md tracking-tight">{{ config('app.name', 'Agro-CJ') }}</h1>
                <p class="text-sm text-white/60 mt-1">Sistema de Gestion Agricola</p>
            </div>

            <div class="relative z-10 w-full max-w-md overflow-hidden bg-white shadow-2xl rounded-2xl">
                <div class="h-1.5 bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-400"></div>
                <div class="px-6 py-8 sm:px-8">
                    {{ $slot }}
                </div>
            </div>

            <p class="mt-6 text-sm text-white/50 relative z-10">&copy; {{ date('Y') }} {{ config('app.name', 'Agro-CJ') }}. Todos los derechos reservados.</p>
        </div>
    </body>
</html>
