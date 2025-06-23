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
        Schema::create('emitters', function (Blueprint $table) {
            $table->id();

            $table->string('nit')->unique();
            $table->string('nrc');
            $table->string('nombre');
            $table->string('codActividad');
            $table->string('descActividad');
            $table->string('nombreComercial')->nullable();
            $table->string('tipoEstablecimiento');

            // Dirección
            $table->string('departamento');
            $table->string('municipio');
            $table->string('complemento');

            $table->string('telefono');
            $table->string('correo');
            $table->string('codEstableMH')->nullable();
            $table->string('codEstable')->nullable();
            $table->string('codPuntoVentaMH')->nullable();
            $table->string('codPuntoVenta')->nullable();

            $table->boolean('activo')->default(true);
            $table->timestamps();
            $table->index(['nit', 'nrc']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('emitter');
    }
};
