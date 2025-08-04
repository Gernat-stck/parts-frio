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
        Schema::create('inventory', function (Blueprint $table) {
            $table->id();
            $table->string('product_name')->unique();
            $table->string('product_code')->unique();
            $table->string('category');
            $table->unsignedTinyInteger('tipo_item');
            $table->string('description');
            $table->unsignedBigInteger('stock');
            $table->decimal('price', 8, 2)->default(0.00);
            $table->string('img_product');
            $table->unsignedInteger('min_stock')->default(0);
            $table->unsignedInteger('max_stock')->default(3);
            $table->decimal('ivaItem', 5, 2)->default(0.00);
            $table->decimal('psv', 8, 2)->default(0.00);
            $table->json('tributos')->nullable();
            $table->unsignedSmallInteger('uniMedida')->default(99);
            $table->decimal('precioUni', 8, 2)->default(0.00);
            $table->decimal('montoDescu', 8, 2)->default(0.00);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventory');
    }
};
