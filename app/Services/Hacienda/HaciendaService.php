<?php

namespace App\Services\Hacienda;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class HaciendaService
{
    public function recepcionDTE(array $datos, bool $isAnulacion): JsonResponse
    {
        $ambiente        = env('HACIENDA_ENVIRONMENT', '00');
        $idEnvio         = $this->generarIdEnvio();
        $identificacion  = $datos['identificacion'] ?? [];
        $endpoint        = $isAnulacion ? '/fesv/anulardte' : '/fesv/recepciondte';

        // 1. Obtener token
        $token = app(HaciendaAuthService::class)->getToken();

        // 2. Firmar el DTE
        $dteFirmado = app(FirmadorService::class)->firmar($datos);

        // 3. Validar campos requeridos y preparar payload
        if (!$isAnulacion) {
            foreach (['version', 'tipoDte', 'codigoGeneracion'] as $campo) {
                if (empty($identificacion[$campo])) {
                    throw new \InvalidArgumentException(
                        "Falta el campo requerido en 'identificacion': {$campo}"
                    );
                }
            }

            $payload = [
                'ambiente'         => $ambiente,
                'idEnvio'          => $idEnvio,
                'version'          => $identificacion['version'],
                'tipoDte'          => $identificacion['tipoDte'],
                'documento'        => $dteFirmado['body'],
                'codigoGeneracion' => $identificacion['codigoGeneracion'],
            ];
        } else {
            foreach (['version', 'codigoGeneracion', 'fecAnula', 'horAnula'] as $campo) {
                if (empty($identificacion[$campo])) {
                    throw new \InvalidArgumentException(
                        "Falta el campo requerido en 'identificacion': {$campo}"
                    );
                }
            }

            $payload = [
                'ambiente'  => $ambiente,
                'idEnvio'   => $idEnvio,
                'version'   => $identificacion['version'],
                'documento' => $dteFirmado['body'],
            ];
        }

        // 4. Definir headers explícitos
        $headers = [
            'Authorization' => 'Bearer ' . $token,
            'Accept'        => 'application/json',
            'Content-Type'  => 'application/json',
        ];

        // Log previo a la petición
        Log::info('Solicitud a Hacienda', [
            'url'     => hacienda_url($endpoint),
            'headers' => $headers,
            'payload' => $payload,
        ]);

        // 5. Enviar solicitud
        $response = Http::withHeaders($headers)
            ->post(hacienda_url($endpoint), $payload);

        // 6. Validar respuesta
        if (!$response || !$response->ok()) {
            // Cuerpo parseado a array (si es JSON válido)
            $bodyParsed = $response->json();
            $descripcion = $bodyParsed['descripcionMsg']
                ?? $response['descripcionMsg']
                ?? 'Sin descripción';

            Log::error('Error al enviar DTE a Hacienda', [
                'status'          => optional($response)->status(),
                'requestHeaders'  => $headers,
                'requestPayload'  => $payload,
                'responseHeaders' => $response->headers(),
                'rawBody'         => optional($response)->body(),
                'jsonBody'        => $bodyParsed,
            ]);

            throw new \Exception(
                'Error al enviar DTE a Hacienda: ' . $descripcion .
                    ' body:' . json_encode($bodyParsed, JSON_UNESCAPED_UNICODE)
            );
        }

        // 7. Devolver respuesta de Hacienda tal cual
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
