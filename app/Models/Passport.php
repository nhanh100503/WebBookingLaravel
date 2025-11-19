<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Passport extends Model
{
    protected $fillable = [
        'first_name',
        'last_name',
        'birthday',
        'expire_date',
        'gender',
        'phone_num',
        'email',
        'email_cc',
        'company_name',
        'referer_name',
        'passport_num',
        'created_at',
        'updated_at',
    ];

    protected $casts = [
        'birthday' => 'date',
        'expire_date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}
