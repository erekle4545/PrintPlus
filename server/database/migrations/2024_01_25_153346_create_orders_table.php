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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->integer('status')->nullable();
            $table->string('social_name')->nullable();
            $table->string('surname')->nullable();
            $table->string('phone')->nullable();
            $table->float('price')->nullable();
            $table->longText('address')->nullable();
            $table->longText('comments')->nullable();
            $table->integer('payment_state')->nullable();
            $table->text('facebook_correspondence')->nullable();
            $table->integer('delivery_type')->nullable();
            $table->foreignId('customer_id')->nullable()->constrained()->references('id')->on('customers');
            $table->foreignId('user_id')->nullable()->constrained()->references('id')->on('users');
            $table->dateTime('delivery_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
