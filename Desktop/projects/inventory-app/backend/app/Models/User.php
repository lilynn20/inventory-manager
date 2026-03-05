<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Support\Facades\Hash;

class User extends Model implements AuthenticatableContract, JWTSubject
{
    use Authenticatable;

    protected $connection = 'mongodb';
    protected $collection = 'users';

    protected $fillable = [
        'name', 'email', 'password', 'role', 'company_id', 'is_owner',
    ];

    protected $hidden = ['password'];

    protected $attributes = [
        'role' => 'employee',
        'is_owner' => false,
    ];

    protected $casts = [
        'is_owner' => 'boolean',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id');
    }

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [
            'role' => $this->role,
            'name' => $this->name,
            'company_id' => (string) $this->company_id,
        ];
    }

    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = Hash::make($value);
    }
}
