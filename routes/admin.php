<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;

Route::middleware(['auth', 'verified', 'roles:admin'])->group(function () {
    Route::get('/admin', [AdminController::class, 'index'])->name('admin.dashboard');
    Route::get('/admin/dashboard', [AdminController::class, 'index'])->name('admin.dashboard');

    # Display the inventory management page
    Route::get('/admin/inventory', [AdminController::class, 'manageInventory'])->name('admin.inventory');
    Route::get('/admin/inventory/create', [AdminController::class, 'createInventory'])->name('admin.inventory.create');
    Route::get('/admin/inventory/edit/{id}', [AdminController::class, 'editInventory'])->name('admin.inventory.edit');
    Route::post('/inventory/store', [AdminController::class, 'storeInventoryItem'])->name('admin.inventory.store');
    Route::put('/inventory/update/{inventory:product_code}', [AdminController::class, 'updateInventoryItem'])->name('admin.inventory.update');
    Route::delete('/inventory/delete/{inventory:product_code}', [AdminController::class, 'deleteInventoryItem'])->name('admin.inventory.delete');

    # Display the user management page
    Route::get('/admin/users', [AdminController::class, 'manageUsers'])->name('admin.users');
    Route::post('/admin/create/employee', [AdminController::class, 'storeEmployee'])->name('admin.create.employee');
    Route::delete('/admin/delete-employee/{userId}', [AdminController::class, 'deleteEmployee'])->name('admin.delete.employee');
    Route::put('admin/update-employee/{userId}', [AdminController::class, 'updateEmployee'])->name('admin.update.employee');
    
    # Display create order page
    Route::get('/admin/sales', [AdminController::class, 'createSale'])->name('admin.sales');
    Route::get('admin/sales/receiver-form', [AdminController::class, 'receiverForm'])->name('admin.sales.receiver');
    Route::get('admin/sales/payment-form', [AdminController::class, 'paymentMethod'])->name('admin.sales.payment');
    Route::get('admin/sales/invoice', [AdminController::class, 'showInvoice'])->name('admin.sales.invoice');
    Route::post('/admin/save/{tipoDte}/sale', [AdminController::class, 'saveInvoice'])->name('admin.save.invoice');

    # Display the sales report page
    Route::get('/admin/sales/history', [AdminController::class, 'salesHistory'])->name('admin.sales.history');
    Route::get('/admin/sales/record', [AdminController::class, 'salesRecord'])->name('admin.sales.record');
});
