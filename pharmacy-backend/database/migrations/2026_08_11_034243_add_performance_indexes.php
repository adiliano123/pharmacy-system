<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // sales table — queried heavily by date and user
        Schema::table('sales', function (Blueprint $table) {
            if (!$this->indexExists('sales', 'sales_created_at_index')) {
                $table->index('created_at', 'sales_created_at_index');
            }
            if (!$this->indexExists('sales', 'sales_user_id_index')) {
                $table->index('user_id', 'sales_user_id_index');
            }
        });

        // stock_batches — queried heavily by expiry_date and product_id
        Schema::table('stock_batches', function (Blueprint $table) {
            if (!$this->indexExists('stock_batches', 'batches_expiry_date_index')) {
                $table->index('expiry_date', 'batches_expiry_date_index');
            }
            if (!$this->indexExists('stock_batches', 'batches_product_id_index')) {
                $table->index('product_id', 'batches_product_id_index');
            }
        });

        // sale_items — joined frequently
        Schema::table('sale_items', function (Blueprint $table) {
            if (!$this->indexExists('sale_items', 'sale_items_product_id_index')) {
                $table->index('product_id', 'sale_items_product_id_index');
            }
            if (!$this->indexExists('sale_items', 'sale_items_sale_id_index')) {
                $table->index('sale_id', 'sale_items_sale_id_index');
            }
        });

        // activity_logs — queried by user_id and created_at
        Schema::table('activity_logs', function (Blueprint $table) {
            if (!$this->indexExists('activity_logs', 'logs_created_at_index')) {
                $table->index('created_at', 'logs_created_at_index');
            }
            if (!$this->indexExists('activity_logs', 'logs_user_id_index')) {
                $table->index('user_id', 'logs_user_id_index');
            }
        });
    }

    public function down(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            $table->dropIndex('sales_created_at_index');
            $table->dropIndex('sales_user_id_index');
        });
        Schema::table('stock_batches', function (Blueprint $table) {
            $table->dropIndex('batches_expiry_date_index');
            $table->dropIndex('batches_product_id_index');
        });
        Schema::table('sale_items', function (Blueprint $table) {
            $table->dropIndex('sale_items_product_id_index');
            $table->dropIndex('sale_items_sale_id_index');
        });
        Schema::table('activity_logs', function (Blueprint $table) {
            $table->dropIndex('logs_created_at_index');
            $table->dropIndex('logs_user_id_index');
        });
    }

    private function indexExists(string $table, string $index): bool
    {
        return collect(\DB::select("SHOW INDEX FROM `{$table}`"))
            ->pluck('Key_name')
            ->contains($index);
    }
};
