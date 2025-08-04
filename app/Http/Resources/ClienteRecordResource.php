<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Request;

class ClienteRecordResource extends JsonResource
{
    public function toArray(Request $request)
    {
        return [
            'id' => $this['id'],
            'name' => $this['name'],
            'email' => $this['email'],
            'phone' => $this['phone'],
            'address' => $this['address'],
            'document' => $this['document'],
            'fechaRegistro' => $this['fechaRegistro'],
            'totalCompras' => $this['totalCompras'],
            'montoTotal' => $this['montoTotal'],
            'historialCompras' => $this['historialCompras']
        ];
    }
}
