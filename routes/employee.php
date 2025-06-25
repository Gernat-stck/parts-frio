<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;

Route::middleware(['auth', 'verified', 'roles:employee'])->group(function () {
    Route::get('/employee', [AdminController::class, 'index'])->name('employee.dashboard');
    Route::get('/employee/dashboard', [AdminController::class, 'index'])->name('employee.dashboard');

    # Display the inventory management page
    Route::get('/employee/inventory', [AdminController::class, 'manageInventory'])->name('employee.inventory');
});
