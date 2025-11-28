<?php 

declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

final class AddOnEnum extends Enum
{
    const AIRPORT_LOUNGE = 0;
    const HOTEL = 1;
    const SHOPPING = 2;
    const RENTAL_CAR = 3;
    const AIRLINE_TICKET = 4;

    const RESTAURANT = 5;
    const MASSAGE = 6;
    const INTERPRETATION = 7;
    const GOLF = 8;
    const FIND_SUPPLIERS = 9;

    public static function getDescriptions(): array
    {
        return [
            self::AIRPORT_LOUNGE => 'Airport Lounge', //Airport Lounge
            self::HOTEL => 'Hotels for Japanese and foreign tourists', //Hotels for Japanese and foreign tourists
            self::SHOPPING => 'Shopping spots', //Shopping spots
            self::RENTAL_CAR => 'Rental Car', //Rental Car
            self::AIRLINE_TICKET => 'Airline tickets (purchase, change, etc.)', //Airline tickets (purchase, change, etc.)

            self::RESTAURANT => 'Restaurants for Japanese and foreign tourists', //Restaurants for Japanese and foreign tourists
            self::MASSAGE => 'Massage, health care, beauty care', //Massage, health care, beauty care
            self::INTERPRETATION => 'Interpretation and tourist information', //Interpretation and tourist information
            self::GOLF => 'golf', //golf
            self::FIND_SUPPLIERS => 'Finding Vietnamese suppliers and connecting with Vietnamese companies',    //Finding Vietnamese suppliers and connecting with Vietnamese companies
        ];
    }
}
