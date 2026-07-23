<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>{{ config('app.name', 'Agro-CJ') }}</title>
        <link rel="icon" type="image/png" href="/img/agrocj.png">
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @vite(['resources/css/app.css'])
    </head>
    <body class="font-sans antialiased">
        <div class="min-h-screen bg-gray-100">
            <!-- NAVEGACIÓN PRINCIPAL -->
            <nav class="bg-gradient-to-r from-green-800 to-green-600 border-b border-green-700">
                <div class="max-w-full mx-auto px-3 sm:px-4 lg:px-6">
                    <div class="flex items-center justify-between h-14">
                        <!-- Logo y nombre -->
                        <div class="shrink-0 flex items-center">
                            <a href="{{ url('/') }}" class="flex items-center space-x-2">
                                <img src="/img/agrocj.png" alt="Agro-CJ" class="h-8 w-8 object-contain" />
                                <span class="text-white font-bold text-base hidden sm:inline">{{ config('app.name', 'Agro-CJ') }}</span>
                            </a>
                        </div>

                        <!-- Menú Desktop -->
                        <div class="hidden md:flex items-center gap-1 overflow-x-auto nav-scrollbar">
                            <!-- Dashboard -->
                            <a href="{{ route('dashboard') }}" class="text-white hover:bg-green-700 px-2 py-1.5 rounded text-xs font-medium transition whitespace-nowrap">
                                Dashboard
                            </a>

                            <!-- Dropdown Socios -->
                            <div class="relative group">
                                <button class="text-white hover:bg-green-700 px-2 py-1.5 rounded text-xs font-medium inline-flex items-center transition whitespace-nowrap">
                                    Socios
                                    <svg class="w-3 h-3 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </button>
                                <div class="absolute left-0 mt-2 w-44 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                    <div class="py-1">
                                        <a href="{{ route('socios.index') }}" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Listar Socios</a>
                                        <a href="{{ route('socios.create') }}" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Nuevo Socio</a>
                                        <a href="{{ route('socios.aportes') }}" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Aportes</a>
                                    </div>
                                </div>
                            </div>

                            <!-- Dropdown Caja -->
                            <div class="relative group">
                                <button class="text-white hover:bg-green-700 px-2 py-1.5 rounded text-xs font-medium inline-flex items-center transition whitespace-nowrap">
                                    Caja
                                    <svg class="w-3 h-3 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </button>
                                <div class="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                    <div class="py-1">
                                        <a href="{{ route('gastos.index') }}" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Registro de Gastos</a>
                                        <a href="{{ route('gastos.create') }}" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Nuevo Gasto</a>
                                        <a href="{{ route('caja.resumen') }}" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Resumen de Caja</a>
                                    </div>
                                </div>
                            </div>

                            <!-- Dropdown Gasoil -->
                            <div class="relative group">
                                <button class="text-white hover:bg-green-700 px-2 py-1.5 rounded text-xs font-medium inline-flex items-center transition whitespace-nowrap">
                                    Gasoil
                                    <svg class="w-3 h-3 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </button>
                                <div class="absolute left-0 mt-2 w-44 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                    <div class="py-1">
                                        <a href="{{ route('gasoil.recepcion') }}" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Recepción</a>
                                        <a href="{{ route('gasoil.despacho') }}" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Despacho</a>
                                        <a href="{{ route('gasoil.stock') }}" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Stock Actual</a>
                                    </div>
                                </div>
                            </div>

                            <!-- Contratistas -->
                            <a href="{{ route('contratistas.index') }}" class="text-white hover:bg-green-700 px-2 py-1.5 rounded text-xs font-medium transition whitespace-nowrap">
                                Contratistas
                            </a>

                            <!-- Dropdown Cultivos -->
                            <div class="relative group">
                                <button class="text-white hover:bg-green-700 px-2 py-1.5 rounded text-xs font-medium inline-flex items-center transition whitespace-nowrap">
                                    Cultivos
                                    <svg class="w-3 h-3 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </button>
                                <div class="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                    <div class="py-1">
                                        <a href="{{ route('cultivos.index') }}" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Registro de Cultivos</a>
                                        <a href="{{ route('cultivos.create') }}" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Nuevo Cultivo</a>
                                    </div>
                                </div>
                            </div>

                            <!-- Insumos -->
                            <a href="{{ route('insumos.index') }}" class="text-white hover:bg-green-700 px-2 py-1.5 rounded text-xs font-medium transition whitespace-nowrap">
                                Insumos
                            </a>

                            <!-- Botón de Usuario -->
                            @auth
                                <div class="relative group ml-1 border-l border-green-500 pl-2">
                                    <button class="text-white hover:bg-green-700 px-2 py-1.5 rounded text-xs font-medium inline-flex items-center transition whitespace-nowrap">
                                        {{ Auth::user()->name }}
                                        <svg class="w-3 h-3 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </button>
                                    <div class="absolute right-0 mt-2 w-44 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                        <div class="py-1">
                                            <a href="{{ route('profile.edit') }}" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Perfil</a>
                                            <form method="POST" action="{{ route('logout') }}">
                                                @csrf
                                                <button type="submit" class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                                                    Cerrar Sesión
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            @endauth
                        </div>

                        <!-- Menú Mobile (Hamburguesa) -->
                        <div class="md:hidden flex items-center">
                            <button id="mobile-menu-button" class="text-white hover:text-gray-200 focus:outline-none">
                                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Menú Mobile (desplegable) -->
                <div id="mobile-menu" class="md:hidden hidden bg-green-700">
                    <div class="px-2 pt-2 pb-3 space-y-1">
                        <a href="{{ route('dashboard') }}" class="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-green-600">Dashboard</a>

                        <details class="group">
                            <summary class="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-green-600 cursor-pointer">Socios</summary>
                            <div class="pl-4 space-y-1">
                                <a href="{{ route('socios.index') }}" class="text-white block px-3 py-2 rounded-md text-sm hover:bg-green-600">Listar Socios</a>
                                <a href="{{ route('socios.create') }}" class="text-white block px-3 py-2 rounded-md text-sm hover:bg-green-600">Nuevo Socio</a>
                                <a href="{{ route('socios.aportes') }}" class="text-white block px-3 py-2 rounded-md text-sm hover:bg-green-600">Aportes</a>
                            </div>
                        </details>

                        <details class="group">
                            <summary class="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-green-600 cursor-pointer">Caja</summary>
                            <div class="pl-4 space-y-1">
                                <a href="{{ route('gastos.index') }}" class="text-white block px-3 py-2 rounded-md text-sm hover:bg-green-600">Registro de Gastos</a>
                                <a href="{{ route('gastos.create') }}" class="text-white block px-3 py-2 rounded-md text-sm hover:bg-green-600">Nuevo Gasto</a>
                                <a href="{{ route('caja.resumen') }}" class="text-white block px-3 py-2 rounded-md text-sm hover:bg-green-600">Resumen de Caja</a>
                            </div>
                        </details>

                        <details class="group">
                            <summary class="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-green-600 cursor-pointer">Gasoil</summary>
                            <div class="pl-4 space-y-1">
                                <a href="{{ route('gasoil.recepcion') }}" class="text-white block px-3 py-2 rounded-md text-sm hover:bg-green-600">Recepción</a>
                                <a href="{{ route('gasoil.despacho') }}" class="text-white block px-3 py-2 rounded-md text-sm hover:bg-green-600">Despacho</a>
                                <a href="{{ route('gasoil.stock') }}" class="text-white block px-3 py-2 rounded-md text-sm hover:bg-green-600">Stock Actual</a>
                            </div>
                        </details>

                        <a href="{{ route('contratistas.index') }}" class="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-green-600">Contratistas</a>

                        <details class="group">
                            <summary class="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-green-600 cursor-pointer">Cultivos</summary>
                            <div class="pl-4 space-y-1">
                                <a href="{{ route('cultivos.index') }}" class="text-white block px-3 py-2 rounded-md text-sm hover:bg-green-600">Registro de Cultivos</a>
                                <a href="{{ route('cultivos.create') }}" class="text-white block px-3 py-2 rounded-md text-sm hover:bg-green-600">Nuevo Cultivo</a>
                            </div>
                        </details>

                        <a href="{{ route('insumos.index') }}" class="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-green-600">Insumos</a>

                        @auth
                            <div class="border-t border-green-600 mt-2 pt-2">
                                <a href="{{ route('profile.edit') }}" class="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-green-600">Perfil</a>
                                <form method="POST" action="{{ route('logout') }}">
                                    @csrf
                                    <button type="submit" class="text-white w-full text-left block px-3 py-2 rounded-md text-base font-medium hover:bg-green-600">Cerrar Sesión</button>
                                </form>
                            </div>
                        @endauth
                    </div>
                </div>
            </nav>

            <!-- Page Heading -->
            @isset($header)
                <header class="bg-white shadow">
                    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        {{ $header }}
                    </div>
                </header>
            @endisset

            <!-- Page Content -->
            <main>
                {{ $slot }}
            </main>
        </div>

        <!-- JavaScript para el menú mobile -->
        <script>
            document.getElementById('mobile-menu-button')?.addEventListener('click', function() {
                const menu = document.getElementById('mobile-menu');
                menu.classList.toggle('hidden');
            });
        </script>
    </body>
</html>
