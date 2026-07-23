@extends('layouts.app')

@section('content')
<div class="container">
    <h1>Lista de Socios</h1>
    <a href="{{ route('socios.create') }}" class="btn btn-primary mb-3">
        ➕ Nuevo Socio
    </a>
    
    <table class="table table-bordered">
        <thead>
            <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Cédula</th>
                <th>Aporte Inicial</th>
                <th>Estado</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            @foreach($socios as $socio)
            <tr>
                <td>{{ $socio->id }}</td>
                <td>{{ $socio->nombre }} {{ $socio->apellido }}</td>
                <td>{{ $socio->cedula }}</td>
                <td>Gs. {{ number_format($socio->aporte_inicial, 0, ',', '.') }}</td>
                <td>
                    <span class="badge bg-{{ $socio->estado == 'activo' ? 'success' : 'danger' }}">
                        {{ $socio->estado }}
                    </span>
                </td>
                <td>
                    <a href="{{ route('socios.edit', $socio) }}" class="btn btn-sm btn-warning">✏️</a>
                    <form action="{{ route('socios.destroy', $socio) }}" method="POST" class="d-inline">
                        @csrf @method('DELETE')
                        <button class="btn btn-sm btn-danger" onclick="return confirm('¿Eliminar?')">🗑️</button>
                    </form>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
</div>
@endsection