<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class ActivityLog extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'activity_logs';

    protected $fillable = [
        'user_id',
        'user_name',
        'action',
        'entity_type',
        'entity_id',
        'entity_name',
        'details',
        'ip_address',
        'company_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id');
    }

    /**
     * Log an activity
     */
    public static function log(string $action, string $entityType, ?string $entityId = null, ?string $entityName = null, ?array $details = null)
    {
        $user = auth()->user();
        
        return self::create([
            'user_id'     => $user?->_id ? (string) $user->_id : null,
            'user_name'   => $user?->name ?? 'System',
            'action'      => $action,
            'entity_type' => $entityType,
            'entity_id'   => $entityId,
            'entity_name' => $entityName,
            'details'     => $details,
            'ip_address'  => request()->ip(),
            'company_id'  => $user?->company_id,
        ]);
    }
}
