<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class SalesHistory extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * El nombre de la tabla asociada al modelo.
     *
     * @var string
     */
    protected $table = 'sales_history';

    /**
     * Los atributos que son asignables masivamente.
     *
     * @var array<string>
     */
    protected $fillable = [
        'tipoDTE',
        'numeroControl',
        'codigoGeneracion',
        'tipoContingencia',
        'motivoContingencia',
        'tipoModelo',
        'horaEmi',
        'fechaEmi',
        'tipoMoneda',
        'nitReceiver',
        'estado',
        'sello_recibido',
        'json_enviado',
        'json_recibido'
    ];

    /**
     * Los atributos que deben ser convertidos a tipos nativos.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'json_enviado' => 'array',
        'json_recibido' => 'array',
    ];

    /**
     * Los atributos que deben ser transformados a fechas.
     *
     * @var array<int, string>
     */
    protected $dates = [
        'deleted_at',
    ];

    /**
     * Obtiene el receptor asociado con esta venta.
     */
    public function receiver(): BelongsTo
    {
        return $this->belongsTo(Receiver::class, 'nitReceiver', 'nit');
    }
}
