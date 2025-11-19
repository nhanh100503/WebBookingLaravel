<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Enums\BookingTypeEnum;

class Booking extends Model
{
    protected $fillable = [
        'phone_num',
        'first_name',
        'last_name',
        'email',
        'email_cc',
        'company_name',
        'referer_name',
        'contact',
        'survey_channel',
        'type',
        'service_price',
        'sub_price',
        'vat_price',
        'total_price',
        'coupon_id',
        'passport_id',
        'created_at',
        'updated_at',
    ];

    protected $casts = [
        'type' => BookingTypeEnum::class,
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function coupon()
    {
        return $this->belongsTo(Coupon::class);
    }

    public function passport()
    {
        return $this->belongsTo(Passport::class);
    }

    public function immigration()
    {
        return $this->hasOne(Immigration::class);
    }

    public function emigration()
    {
        return $this->hasOne(Emigration::class);
    }

    public function addOns()
    {
        return $this->hasMany(AddOn::class);
    }
}
