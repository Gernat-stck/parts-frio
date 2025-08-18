<?php

namespace App\Models;

use App\Enums\TipoItem;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    use HasFactory;

    /**
     * El nombre de la tabla asociada al modelo.
     *
     * @var string
     */
    protected $table = 'inventory';

    /**
     * Los atributos que son asignables masivamente.
     *
     * @var array<string>
     */
    protected $fillable = [
        'product_name',
        'product_code',
        'category',
        'tipo_item',
        'description',
        'stock',
        'img_product',
        'min_stock',
        'max_stock',
        'price',
        'ivaItem',
        'psv',
        'uniMedida',
        'precioUni',
        'tributos',
        'montoDescu',
    ];

    /**
     * Los atributos que deben ser convertidos a tipos nativos.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'price' => 'decimal:2',
        'ivaItem' => 'decimal:2',
        'psv' => 'decimal:2',
        'precioUni' => 'decimal:2',
        'montoDescu' => 'decimal:2',
        'stock' => 'integer',
        'min_stock' => 'integer',
        'max_stock' => 'integer',
        'uniMedida' => 'integer',
        'tipo_item' => TipoItem::class,
        'tributos' => 'array',
        'img_product' => 'string'
    ];
}
