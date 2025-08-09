<?php

namespace App\Services\Hacienda;

use Illuminate\Support\Facades\Http;

class FirmadorService
{
    public function firmar(array $dte): array
    {
        $response = Http::post(config('services.firmador.endpoint'), [
            'nit' => config('services.firmador.nit'),
            'passwordPri' => config('services.firmador.passwordPri'),
            'dteJson' => $dte,
        ]);

        if ($response->successful()) {
            return $response->json();
        }

        throw new \Exception("Error al firmar DTE: " . $response->body());
    }
}
