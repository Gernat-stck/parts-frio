<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Emitter extends Model
{
    use HasFactory;

    /**
     * Los atributos que son asignables masivamente.
     *
     * @var array<string>
     */
    protected $fillable = [
        'nit',
        'nrc',
        'nombre',
        'codActividad',
        'descActividad',
        'nombreComercial',
        'tipoEstablecimiento',
        'departamento',
        'municipio',
        'complemento',
        'telefono',
        'correo',
        'codEstableMH',
        'codEstable',
        'codPuntoVentaMH',
        'codPuntoVenta',
        'activo'
    ];

    /**
     * Los atributos que deben ser convertidos a tipos nativos.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'activo' => 'boolean',
    ];
}
