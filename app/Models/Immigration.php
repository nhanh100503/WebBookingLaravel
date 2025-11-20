<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Enums\ImmigrationPackageEnum;

class Immigration extends Model
{
    protected $fillable = [
        'booking_id',
        'immigration_package',
        'flight_reservation_num',
        'flight_num',
        'airport',
        'arrival_date',
        'pickup_at_airplain_exit',
        'complete_within_15min',
        'pickup_vehicle_using',
        'phone_num_of_picker',
        'requirement',
        'created_at',
        'updated_at',
    ];

    protected $casts = [
        'immigration_package' => ImmigrationPackageEnum::class,
        'arrival_date' => 'date',
        'pickup_at_airplain_exit' => 'boolean',
        'complete_within_15min' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }   

}
