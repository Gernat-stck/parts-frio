<?php

namespace App\Services;

use App\Models\Receiver; // Asegúrate de importar cualquier modelo que vayas a usar
use App\Models\SalesHistory; // Asegúrate de importar cualquier modelo que vayas a usar
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log; // Importar Log
use Throwable; // Importar Throwable

/**
 * Service class for client-related operations.
 */
class ClienteService
{
    // Aquí puedes añadir métodos específicos para la gestión de clientes.
    // Ejemplo:
    /**
     * Retrieves a client by NIT.
     *
     * @param string $nit The NIT of the client.
     * @return Receiver|null The Receiver model instance or null if not found.
     */
    public function getClientByNit(string $nit): ?Receiver
    {
        try {
            return Receiver::where('nit', $nit)->first();
        } catch (Throwable $e) {
            Log::error("Error al buscar cliente por NIT {$nit}: " . $e->getMessage());
            return null;
        }
    }
}
