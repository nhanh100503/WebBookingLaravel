<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\CouponController;

Route::post('/bookings', [BookingController::class, 'store']);
Route::get('/bookings/{id}', [BookingController::class, 'show']);
Route::get('/coupons/validate/{code}', [CouponController::class, 'validate']);

