<?php

namespace App\Services\Hacienda;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;
use Log;

class HaciendaService
{
    public function recepcionDTE(array $datos, bool $isAnulacion): JsonResponse
    {
        $ambiente = env('HACIENDA_ENVIRONMENT', '00');
        $idEnvio = $this->generarIdEnvio();
        $identificacion = $datos['identificacion'] ?? [];
        $endpoint = $isAnulacion ? '/fesv/anulardte' : '/fesv/recepciondte';
        // 1. Obtener token
        $token = app(HaciendaAuthService::class)->getToken();

        // 2. Firmar el DTE
        $dteFirmado = app(FirmadorService::class)->firmar($datos);

        if (!$isAnulacion) {
            // 3. Validar campos requeridos
            foreach (['version', 'tipoDte', 'codigoGeneracion'] as $campo) {
                if (empty($identificacion[$campo])) {
                    throw new \InvalidArgumentException("Falta el campo requerido en 'identificacion': {$campo}");
                }
            }

            // 4. Preparar payload
            $payload = [
                'ambiente' => $ambiente,
                'idEnvio' => $idEnvio,
                'version' => $identificacion['version'],
                'tipoDte' => $identificacion['tipoDte'],
                'documento' => $dteFirmado['body'],
                'codigoGeneracion' => $identificacion['codigoGeneracion'],
            ];
        } else {
            foreach (['version', 'codigoGeneracion', 'fecAnula', 'horAnula'] as $campo) {
                if (empty($identificacion[$campo])) {
                    throw new \InvalidArgumentException("Falta el campo requerido en 'identificacion': {$campo}");
                }
            }
            $payload = [

                'ambiente' => $ambiente,
                'idEnvio' => $idEnvio,
                'version' => $identificacion['version'],
                'documento' => $dteFirmado['body']
            ];
        }

        // 5. Enviar solicitud con token
        $response = Http::withToken($token)->post(hacienda_url($endpoint), $payload);
        if (!$response || !$response->ok()) {
            Log::error('Error al enviar DTE a Hacienda', [
                'status' => optional($response)->status(),
                'body' => optional($response)->body(),
            ]);
            $body = $response->json(); // esto sí devuelve un array asociativo
            $descripcion = $body['descripcionMsg'] ?? $response['descripcionMsg'] ?? 'Sin descripción';

            throw new \Exception('Error al enviar DTE a Hacienda: ' . $descripcion);
        }
        // Devuelve la respuesta JSON tal cual la envía Hacienda
        return response()->json($response->json(), $response->status());
    }

    /**
     * Genera un idEnvio correlativo.
     */
    protected function generarIdEnvio(): int
    {
        return intval(now()->format('YmdHis') . rand(100, 999));
    }
}
