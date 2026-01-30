<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddPaymentFieldsToOrdersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('orders', function (Blueprint $table) {
            // Add payment fields if they don't exist
            if (!Schema::hasColumn('orders', 'payment_status')) {
                $table->enum('payment_status', [
                    'pending',
                    'paid',
                    'failed',
                    'partially_refunded',
                    'refunded'
                ])->default('pending')->after('payment_method');
            }

            if (!Schema::hasColumn('orders', 'paid_amount')) {
                $table->decimal('paid_amount', 10, 2)->default(0)->after('payment_status');
            }

            if (!Schema::hasColumn('orders', 'refunded_amount')) {
                $table->decimal('refunded_amount', 10, 2)->default(0)->after('paid_amount');
            }

            if (!Schema::hasColumn('orders', 'paid_at')) {
                $table->timestamp('paid_at')->nullable()->after('refunded_amount');
            }
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'payment_status',
                'paid_amount',
                'refunded_amount',
                'paid_at'
            ]);
        });
    }
}
