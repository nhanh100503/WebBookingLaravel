<?php

namespace App\Http\Controllers\Api;

use App\Services\CouponService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CouponController extends BaseApiController
{
    protected CouponService $couponService;

    public function __construct(CouponService $couponService)
    {
        $this->couponService = $couponService;
    }

    public function validate(string $code): JsonResponse
    {
        try {
            $result = $this->couponService->validateCoupon($code);
            
            if ($result['valid']) {
                $coupon = $result['coupon'];
                return $this->respond([
                    'valid' => true,
                    'coupon' => [
                        'id' => $coupon->id,
                        'name' => $coupon->name,
                        'code' => $coupon->code,
                        'discount' => (float) $coupon->discount,
                        'type' => $coupon->type->value,
                        'is_stackable' => (bool) $coupon->is_stackable,
                    ],
                ]);
            }

            return $this->respond([
                'valid' => false,
                'message' => $result['message'] ?? 'Invalid coupon code',
            ], 400);
        } catch (\Exception $e) {
            return $this->respondWithError(
                'Failed to validate coupon',
                ['error' => $e->getMessage()],
                500
            );
        }
    }
}

