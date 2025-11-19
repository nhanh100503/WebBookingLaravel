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
        'created_at',
        'updated_at',
    ];

    protected $casts = [
        'immigration_package' => ImmigrationPackageEnum::class,
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }   

}
