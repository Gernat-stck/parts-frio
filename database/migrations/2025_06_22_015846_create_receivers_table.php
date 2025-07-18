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
        Schema::create('receivers', function (Blueprint $table) {
            $table->id();

            $table->string('nit')->unique();
            $table->string('nrc');
            $table->string('nombre');
            $table->string('codActividad');
            $table->string('descActividad');
            $table->string('nombreComercial')->nullable();

            // Dirección {}
            $table->string('departamento');
            $table->string('municipio');
            $table->string('complemento');

            $table->string('telefono')->nullable();
            $table->string('correo');

            $table->timestamps();

            // Índice para búsqueda rápida
            $table->index(['nit', 'nrc']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('receivers');
    }
};
