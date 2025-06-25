<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'slug'];

    // Añade esta propiedad para indicar que la clave es 'slug' en lugar de 'id'
    protected $primaryKey = 'slug';

    // Indica que la clave primaria no es un entero
    public $incrementing = false;

    // Indica que la clave primaria es de tipo string
    protected $keyType = 'string';

    public function users()
    {
        return $this->belongsToMany(User::class, 'role_user', 'role_slug', 'user_id')
            ->using(RoleUser::class)
            ->withPivot('role_slug');
    }
}
