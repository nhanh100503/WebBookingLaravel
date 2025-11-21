<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\BookingRequest;
use App\Services\BookingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Api\BaseApiController;
use App\Transformers\BookingTransformer;

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
            Log::info('BookingController@store called', ['payload' => $validatedData]);
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
}
