<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Category extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'categories';

    protected $fillable = ['name', 'description', 'company_id'];

    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id');
    }

    public function products()
    {
        return $this->hasMany(Product::class, 'category_id');
    }
}
