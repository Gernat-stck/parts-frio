<?php

namespace App\Services;

use App\Mail\SendDteMailGeneric;
use Mail;

class DteMailService
{
    public function sendWithAttachments(string $pdfPath, string $jsonPath, string $recipient): bool
    {
        try {
            Mail::to($recipient)->send(new SendDteMailGeneric($pdfPath, $jsonPath));
            return true;
        } catch (\Throwable $e) {
            \Log::error("Error al enviar DTE: " . $e->getMessage());
            return false;
        }
    }
}
