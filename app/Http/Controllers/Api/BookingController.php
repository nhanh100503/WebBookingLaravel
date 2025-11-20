<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\BookingRequest;
use App\Services\BookingService;
use App\Transformers\BookingTransformer;
use Illuminate\Http\JsonResponse;

class BookingController extends BaseApiController
{
    protected BookingService $bookingService;

    public function __construct(BookingService $bookingService)
    {
        $this->bookingService = $bookingService;
    }

    public function store(BookingRequest $request): JsonResponse
    {
        $validatedData = $request->validated();

        try {
            $booking = $this->bookingService->create($validatedData);
            return $this->respondWithItem($booking, new BookingTransformer(), 201);
        } catch (\Exception $e) {
            return $this->respondWithError(
                'Failed to create booking',
                ['error' => $e->getMessage()],
                500
            );
        }
    }

    public function show(int $id): JsonResponse
    {
        try {
            $booking = $this->bookingService->getRepository()->find($id);
            if (!$booking) {
                return $this->respondWithError('Booking not found', [], 404);
            }
            return $this->respondWithItem($booking->load(['addOns', 'coupon', 'passport', 'immigration', 'emigration']), new BookingTransformer());
        } catch (\Exception $e) {
            return $this->respondWithError(
                'Failed to retrieve booking',
                ['error' => $e->getMessage()],
                500
            );
        }
    }
}
