<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Config;

class RoleRedirectService
{
    /**
     * Determina la ruta de redirección para un usuario basado en sus roles
     *
     * @param User $user
     * @return string Nombre de la ruta de redirección
     */
    public function getRedirectRouteForUser(User $user): string
    {
        $roleDashboards = Config::get('roles.dashboards');

        foreach ($roleDashboards as $role => $route) {
            if ($user->hasRole($role)) {
                return $route;
            }
        }

        return Config::get('roles.default_route', 'home');
    }
}
