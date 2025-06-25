<?php

return [
    // Mapeo de roles a rutas de dashboard
    'dashboards' => [
        'admin' => 'admin.dashboard',
        'employee' => 'employee.dashboard',
        'customer' => 'customer.dashboard',
        'supplier' => 'supplier.dashboard',
        'manager' => 'manager.dashboard',
        'accountant' => 'accountant.dashboard',
        'salesperson' => 'salesperson.dashboard',
    ],
    
    // Ruta por defecto si no se encuentra un rol
    'default_route' => 'home',
    
    // Lista de todos los roles disponibles en la aplicación
    'available_roles' => [
        'admin',
        'employee',
        'customer',
        'supplier',
        'manager',
        'accountant',
        'salesperson'
    ],
];
