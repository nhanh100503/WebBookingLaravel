<?php

namespace App\Models;

use App\Enums\DiscountTypeEnum;
use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    protected $fillable = [
        'name',
        'code',
        'discount', 
        'start_date',
        'end_date',
        'usage_limit',
        'is_stackable',
        'type',
        'created_at',
        'updated_at',
    ];

    protected $casts = [
        'type' => DiscountTypeEnum::class,
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
    
}
