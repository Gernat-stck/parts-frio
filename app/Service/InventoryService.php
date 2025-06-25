<?php

namespace App\Service;

use App\Models\Inventory;

class InventoryService
{
    public function getAllProducts()
    {
        return Inventory::all();
    }
}
