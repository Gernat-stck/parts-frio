<?php

use App\Services\RoleRedirectService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Usar configuración dinámica para middleware de roles
Route::middleware(['auth', 'verified', 'roles:' . implode(',', config('roles.available_roles'))])->group(
    function () {
        Route::get('/dashboard', function () {
            $user = Auth::user();
            $redirectService = app(RoleRedirectService::class);
            $redirectRoute = $redirectService->getRedirectRouteForUser($user);
            return redirect()->route($redirectRoute);
        })->name('dashboard');
    }
);

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/admin.php';
require __DIR__ . '/employee.php';