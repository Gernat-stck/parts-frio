<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Log; // Importar Log
use Throwable;

class RoleRedirectService
{
    /**
     * Determina la ruta de redirección para un usuario basado en sus roles.
     * La lógica busca en una configuración de roles y sus rutas asociadas.
     *
     * @param User $user La instancia del usuario para determinar la redirección.
     * @return string Nombre de la ruta de redirección.
     */
    public function getRedirectRouteForUser(User $user): string
    {
        try {
            $roleDashboards = Config::get('roles.dashboards');

            // Asegurarse de que el usuario tiene sus roles cargados para evitar N+1 si no se cargaron previamente.
            // Aunque `hasRole` podría hacer una consulta si no está cargada, cargarla una vez es mejor.
            $user->loadMissing('roles');

            foreach ($roleDashboards as $roleSlug => $route) {
                if ($user->hasRole($roleSlug)) {
                    Log::info("Usuario {$user->user_id} redirigido a la ruta '{$route}' por el rol '{$roleSlug}'.");
                    return $route;
                }
            }
            Log::info("Usuario {$user->user_id} redirigido a la ruta por defecto 'home' (no se encontraron roles específicos).");
            return Config::get('roles.default_route', 'home');
        } catch (Throwable $e) {
            Log::error("Error al determinar la ruta de redirección para el usuario {$user->user_id}: " . $e->getMessage());
            // En caso de error, redirigir a una ruta de fallback segura.
            return Config::get('roles.default_route', 'home');
        }
    }
}
