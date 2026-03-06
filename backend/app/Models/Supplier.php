<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Supplier extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'suppliers';

    protected $fillable = [
        'name',
        'email',
        'phone',
        'address',
        'company_id',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id');
    }

    public function products()
    {
        return $this->hasMany(Product::class, 'supplier_id');
    }
}
