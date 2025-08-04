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
            $table->string('user_id');     // 🔄 Clave foránea tipo string
            $table->string('role_slug');   // 🔄 Clave foránea tipo string

            $table->primary(['user_id', 'role_slug']); // ✅ Clave compuesta

            // 🔗 Relación con tabla roles
            $table->foreign('role_slug')
                ->references('slug')
                ->on('roles')
                ->onDelete('cascade')
                ->onUpdate('cascade');

            // 🔗 Relación con tabla users
            $table->foreign('user_id')
                ->references('user_id') // 🚨 IMPORTANTE: Debe existir como string en tabla users
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
