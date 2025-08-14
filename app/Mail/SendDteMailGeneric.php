<?php

namespace App\Mail;

use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SendDteMailGeneric extends Mailable
{
    use Queueable, SerializesModels;

    protected $pdfPath;
    protected $jsonPath;

    public function __construct(string $pdfPath, string $jsonPath)
    {
        $this->pdfPath = $pdfPath;
        $this->jsonPath = $jsonPath;
    }

    public function build()
    {
        // Leemos y parseamos el JSON
        $json = json_decode(file_get_contents($this->jsonPath), true);

        return $this->subject('Documento Tributario Electrónico')
            ->view('emails.dte_generic')
            ->with([
                'receptor_nombre' => $json['receptor']['nombre'] ?? '',
                'numero_control'  => $json['identificacion']['numeroControl'] ?? '',
                'fecha_emision'   => $json['identificacion']['fecEmi'] ?? '',
                'monto_total'     => $json['resumen']['totalPagar'] ?? 0,
            ])
            ->attach($this->pdfPath, [
                'as' => 'FAC-' . $json['identificacion']['numeroControl'] . '.pdf',
                'mime' => 'application/pdf',
            ])
            ->attach($this->jsonPath, [
                'as' => $json['identificacion']['numeroControl'] . '.json',
                'mime' => 'application/json',
            ]);
    }
}
