<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name',
        'category',
        'description',
        'price',
        'cost_price',
        'wholesale_price',
        'minimum_order_quantity',
        'is_controlled',
    ];

    protected $casts = [
        'is_controlled' => 'boolean',
        'price'         => 'float',
        'cost_price'    => 'float',
        'wholesale_price' => 'float',
    ];

    public function stockBatches()
    {
        return $this->hasMany(StockBatch::class);
    }

    public function saleItems()
    {
        return $this->hasMany(SaleItem::class);
    }
}
