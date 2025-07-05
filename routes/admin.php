<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;

Route::middleware(['auth', 'verified', 'roles:admin'])->group(function () {
    Route::get('/admin', [AdminController::class, 'index'])->name('admin.dashboard');
    Route::get('/admin/dashboard', [AdminController::class, 'index'])->name('admin.dashboard');

    # Display the inventory management page
    Route::get('/admin/inventory', [AdminController::class, 'manageInventory'])->name('admin.inventory');

    # Display the user management page
    Route::get('/admin/users', [AdminController::class, 'manageUsers'])->name('admin.users');

    # Display create order page
    Route::get('/admin/sales', [AdminController::class, 'createSale'])->name('admin.sales');
});
