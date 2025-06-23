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
        Schema::create('sales_history', function (Blueprint $table) {
            $table->id();

            // Datos del documento
            $table->string('tipoDTE'); // Tipo de DTE (Factura, Credito Fiscal, etc.)
            $table->string('numeroControl')->index(); // Número de control del DTE
            $table->string('codigoGeneracion')->unique(); // Código de generación del DTE
            $table->string('tipoContingencia')->nullable(); // Tipo de contingencia (si aplica)
            $table->string('motivoContingencia')->nullable(); // Motivo de la contingencia (si aplica)
            $table->string('tipoModelo'); // Modelo del DTE (Factura Electrónica, Nota de Crédito, etc.)
            $table->string('horaEmi');
            $table->string('fechaEmi')->index();
            $table->string('tipoMoneda')->default('USD');
            $table->string('nitReceiver')->index(); // NIT del receptor del DTE


            $table->string('estado', 20)->default('EMITIDO'); // EMITIDO, ANULADO, INVALIDADO, etc.

            // Datos de transmisión a Hacienda
            $table->json('json_enviado')->nullable(); // JSON con los datos enviados a Hacienda
            $table->json('json_recibido')->nullable(); // JSON con la respuesta de Hacienda

            $table->timestamps();

            // Índices para búsqueda rápida
            $table->index([
                'tipoDTE',
                'numeroControl',
                'codigoGeneracion',
                'tipoModelo',
                'fechaEmi',
                'nitReceiver',
                'estado'
            ]);
            $table->foreign('nitReceiver')
                ->references('nit')
                ->on('receivers')
                ->onDelete('cascade'); // Elimina las ventas si se elimina el receptor

            $table->softDeletes(); // Añade la columna deleted_at para soft deletes
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sales_history');
    }
};
