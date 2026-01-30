<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTransactionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();

            // Reference to order
            $table->foreignId('order_id')->constrained()->onDelete('cascade');

            // Transaction identification
            $table->string('transaction_id')->unique(); // Our internal transaction ID
            $table->string('payment_gateway')->default('bog'); // bog, tbc, paypal, etc.
            $table->string('gateway_transaction_id')->nullable(); // ID from payment gateway (BOG payment_id)

            // Transaction type and status
            $table->enum('type', ['payment', 'refund', 'chargeback'])->default('payment');
            $table->enum('status', [
                'pending',      // Initiated but not completed
                'processing',   // Being processed by gateway
                'completed',    // Successfully completed
                'failed',       // Failed
                'cancelled',    // Cancelled by user
                'refunded',     // Refunded (for payment type)
                'partially_refunded' // Partially refunded
            ])->default('pending');

            // Amounts
            $table->decimal('amount', 10, 2); // Transaction amount
            $table->string('currency', 3)->default('GEL');

            // For refunds - reference to original payment transaction
            $table->foreignId('parent_transaction_id')->nullable()->constrained('transactions')->onDelete('set null');

            // Gateway response data
            $table->json('request_data')->nullable(); // Data sent to gateway
            $table->json('response_data')->nullable(); // Response from gateway
            $table->json('callback_data')->nullable(); // Callback data from gateway

            // Additional information
            $table->text('description')->nullable();
            $table->text('error_message')->nullable(); // Error details if failed
            $table->string('customer_ip', 45)->nullable(); // IP address of customer

            // Important timestamps
            $table->timestamp('initiated_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('failed_at')->nullable();
            $table->timestamp('refunded_at')->nullable();

            $table->timestamps();

            // Indexes for better performance
            $table->index('order_id');
            $table->index('transaction_id');
            $table->index('gateway_transaction_id');
            $table->index('status');
            $table->index('type');
            $table->index(['order_id', 'type']);
            $table->index(['order_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
}
