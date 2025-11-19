<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Enums\EmigrationPackageEnum;

class Emigration extends Model
{
    protected $fillable = [
        'booking_id',
        'emigration_package',
        'flight_reservation_num',
        'airline_membership_num',
        'airport',
        'seating_pref',
        'phone_num_of_picker',
        'requirement',
        'created_at',
        'updated_at',
    ];

    protected $casts = [
        'emigration_package' => EmigrationPackageEnum::class,
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }
}
