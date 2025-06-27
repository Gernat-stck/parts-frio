<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Service\InventoryService;
use Inertia\Inertia;

class AdminController extends Controller
{
    protected $inventoryService;

    /**
     * Contructor for AdminController
     *  @param InventoryService $inventoryService
     * 
     */
    public function __construct(InventoryService $inventoryService)
    {
        $this->inventoryService = $inventoryService;
    }

    public function index()
    {
        return Inertia::render('admin/dashboard');
    }

    /**
     *  Display the inventory management page
     *  @return \Inertia\Response
     */
    public function manageInventory()
    {
        return Inertia::render('admin/inventory/inventory', [
            'products' => $this->inventoryService->getAllProducts(),
        ]);
    }

    /**
     *  Display the user management page
     *  @return \Inertia\Response
     */
    public function manageUsers()
    {
        // Logic to manage users
        return Inertia::render('admin/users/user-management');
    }

}
