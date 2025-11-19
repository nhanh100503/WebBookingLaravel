<?php

declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

final class DiscountTypeEnum extends Enum
{
    const VALUE = 'value_discount';
    const PERCENT = 'percent_discount';
}
