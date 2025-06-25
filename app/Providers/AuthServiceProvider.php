<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\User;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        // 'App\Models\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        // Define gates para administración de usuarios
        Gate::define('manage-users', function (User $user) {
            return $user->hasAnyRole(['admin', 'super-admin']);
        });

        // Solo superadmin puede gestionar administradores
        Gate::define('manage-admins', function (User $user) {
            return $user->hasRole('super-admin');
        });
    }
}
