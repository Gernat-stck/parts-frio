<?php

namespace App\Services;

use App\Http\Requests\Employee\EmployeeCreateRequest;
use App\Http\Requests\Employee\EmployeeUpdateRequest;
use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;  
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Throwable; 

class UserService
{
    /**
     * Generates a unique user ID based on the user's name.
     *
     * @param string $name The user's full name.
     * @return string The generated unique user ID.
     */
    protected static function generateUserId(string $name): string
    {
        // Convertir a mayúsculas, limpiar espacios y caracteres especiales
        $name = Str::upper(Str::slug($name, ' ')); 
        $parts = explode(' ', $name);

        // Construir prefijo combinando primeros 4 caracteres del nombre y 2 del apellido
        $prefix = Str::substr($parts[0] ?? '', 0, 4);
        if (isset($parts[1])) {
            $prefix .= Str::substr($parts[1], 0, 2);
        }

        // Agregar un sufijo numérico aleatorio para asegurar unicidad
        $suffix = mt_rand(1000, 9999);

        $generatedId = $prefix . '_' . $suffix;

        // Asegurarse de que el ID generado sea único en la base de datos
        // Bucle para regenerar si ya existe (muy baja probabilidad)
        while (User::where('user_id', $generatedId)->exists()) {
            $suffix = mt_rand(1000, 9999);
            $generatedId = $prefix . '_' . $suffix;
        }

        return $generatedId; // Ejemplo: "JUANLO_8351"
    }


    /**
     * Get all users data excluding the authenticated user.
     *
     * @return \Illuminate\Database\Eloquent\Collection<int, User>
     */
    public function list(): \Illuminate\Database\Eloquent\Collection
    {
        try {
            $loggedUserId = Auth::user()->user_id;
            return User::with('roles')
                ->where('user_id', '!=', $loggedUserId)
                ->get();
        } catch (Throwable $e) {
            Log::error("Error al listar usuarios: " . $e->getMessage());
            return new \Illuminate\Database\Eloquent\Collection(); 
        }
    }

    /**
     * Create a new user.
     *
     * @param EmployeeCreateRequest $request The request containing user data.
     * @return User The newly created user instance.
     * @throws Throwable If an error occurs during the transaction.
     */
    public static function create(EmployeeCreateRequest $request): User
    {
        return DB::transaction(function () use ($request) {
            $data = $request->validated();
            try {
                $user = User::create([
                    'user_id'      => $data['user_id'] ?? self::generateUserId($data['name']),
                    'name'         => $data['name'],
                    'email'        => $data['email'],
                    'phone'        => $data['phone'] ?? null,
                    'department'   => $data['department'] ?? null,
                    'municipality' => $data['municipality'] ?? null,
                    'address'      => $data['address'] ?? null,
                    'password'     => Hash::make($data['password'] ?? 'password'),
                    'status'       => $data['status'] ?? 'active',
                    'start_at'     => $data['start_at'] ?? now()->toDateString(),
                ]);

                // Asignar rol basado en la 'position'
                if (isset($data['position'])) {
                    $role = Role::where('name', $data['position'])->first();
                    if ($role) {
                        $user->assignRole($role->slug);
                        Log::info("Rol '{$role->slug}' asignado a nuevo usuario {$user->user_id}.");
                    } else {
                        Log::warning("Rol '{$data['position']}' no encontrado al crear usuario {$user->user_id}.");
                    }
                }
                Log::info("Usuario creado exitosamente: {$user->user_id}");
                return $user;
            } catch (Throwable $e) {
                Log::error("Error al crear usuario: " . $e->getMessage(), ['data' => $data]);
                throw new \Exception("No se pudo crear el usuario. " . $e->getMessage());
            }
        });
    }

    /**
     * Update an existing user.
     *
     * @param EmployeeUpdateRequest $request The request containing update data.
     * @param User $user The user model instance to update (resolved via Route Model Binding or found previously).
     * @return User The updated user instance.
     * @throws \Exception If the user is not found or an error occurs during the transaction.
     */
    public function update(EmployeeUpdateRequest $request, User $user): User // <-- Cambiado el tipo de $user a User
    {
        return DB::transaction(function () use ($request, $user) { // <-- Se pasa $user directamente
            $updateData = $request->validated();

            // Eliminar campos que se manejan por separado o no están en fillable
            unset($updateData['password']); 
            unset($updateData['position']); 
            unset($updateData['roles']);   

            try {
                // Actualizar datos del usuario
                $user->fill($updateData);

                // Manejar la contraseña si se proporciona una nueva y no está vacía
                if ($request->has('password') && !empty($request['password'])) {
                    $user->password = Hash::make($request['password']);
                }

                $user->save(); // Guardar los cambios en el usuario
                Log::info("Datos de usuario actualizados para {$user->user_id}.");

                // Actualizar roles
                if ($request->has('roles')) {
                    // Sincroniza los roles. Esto desvinculará los roles no presentes y adjuntará los nuevos.
                    // Para roles()->sync(), Laravel espera un array de IDs (o slugs si la relación lo permite).
                    // Asumiendo que 'roles' contiene los slugs de los roles a sincronizar.
                    $user->roles()->sync($request['roles']);
                    Log::info("Roles sincronizados para usuario {$user->user_id}: " . implode(', ', $request['roles']));
                } elseif ($request->has('position')) {
                    // Si 'roles' no se envía, pero 'position' sí, actualiza el rol principal basado en la posición.
                    $role = Role::where('name', $request['position'])->first();
                    if ($role) {
                        // Primero desvincula todos los roles existentes
                        $user->roles()->detach();
                        // Luego asigna el nuevo rol
                        $user->assignRole($role->slug);
                        Log::info("Rol '{$role->slug}' asignado por posición para usuario {$user->user_id}.");
                    } else {
                        Log::warning("Rol '{$request['position']}' no encontrado al actualizar usuario {$user->user_id} por posición.");
                    }
                }
                Log::info("Usuario {$user->user_id} actualizado exitosamente.");
                return $user;
            } catch (Throwable $e) {
                Log::error("Error al actualizar usuario {$user->user_id}: " . $e->getMessage(), ['trace' => $e->getTraceAsString(), 'data' => $updateData]);
                throw new \Exception("No se pudo actualizar el usuario. " . $e->getMessage());
            }
        });
    }

    /**
     * Delete a user by user_id.
     *
     * @param string $userId The user_id of the user to delete.
     * @return bool True if the user was deleted, false otherwise.
     * @throws Throwable If an error occurs during the transaction.
     */
    public function delete(string $userId): bool
    {
        return DB::transaction(function () use ($userId) {
            $user = User::where('user_id', $userId)->first();

            if (!$user) {
                Log::warning("Intento de eliminar usuario no encontrado: {$userId}");
                return false;
            }

            try {
                $user->roles()->detach(); // Quitar roles asociados
                $deleted = $user->delete();   // Eliminar el usuario
                if ($deleted) {
                    Log::info("Usuario eliminado exitosamente: {$userId}");
                } else {
                    Log::error("No se pudo eliminar el registro del usuario en la base de datos: {$userId}");
                }
                return $deleted;
            } catch (Throwable $e) {
                Log::error("Error al eliminar usuario {$userId}: " . $e->getMessage());
                throw new \Exception("No se pudo eliminar el usuario. " . $e->getMessage());
            }
        });
    }
}
