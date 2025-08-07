<?php

namespace App\Services;

use App\Models\Receiver;
use App\Models\SalesHistory;
use Illuminate\Support\Facades\DB; // Importar DB
use Illuminate\Support\Facades\Log; // Importar Log
use Opis\JsonSchema\Errors\ErrorFormatter;
use Opis\JsonSchema\Validator;
use Opis\JsonSchema\ValidationResult;
use Str;
use Throwable;

class InvoiceService
{
    protected string $endpoint;
    protected string $token;

    public function __construct()
    {
        $this->endpoint = config('services.hacienda.endpoint'); // Define en services.php
        $this->token = config('services.hacienda.token');       // Token secreto o clave
    }

    /**
     * Obtener url del esquema JSON para un tipo de DTE específico.
     *
     * @param string $tipoDte El tipo de documento electrónico (e.g., 'fc', 'ccf', 'anulacion').
     * @return string La ruta al archivo de esquema JSON.
     */
    public function getSchemaUrl(string $tipoDte): string
    {
        switch ($tipoDte) {
            case '01':
            default:
                $schemaUrl =  'app/private/schemas/fe-fc-v1.json';
                break;

            case '03':
                $schemaUrl = 'app/private/schemas/fe-ccf-v3.json';
                break;

            case '05':
                $schemaUrl = 'app/private/schemas/fe-nc-v1.json';
                break;

            case 'contingencia':
                $schemaUrl = 'app/private/schemas/contingencia-schema-v3.json';
                break;

            case 'anulacion':
                $schemaUrl = 'app/private/schemas/anulacion-schema-v2.json';
                break;
        }
        return $schemaUrl;
    }

    /**
     * Guarda el historial de ventas y los datos del receptor de una factura electrónica.
     *
     * @param array $payload Los datos del DTE a enviar.
     * @param array $response La respuesta recibida de la API de Hacienda (simulada).
     * @return SalesHistory La instancia del historial de ventas creada.
     * @throws Throwable Si ocurre un error durante la transacción de la base de datos.
     */
    public function storeDte(array $payload, array $response): SalesHistory
    {
        return DB::transaction(function () use ($payload, $response) {
            // Extraer datos del receptor
            $receptorData = $payload['receptor'] ?? [];

            // Preparar datos para crear/buscar receptor
            $receiverAttributes = [
                'nit' => $receptorData['nit'] ?? $receptorData['numDocumento'],
                'nrc' => $receptorData['nrc'] ?? $receptorData['numDocumento'], // Considerar si 'numDocumento' es un buen fallback para NRC en producción
                'nombre' => $receptorData['nombre'],
                'codActividad' => $receptorData['codActividad'] ?? '99', // Default '99' si no existe
                'descActividad' => $receptorData['descActividad'] ?? '99', // Default '99' si no existe
                'nombreComercial' => $receptorData['nombreComercial'] ?? $receptorData['nombre'], // Usa nombreComercial si existe, sino nombre
                'departamento' => $receptorData['direccion']['departamento'] ?? null,
                'municipio' => $receptorData['direccion']['municipio'] ?? null,
                'complemento' => $receptorData['direccion']['complemento'] ?? null,
                'telefono' => $receptorData['telefono'] ?? null,
                'correo' => $receptorData['correo'] ?? null,
            ];

            try {
                // Buscar o crear el receptor
                $receiver = Receiver::updateOrCreate(['nit' => $receiverAttributes['nit']], $receiverAttributes);
                Log::info("Receptor procesado para NIT: {$receiver->nit}");
            } catch (Throwable $e) {
                Log::error("Error al crear/actualizar receptor con NIT {$receiverAttributes['nit']}: " . $e->getMessage());
                throw new \Exception("Error al procesar los datos del receptor.");
            }

            try {
                // Crear el registro de historial de ventas
                $salesHistory = SalesHistory::create([
                    'tipoDTE'           => $payload['identificacion']['tipoDte'] ?? null,
                    'numeroControl'     => $payload['identificacion']['numeroControl'] ?? null,
                    'codigoGeneracion'  => $payload['identificacion']['codigoGeneracion'] ?? null,
                    'tipoContingencia'  => $payload['identificacion']['tipoContingencia'] ?? null,
                    'motivoContingencia' => $payload['identificacion']['motivoContin'] ?? null,
                    'tipoModelo'        => $payload['identificacion']['tipoModelo'] ?? null,
                    'horaEmi'           => $payload['identificacion']['horEmi'] ?? null,
                    'fechaEmi'          => $payload['identificacion']['fecEmi'] ?? null,
                    'tipoMoneda'        => $payload['identificacion']['tipoMoneda'] ?? null,
                    'nitReceiver'       => $receiver->nit,
                    'estado'            => $response['estado'] ?? 'pendiente', // Usar estado de la respuesta o 'pendiente'
                    'json_enviado'      => $payload,
                    'json_recibido'     => $response,
                ]);
                Log::info("Registro de historial de ventas creado para código de generación: {$salesHistory->codigoGeneracion}");
                return $salesHistory;
            } catch (Throwable $e) {
                Log::error("Error al crear el historial de ventas para código de generación {$payload['identificacion']['codigoGeneracion']} ?? 'N/A'}: " . $e->getMessage());
                throw new \Exception("Error al guardar el historial de ventas.");
            }
        });
    }

