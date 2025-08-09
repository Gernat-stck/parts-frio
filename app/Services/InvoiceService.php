<?php

namespace App\Services;

use App\Models\Receiver;
use App\Models\SalesHistory;
use Illuminate\Support\Facades\DB; // Importar DB
use Illuminate\Support\Facades\Log; // Importar Log
use Throwable;

class InvoiceService
{

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
            Log::info('sello recibido' . $response['selloRecibido']);
            Log::info('monto: ' . $payload['resumen']['totalPagar']);
            $receptorData = $payload['receptor'] ?? [];
            Log::info($response);
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
                    'tipoDTE'           => $payload['identificacion']['tipoDte'] ?? null, //🆗
                    'numeroControl'     => $payload['identificacion']['numeroControl'] ?? null, //🆗
                    'codigoGeneracion'  => $payload['identificacion']['codigoGeneracion'] ?? null, //🆗
                    'tipoContingencia'  => $payload['identificacion']['tipoContingencia'] ?? null, //🆗
                    'motivoContingencia' => $payload['identificacion']['motivoContin'] ?? null, //🆗
                    'tipoModelo'        => $payload['identificacion']['tipoModelo'] ?? null, //🆗
                    'horaEmi'           => $payload['identificacion']['horEmi'] ?? null, //🆗
                    'fechaEmi'          => $payload['identificacion']['fecEmi'] ?? null, //🆗
                    'nitReceiver'       => $receiver->nit, //🆗
                    'monto'             => $payload['resumen']['totalPagar'] ?? 0.0, //🆗
                    'estado'            => $response['estado'] ?? 'pendiente', // Usar estado de la respuesta o 'pendiente'//🆗
                    'sello_recibido'    => $response['selloRecibido'] ?? null, //🆗
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
}
