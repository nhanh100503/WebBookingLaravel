<?php

namespace App\Services;

use App\Models\Coupon;
use Carbon\Carbon;

class CouponService
{
    /**
     * Validate a coupon code
     * 
     * @param string $code The coupon code to validate
     * @return array Returns array with 'valid' boolean and 'coupon' or 'message'
     */
    public function validateCoupon(string $code): array
    {
        $coupon = Coupon::where('code', strtoupper(trim($code)))->first();

        if (!$coupon) {
            return [
                'valid' => false,
                'message' => 'Coupon code not found',
            ];
        }

        // Check if coupon is within valid date range
        $now = Carbon::now()->startOfDay();
        $startDate = Carbon::parse($coupon->start_date)->startOfDay();
        $endDate = Carbon::parse($coupon->end_date)->endOfDay();

        if ($now->lt($startDate)) {
            return [
                'valid' => false,
                'message' => 'Coupon is not yet active',
            ];
        }

        if ($now->gt($endDate)) {
            return [
                'valid' => false,
                'message' => 'Coupon has expired',
            ];
        }

        // Check usage limit
        $usageCount = $coupon->bookings()->count();
        if ($usageCount >= $coupon->usage_limit) {
            return [
                'valid' => false,
                'message' => 'Coupon usage limit has been reached',
            ];
        }

        return [
            'valid' => true,
            'coupon' => $coupon,
        ];
    }
}
