<?php

namespace App\Http\Controllers;

use App\Models\SalesHistory;
use App\Services\DteMailService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;


class MailController
{

    public function send(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'codigo_generacion' => 'required|string',
            'pdf' => 'required|file|mimes:pdf|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $sale = SalesHistory::where('codigoGeneracion', $request->codigo_generacion)->first();

        if (!$sale) {
            return response()->json(['error' => 'Venta no encontrada'], 404);
        }

        // Decodificar JSON del DTE
        $payload = is_string($sale->json_enviado)
            ? json_decode($sale->json_enviado, true)
            : (array) $sale->json_enviado;

        if (json_last_error() !== JSON_ERROR_NONE) {
            return response()->json(['error' => 'JSON del DTE inválido'], 422);
        }

        // Extraer correo del receptor
        $recipient = data_get($payload, 'receptor.correo');
        if (!$recipient || !filter_var($recipient, FILTER_VALIDATE_EMAIL)) {
            \Log::info('Error al Extraer correo del Receptor');
            return response()->json(['error' => 'Correo de receptor inválido o ausente'], 422);
        }

        // Crear archivo JSON temporal
        $jsonPath = tempnam(sys_get_temp_dir(), 'dte');
        file_put_contents($jsonPath, json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));

        // Path del PDF subido
        $pdfPath = $request->file('pdf')->getPathname();
        // Llamar a tu service
        $sent = app(DteMailService::class)->sendWithAttachments($pdfPath, $jsonPath, $recipient);

        @unlink($jsonPath);

        if (!$sent) {
            return response()->json(['error' => 'Error al enviar el correo'], 500);
        }

        return response()->json(['message' => 'DTE enviado con éxito al correo del receptor']);
    }
}
