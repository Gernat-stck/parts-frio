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
        'price'
    ];

    /**
     * Los atributos que deben ser convertidos a tipos nativos.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'price' => 'decimal:2',
        'stock' => 'integer',
        'tipo_item' => TipoItem::class,
    ];
}
