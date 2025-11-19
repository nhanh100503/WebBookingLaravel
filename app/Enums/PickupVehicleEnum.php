<?php 

declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

final class PickupVehicleEnum extends Enum
{
    const NO = 'no';
    const SEAT_4 = '4_seat';
    const SEAT_7 = '7_seat';
    const LIMO_7 = 'limousine_7_seat';
}
