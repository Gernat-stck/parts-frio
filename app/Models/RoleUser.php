<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Relations\Pivot;

class RoleUser extends Pivot
{
    use HasFactory;

    protected $table = 'role_user';

    protected $fillable = ['user_id', 'role_slug'];

    public $incrementing = false;

    public $timestamps = false;

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function role()
    {
        return $this->belongsTo(Role::class, 'role_slug', 'slug');
    }
}
