<x-guest-layout>
    <!-- Session Status -->
    <x-auth-session-status class="mb-4" :status="session('status')" />

    <div class="mb-6 text-center">
        <h2 class="text-xl font-bold text-gray-800">Iniciar Sesion</h2>
        <p class="text-sm text-gray-500 mt-1">Ingrese sus credenciales para acceder</p>
    </div>

    <form method="POST" action="{{ route('login') }}" class="space-y-5">
        @csrf

        <!-- Email Address -->
        <div>
            <x-input-label for="email" :value="__('Correo Electronico')" class="text-gray-700 font-medium" />
            <x-text-input id="email" class="block mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500" type="email" name="email" :value="old('email')" required autofocus autocomplete="username" placeholder="correo@ejemplo.com" />
            <x-input-error :messages="$errors->get('email')" class="mt-2" />
        </div>

        <!-- Password -->
        <div>
            <x-input-label for="password" :value="__('Contrasena')" class="text-gray-700 font-medium" />
            <x-text-input id="password" class="block mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                            type="password"
                            name="password"
                            placeholder="Ingrese su contrasena"
                            required autocomplete="current-password" />
            <x-input-error :messages="$errors->get('password')" class="mt-2" />
        </div>

        <!-- Remember Me -->
        <div class="block">
            <label for="remember_me" class="inline-flex items-center">
                <input id="remember_me" type="checkbox" class="rounded border-gray-300 text-emerald-600 shadow-sm focus:ring-emerald-500" name="remember">
                <span class="ms-2 text-sm text-gray-600">Recordarme</span>
            </label>
        </div>

        <div class="flex items-center justify-between pt-2">
            @if (Route::has('password.request'))
                <a class="text-sm text-emerald-600 hover:text-emerald-800 font-medium transition-colors" href="{{ route('password.request') }}">
                    Olvido su contrasena?
                </a>
            @endif

            <x-primary-button class="ms-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 rounded-lg shadow-sm transition-all duration-200">
                {{ __('Iniciar Sesion') }}
            </x-primary-button>
        </div>
    </form>
</x-guest-layout>
