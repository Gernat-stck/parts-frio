<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;

class SalesHistoryResource extends JsonResource
{
    /**
     * Transforma el recurso en un array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
        return [
            'tipoDTE'          => $this->tipoDTE,
            'numeroControl'    => $this->numeroControl,
            'codigoGeneracion' => $this->codigoGeneracion,
            'fechaGeneracion' => Carbon::createFromFormat('Y-m-dH:i:s', $this->fechaEmi . $this->horaEmi)
                ->format('Y-m-d H:i'),
            'documentoReceptor'      => $this->nitReceiver ?? $this->nrc,
            'receptor' => $this->json_enviado['receptor']['nombre'] ?? null,
            'monto' => $this->json_enviado['resumen']['totalGravada'],
            'estado'           => $this->estado,
            'selloRecibido' => $this->sello_recibido ?? null,

            'detallesFactura' => [
                'subtotal' => $this->json_enviado['resumen']['totalGravada'] ?? 0,
                'iva'      => $this->json_enviado['resumen']['totalIva'] ?? 0,
                'total'    => $this->json_enviado['resumen']['totalPagar'] ?? 0,
                'productos' => collect($this->json_enviado['cuerpoDocumento'])->map(function ($item) {
                    return [
                        'nombre'   => $item['descripcion'] ?? null,
                        'cantidad' => (float) $item['cantidad'] ?? 0,
                        'precio'   => (float) $item['precioUni'] ?? 0,
                    ];
                })->all(),
            ],
        ];
    }
}
