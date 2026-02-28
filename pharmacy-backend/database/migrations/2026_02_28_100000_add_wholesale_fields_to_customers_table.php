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
        Schema::table('customers', function (Blueprint $table) {
            $table->enum('customer_type', ['retail', 'wholesale'])->default('retail')->after('phone');
            $table->decimal('credit_limit', 12, 2)->default(0)->after('customer_type');
            $table->decimal('current_balance', 12, 2)->default(0)->after('credit_limit');
            $table->integer('payment_terms_days')->default(0)->after('current_balance'); // 0 = immediate, 30 = net 30, etc.
            $table->string('tax_id')->nullable()->after('payment_terms_days');
            $table->string('business_license')->nullable()->after('tax_id');
            $table->decimal('discount_percentage', 5, 2)->default(0)->after('business_license');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            $table->dropColumn([
                'customer_type',
                'credit_limit',
                'current_balance',
                'payment_terms_days',
                'tax_id',
                'business_license',
                'discount_percentage'
            ]);
        });
    }
};
