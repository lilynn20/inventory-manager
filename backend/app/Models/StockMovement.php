<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class StockMovement extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'stock_movements';

    protected $fillable = [
        'product_id', 'type', 'quantity', 'user_id', 'note', 'company_id',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id');
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
