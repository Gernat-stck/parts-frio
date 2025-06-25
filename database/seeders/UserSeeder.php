<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory()->withRole('admin')->create([
            'user_id' => 'ADUS001',
            'name' => 'Admin User',
            'email' => 'admin@example.com',
        ]);

        User::factory()->withRole('employee')->create([
            'user_id' => 'EMP001',
            'name' => 'Employee User',
            'email' => 'employee@example.com',
        ]);
    }
}
