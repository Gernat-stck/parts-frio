<?php

namespace App\Http\Resources;

use App\Services\ImageStorageService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Storage;

class ProductResource extends JsonResource
{

    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product_name' => $this->product_name,
            'product_code' => $this->product_code,
            'category' => $this->category,
            'tipo_item' => $this->tipo_item->value,
            'description' => $this->description,
            'stock' => (int) $this->stock,
            'price' => number_format((float) $this->price, 2, '.', ''),
            'ivaItem' => number_format((float) $this->ivaItem, 2, '.', ''),
            'psv' => number_format((float) $this->psv, 2, '.', ''),
            'noGravado' => number_format((float) $this->noGravado, 2, '.', ''),
            'ventaNoSuj' => number_format((float) $this->ventaNoSuj, 2, '.', ''),
            'ventaExenta' => number_format((float) $this->ventaExenta, 2, '.', ''),
            'ventaGravada' => number_format((float) $this->ventaGravada, 2, '.', ''),
            'montoDescu' => number_format((float) $this->montoDescu, 2, '.', ''),
            'cantidad' => number_format((float) $this->cantidad, 2, '.', ''),
            'precioUni' => number_format((float) $this->precioUni, 2, '.', ''),
            'img_product' => Storage::disk('public')->url($this->img_product),
            'min_stock' => (int) $this->min_stock,
            'max_stock' => (int) $this->max_stock,
            'uniMedida' => (int) $this->uniMedida,
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
        ];
    }
}
