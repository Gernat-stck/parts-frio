<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            ['name' => 'Administrador', 'slug' => 'admin'],
            ['name' => 'Empleado', 'slug' => 'employee'],
            ['name' => 'Cliente', 'slug' => 'customer'],
            ['name' => 'Proveedor', 'slug' => 'supplier'],
            ['name' => 'Gerente', 'slug' => 'manager'],
            ['name' => 'Contador', 'slug' => 'accountant'],
            ['name' => 'Vendedor', 'slug' => 'salesperson'],
        ];
        foreach ($roles as $role) {
            Role::create($role);
        }
    }
}
