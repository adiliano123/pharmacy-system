<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'address',
        'customer_type',
        'credit_limit',
        'current_balance',
        'payment_terms_days',
        'tax_id',
        'business_license',
        'discount_percentage',
    ];

    public function sales()
    {
        return $this->hasMany(Sale::class);
    }
}
