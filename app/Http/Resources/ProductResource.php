<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

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
            'price' => (float) $this->price,
            'ivaItem' => (float) $this->ivaItem,
            'psv' => (float) $this->psv,
            'noGravado' => (float) $this->noGravado,
            'ventaNoSuj' => (float) $this->ventaNoSuj,
            'ventaExenta' => (float) $this->ventaExenta,
            'ventaGravada' => (float) $this->ventaGravada,
            'montoDescu' => (float) $this->montoDescu,
            'cantidad' => (float) $this->cantidad,
            'precioUni' => (float) $this->precioUni,
            'img_product' => $this->img_product,
            'min_stock' => (int) $this->min_stock,
            'max_stock' => (int) $this->max_stock,
            'uniMedida' => (int) $this->uniMedida,
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
        ];
    }
}
