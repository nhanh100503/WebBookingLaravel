<?php

declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

final class BookingTypeEnum extends Enum
{
    const IMMIGRATION = 'immigration';
    const EMIGRATION = 'emigration';
    const BOTH = 'both';
}
