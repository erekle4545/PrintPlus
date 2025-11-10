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
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('social_name')->nullable();
            $table->string('surname')->nullable();
            $table->string('phone')->nullable();
            $table->longText('address')->nullable();
            $table->integer('payment_state')->nullable();
            $table->integer('status')->nullable();
            $table->longText('facebook_correspondence')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
