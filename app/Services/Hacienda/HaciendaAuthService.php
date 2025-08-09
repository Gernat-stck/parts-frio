<?php

namespace App\Services\Hacienda;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Log;

class HaciendaAuthService
{
    protected string $cacheKey = 'hacienda_token';

    public function getToken(): string
    {
        // Verificar si ya existe en caché
        if (Cache::has($this->cacheKey)) {
            return (string) Cache::get($this->cacheKey);
        }
        // Autenticación con Hacienda
        $response = Http::asForm()->post(hacienda_url('/seguridad/auth'), [
            'user' => config('services.hacienda.user'),
            'pwd' => config('services.hacienda.pwd'),
        ]);

        if (!$response || !$response->ok()) {
            Log::error('Error al autenticar con Hacienda', [
                'status' => optional($response)->status(),
                'body' => optional($response)->body(),
            ]);
            throw new \Exception('Error al enviar DTE a Hacienda');
        }


        $data = $response->json();

        if (!isset($data['status']) || $data['status'] !== 'OK' || !isset($data['body']['token'])) {
            throw new \Exception('Respuesta inválida de Hacienda: ' . json_encode($data));
        }

        $token = $data['body']['token'];
        $expiresIn = 3600;
        $token = str_replace('Bearer ', '', $token);
        Cache::put($this->cacheKey, (string) $token, now()->addSeconds($expiresIn - 60));

        return (string) $token;
    }
}
