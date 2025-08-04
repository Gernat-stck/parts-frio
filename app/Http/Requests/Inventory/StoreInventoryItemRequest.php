<?php

namespace App\Http\Requests\Inventory;

use Illuminate\Foundation\Http\FormRequest;

class StoreInventoryItemRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'product_name' => 'required|string|max:255|unique:inventory',
            'product_code' => 'required|string|max:255|unique:inventory',
            'category' => 'required|string|max:255',
            'tipo_item' => 'required|integer|min:0|max:255',
            'description' => 'required|string|max:1000',
            'stock' => 'required|integer|min:0',
            'price' => 'sometimes|numeric|min:0',
            'ivaItem' => 'sometimes|numeric|min:0|max:100',
            'img_product' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048',
            'min_stock' => 'sometimes|integer|min:0',
            'max_stock' => 'sometimes|integer|min:0',
            'psv' => 'sometimes|numeric|min:0',
            'noGravado' => 'sometimes|numeric|min:0',
            'numeroDocumento' => 'sometimes|string|max:255',
            'codTributo' => 'sometimes|string|max:50',
            'ventaNoSuj' => 'sometimes|numeric|min:0',
            'ventaExenta' => 'sometimes|numeric|min:0',
            'ventaGravada' => 'sometimes|numeric|min:0',
            'tributos' => 'sometimes|array',
            'cantidad' => 'sometimes|numeric|min:1.0',
            'uniMedida' => 'sometimes|integer|min:1',
            'precioUni' => 'sometimes|numeric|min:0',
            'montoDescu' => 'sometimes|numeric|min:0',
        ];
    }
}