    /**
     * Valida un payload JSON contra un esquema JSON usando Opis.
     *
     * @param array $payload Los datos a validar.
     * @param bool $isContingencia Indica si es un DTE de contingencia.
     * @return array Un array con el estado de la validación ('aceptado' o 'error') y detalles.
     */
    public function validateWithOpis(array $payload, bool $isContingencia = false): array
    {
        try {
            // Determinar la ruta del esquema dinámicamente o por un valor fijo como se ha definido
            if ($isContingencia) {
                $tipoDte = 'contingencia';
            } else {
                $tipoDte = $payload['identificacion']['tipoDte'] ?? '01'; // Default a 'fc' si no está definido
            }
            $schemaPath = storage_path($this->getSchemaUrl($tipoDte));

            if (!file_exists($schemaPath)) {
                Log::error("Esquema JSON no encontrado en: {$schemaPath}");
                return [
                    'estado' => 'error',
                    'mensaje' => 'Error interno: Esquema de validación no encontrado.',
                    'errores' => ['schema' => "El archivo de esquema para DTE '{$tipoDte}' no existe."],
                ];
            }

            // Cargar el esquema
            $schemaData = json_decode(file_get_contents($schemaPath));
            if (json_last_error() !== JSON_ERROR_NONE) {
                Log::error("Error al decodificar el esquema JSON desde {$schemaPath}: " . json_last_error_msg());
                return [
                    'estado' => 'error',
                    'mensaje' => 'Error interno: Esquema de validación inválido.',
                    'errores' => ['schema' => "El esquema JSON es inválido."],
                ];
            }

            // Validar el payload
            $validator = new Validator();
            // Asegúrate de que el payload sea un objeto JSON si el esquema lo espera así.
            $result = $validator->validate(json_decode(json_encode($payload)), $schemaData);

            if ($result->isValid()) {
                Log::info("Validación Opis exitosa para DTE: " . ($payload['identificacion']['codigoGeneracion'] ?? 'N/A'));
                return [
                    'estado' => 'aceptado',
                    'mensaje' => 'El JSON cumple con el esquema de Hacienda.',
                    'codigoGeneracion' => $payload['identificacion']['codigoGeneracion'] ?? null,
                    'numeroControl' => $payload['identificacion']['numeroControl'] ?? null,
                ];
            }

            $formattedErrors = $this->formatErrors($result);
            Log::warning("Validación Opis fallida para DTE: " . ($payload['identificacion']['codigoGeneracion'] ?? 'N/A'), ['errores' => $formattedErrors]);
            return [
                'estado' => 'error',
                'mensaje' => 'El JSON no cumple con el esquema.',
                'errores' => $formattedErrors,
            ];
        } catch (Throwable $e) {
            Log::error("Excepción en validateWithOpis: " . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return [
                'estado' => 'error',
                'mensaje' => 'Error inesperado durante la validación del esquema.',
                'errores' => ['exception' => $e->getMessage()],
            ];
        }
    }

    /**
     * Simula el envío a Hacienda y valida contra el esquema JSON.
     * En un entorno real, aquí se realizaría una llamada HTTP externa.
     *
     * @param array $payload Los datos del DTE a enviar a Hacienda.
     * @param bool $isContingencia Indica si es un DTE de contingencia.
     * @return array Un array con la respuesta simulada de Hacienda.
     */
    public function sendToHaciendaApi(array $payload, bool $isContingencia = false): array
    {
        // En un entorno de producción, aquí integrarías con la API de Hacienda (ej. Guzzle HTTP client).
        // Por ahora, reutilizamos la lógica de validación como simulación de la respuesta de Hacienda.

        Log::info("Simulando envío a Hacienda para código de generación: " . ($payload['identificacion']['codigoGeneracion'] ?? 'N/A'));

        // Realizar la validación del esquema como parte de la simulación de Hacienda
        if ($isContingencia) {
            $validationResult = $this->validateWithOpis($payload, true);
        } else {
            $validationResult = $this->validateWithOpis($payload);
        }
        if ($validationResult['estado'] === 'aceptado') {
            // Simula una respuesta exitosa de Hacienda
            return [
                'estado' => 'recibido', // 'recibido' o 'procesado' sería un estado típico de éxito
                'codigoGeneracion' => $payload['identificacion']['codigoGeneracion'] ?? null,
                'selloRecibido' => Str::random(32), // Simula un sello de recibido
                'fhProcesamiento' => now()->format('Y-m-d H:i:s'),
                'mensaje' => 'DTE procesado exitosamente por Hacienda.',
            ];
        } else {
            // Simula un rechazo de Hacienda basado en la validación
            return [
                'estado' => 'rechazado',
                'codigoGeneracion' => $payload['identificacion']['codigoGeneracion'] ?? null,
                'codigoMensaje' => '101', // Ejemplo de código de error
                'mensaje' => 'DTE rechazado por Hacienda debido a errores de formato.',
                'observaciones' => $validationResult['errores'],
            ];
        }
    }

    /**
     * Formatea los errores de validación de Opis JsonSchema.
     *
     * @param ValidationResult $result El resultado de la validación de Opis.
     * @return array Un array asociativo de errores formateados.
     */
    protected function formatErrors(ValidationResult $result): array
    {
        $formatter = new ErrorFormatter();
        return $formatter->format($result->error());
    }
}
