<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::get('admin/inventory', function () {
        return Inertia::render('admin/inventory/inventory');
    })->name('admin.inventory');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
