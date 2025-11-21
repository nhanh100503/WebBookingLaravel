<?php

use App\Http\Controllers\Api\BookingController;
use Illuminate\Support\Facades\Route;

Route::middleware('api')->group(function () {
    Route::post('/bookings', [BookingController::class, 'store'])->name('api.bookings.store');
});
