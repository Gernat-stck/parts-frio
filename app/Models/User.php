<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    // 📌 CONFIGURACIÓN CLAVE PARA USAR `user_id` COMO IDENTIFICADOR
    protected $primaryKey = 'user_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'user_id',
        'name',
        'email',
        'phone',
        'department',
        'municipality',
        'address',
        'password',
        'status',
        'start_at'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // 🔗 RELACIÓN CON ROLES
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'role_user', 'user_id', 'role_slug')
            ->withPivot('role_slug');
    }

    // 🧠 ACCESOR PARA ROL PRINCIPAL
    public function getPrimaryRoleSlugAttribute()
    {
        return $this->roles->first()?->slug;
    }

    protected $appends = ['primary_role_slug'];

    // 🎯 MÉTODOS DE ASIGNACIÓN Y VERIFICACIÓN
    public function hasRole($role)
    {
        $roleSlug = is_string($role) ? $role : $role->slug;

        return DB::table('role_user')
            ->where('user_id', $this->user_id)
            ->where('role_slug', $roleSlug)
            ->exists();
    }

    public function hasAnyRole($roles)
    {
        if (is_string($roles)) {
            return $this->hasRole($roles);
        }

        $slugs = array_map(fn($role) => is_string($role) ? $role : $role->slug, $roles);

        return DB::table('role_user')
            ->where('user_id', $this->user_id)
            ->whereIn('role_slug', $slugs)
            ->exists();
    }

    public function assignRole($role)
    {
        if (is_string($role)) {
            $roleModel = Role::where('slug', $role)->first();
            if (!$roleModel) {
                $roleModel = Role::where('name', $role)->first();
            }
            if (!$roleModel) return false;
            $role = $roleModel;
        }

        if (!$this->relationLoaded('roles')) {
            $this->load('roles');
        }

        if (!$this->roles->contains('slug', $role->slug)) {
            $this->roles()->attach($role->slug, ['user_id' => $this->user_id]);
        }

        return true;
    }

    public function removeRole($role)
    {
        if (is_string($role)) {
            $role = Role::where('slug', $role)->first();
            if (!$role) return false;
        }

        $this->roles()->wherePivot('user_id', $this->user_id)->detach($role->slug);
        return true;
    }
}
