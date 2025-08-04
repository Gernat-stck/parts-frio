<?php

namespace App\Http\Requests\Invoice;

use Illuminate\Foundation\Http\FormRequest;

class StoreDteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge($this->normalizeTypes($this->all()));
    }

    private function normalizeTypes(array $data): array
    {
        foreach ($data as $key => $value) {
            if (is_array($value)) {
                $data[$key] = $this->normalizeTypes($value);
            } elseif (is_string($value)) {
                $lower = strtolower($value);

                if ($lower === 'null') {
                    $data[$key] = null;
                } elseif ($lower === 'true') {
                    $data[$key] = true;
                } elseif ($lower === 'false') {
                    $data[$key] = false;
                } elseif (is_numeric($value) && strpos($value, '.') !== false) {
                    $data[$key] = (float) $value;
                }
                // Si es entero sin ceros a la izquierda, casteamos opcionalmente
                elseif (ctype_digit($value) && $value[0] !== '0') {
                    $data[$key] = (int) $value;
                }
            }
        }

        return $data;
    }
    
    public function rules(): array
    {
        return [
            // Identificación
            'identificacion.version' => 'required|integer',
            'identificacion.ambiente' => 'required|string',
            'identificacion.tipoDte' => 'required|string',
            'identificacion.numeroControl' => 'required|string',
            'identificacion.codigoGeneracion' => 'required|string',
            'identificacion.tipoModelo' => 'required|integer',
            'identificacion.tipoOperacion' => 'required|integer',
            'identificacion.fecEmi' => 'required|date',
            'identificacion.horEmi' => 'required|date_format:H:i:s',
            'identificacion.tipoMoneda' => 'required|string',

            // Emisor
            'emisor.codPuntoVentaMH' => 'required|string',
            'emisor.codPuntoVenta' => 'required|string',
            'emisor.codEstableMH' => 'required|string',
            'emisor.codEstable' => 'required|string',
            'emisor.nombreComercial' => 'required|string',
            'emisor.tipoEstablecimiento' => 'required|string',
            'emisor.nit' => 'required|string',
            'emisor.nrc' => 'required|string',
            'emisor.nombre' => 'required|string',
            'emisor.codActividad' => 'required|string',
            'emisor.descActividad' => 'required|string',
            'emisor.direccion.departamento' => 'required|string',
            'emisor.direccion.municipio' => 'required|string',
            'emisor.direccion.complemento' => 'required|string',
            'emisor.telefono' => 'required|string',
            'emisor.correo' => 'required|email',

            // Receptor
            'receptor.tipoDocumento' => 'required|string',
            'receptor.numDocumento' => 'required|string',
            'receptor.nombre' => 'required|string',
            'receptor.direccion.departamento' => 'required|string',
            'receptor.direccion.municipio' => 'required|string',
            'receptor.direccion.complemento' => 'required|string',
            'receptor.telefono' => 'required|string',
            'receptor.correo' => 'required|email',

            // Cuerpo Documento
            'cuerpoDocumento' => 'required|array|min:1',
            'cuerpoDocumento.*.numItem' => 'required|integer',
            'cuerpoDocumento.*.tipoItem' => 'required|integer',
            'cuerpoDocumento.*.codigo' => 'required|string',
            'cuerpoDocumento.*.descripcion' => 'required|string',
            'cuerpoDocumento.*.cantidad' => 'required|numeric',
            'cuerpoDocumento.*.uniMedida' => 'required|integer',
            'cuerpoDocumento.*.precioUni' => 'required|numeric',
            'cuerpoDocumento.*.montoDescu' => 'required|numeric',
            'cuerpoDocumento.*.ventaGravada' => 'required|numeric',
            'cuerpoDocumento.*.ivaItem' => 'required|numeric',

            // Resumen
            'resumen.totalGravada' => 'required|numeric',
            'resumen.subTotalVentas' => 'required|numeric',
            'resumen.totalPagar' => 'required|numeric',
            'resumen.totalLetras' => 'required|string',
            'resumen.totalIva' => 'required|numeric',
            'resumen.condicionOperacion' => 'required|integer',
            'resumen.pagos' => 'required|array',
            'resumen.pagos.*.codigo' => 'required|string',
            'resumen.pagos.*.montoPago' => 'required|numeric',
        ];
    }
}
