<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Company extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'companies';

    protected $fillable = [
        'name',
        'email',
        'phone',
        'address',
        'logo',
    ];

    public function users()
    {
        return $this->hasMany(User::class, 'company_id');
    }

    public function products()
    {
        return $this->hasMany(Product::class, 'company_id');
    }

    public function categories()
    {
        return $this->hasMany(Category::class, 'company_id');
    }

    public function stockMovements()
    {
        return $this->hasMany(StockMovement::class, 'company_id');
    }
}
