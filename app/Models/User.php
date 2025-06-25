<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'name',
        'email',
        'phone',
        'password',
        'status',
        'start_at'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    /**
     * Obtiene los roles asignados al usuario.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'role_user', 'user_id', 'role_slug')
            ->using(RoleUser::class)
            ->withPivot('role_slug');
    }

    /**
     * Verifica si el usuario tiene un rol específico.
     *
     * @param string|Role $role El rol a verificar
     * @return bool True si el usuario tiene el rol, false en caso contrario
     */
    public function hasRole($role)
    {
        // Usar la relación roles con el user_id correcto
        $roleSlug = is_string($role) ? $role : $role->slug;

        return DB::table('role_user')
            ->where('user_id', $this->user_id)  // Asegurarse de usar user_id
            ->where('role_slug', $roleSlug)
            ->exists();
    }

    /**
     * Verifica si el usuario tiene al menos uno de los roles especificados.
     *
     * @param string|array $roles Rol o roles a verificar
     * @return bool True si el usuario tiene al menos uno de los roles, false en caso contrario
     */
    public function hasAnyRole($roles)
    {
        if (is_string($roles)) {
            return $this->hasRole($roles);
        }

        if (is_array($roles)) {
            // Convertir los posibles objetos Role a sus slugs
            $slugs = array_map(function ($role) {
                return is_string($role) ? $role : $role->slug;
            }, $roles);

            // Consulta directa a la tabla de roles
            return DB::table('role_user')
                ->where('user_id', $this->user_id)  // Asegurarse de usar user_id
                ->whereIn('role_slug', $slugs)
                ->exists();
        }

        return false;
    }

    /**
     * Asigna un rol al usuario.
     *
     * @param string|Role $role El rol a asignar
     * @return bool True si el rol se asignó correctamente o ya estaba asignado, false si hubo un error
     */
    public function assignRole($role)
    {
        if (is_string($role)) {
            $role = Role::where('slug', $role)->first();
            if (!$role) {
                return false;
            }
        }

        if (!$this->roles->contains('slug', $role->slug)) {
            // Usar explícitamente el ID correcto del usuario
            $this->roles()->attach($role->slug, ['user_id' => $this->user_id]);
        }

        return true;
    }

    /**
     * Elimina un rol del usuario.
     *
     * @param string|Role $role El rol que se eliminará
     * @return bool Verdadero si se eliminó correctamente, falso en caso contrario
     */
    public function removeRole($role)
    {
        if (is_string($role)) {
            $role = Role::where('slug', $role)->first();
            if (!$role) {
                return false;
            }
        }

        // Usar explícitamente el ID correcto del usuario al eliminar
        $this->roles()->wherePivot('user_id', $this->user_id)->detach($role->slug);
        return true;
    }
}
