<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Receiver extends Model
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
        'departamento',
        'municipio',
        'complemento',
        'telefono',
        'correo'
    ];

    /**
     * Obtiene el historial de ventas asociado con este receptor.
     */
    public function salesHistory(): HasMany
    {
        return $this->hasMany(SalesHistory::class, 'nitReceiver', 'nit');
    }
}
