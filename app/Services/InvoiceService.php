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
                $schemaUrl = 'app/private/schemas/fe-nc-v3.json';
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
            $tipoDte = $payload['identificacion']['tipoDte'] ?? null;

            // Accede al monto de forma condicional
            $monto = 0.0;
            if ($tipoDte === '05') {
                // Si es una Nota de Crédito (05), usa 'montoTotalOperacion'
                $monto = $payload['resumen']['montoTotalOperacion'] ?? 0.0;
            } else {
                // Para otros tipos de DTE, usa 'totalPagar'
                $monto = $payload['resumen']['totalPagar'] ?? 0.0;
            }
            // Extraer datos del receptor
            Log::info('sello recibido' . $response['selloRecibido']);
            Log::info('monto: ' . $monto);
            $receptorData = $payload['receptor'] ?? [];
            Log::info($response);
            // Preparar datos para crear/buscar receptor
            $receiverAttributes = [
                'nit' => $receptorData['nit'] ?? $receptorData['numDocumento'] ?? 'No Proporcionado',
                'nrc' => $receptorData['nrc'] ?? $receptorData['numDocumento'] ?? 'No Proporcionado',
                'nombre' => $receptorData['nombre'],
                'codActividad' => $receptorData['codActividad'] ?? '99',
                'descActividad' => $receptorData['descActividad'] ?? '99',
                'nombreComercial' => $receptorData['nombreComercial'] ?? $receptorData['nombre'], // Usa nombreComercial si existe, sino nombre
                'departamento' => $receptorData['direccion']['departamento'] ?? null,
                'municipio' => $receptorData['direccion']['municipio'] ?? null,
                'complemento' => $receptorData['direccion']['complemento'] ?? null,
                'telefono' => $receptorData['telefono'] ?? 'No Proporcionado',
                'correo' => $receptorData['correo'] ?? 'No Proporcionado',
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
                // Verifica si el sello de recibido existe en la respuesta antes de agregarlo
                if (isset($response['selloRecibido'])) {
                    // Agrega el sello de recibido al array $payload
                    $payload['sello_recibido'] = $response['selloRecibido'];
                }
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
                    'monto'             => $monto, //🆗
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

    /**
     * Actualizar el estado de un DTE luego de un evento de invalidacion o anulacion.
     * @param string $codigoGeneracion
     * @return SalesHistory
     * @throws Throwable
     */
    public function updateStatus(string $codigoGeneracion) {
        return DB::transaction( function () use ($codigoGeneracion){
            //Buscar la data de historial de ventas
            Log::info('Cambiando estado');
            $salesHistory = SalesHistory::where('codigoGeneracion', $codigoGeneracion)->first();
            if(!$salesHistory){
             throw new \Exception("No se encontro el historial de ventas con el codigo de generacion {$codigoGeneracion}");
            }
            //Actualizar el estado a 'Anulado
            $salesHistory->estado = 'ANULADO';
            $salesHistory->save();
        });
    }
}
