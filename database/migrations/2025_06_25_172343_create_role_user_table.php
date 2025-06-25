<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('role_user', function (Blueprint $table) {
            // Cambiamos la referencia al user_id como string
            $table->string('user_id');
            $table->string('role_slug');

            // Añadir nueva clave primaria
            $table->primary(['user_id', 'role_slug']);

            // Añadir clave foránea para role_slug
            $table->foreign('role_slug')
                ->references('slug')
                ->on('roles')
                ->onDelete('cascade')
                ->onUpdate('cascade');
            // Establecemos la relación con la columna user_id de la tabla users
            $table->foreign('user_id')
                ->references('user_id')
                ->on('users')
                ->onDelete('cascade')
                ->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('role_user');
    }
};
