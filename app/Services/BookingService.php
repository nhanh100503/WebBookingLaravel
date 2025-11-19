<?php

namespace App\Services;

use App\Contracts\Repositories\AddOnRepositoryInterface;
use App\Contracts\Repositories\BookingRepositoryInterface;
use App\Models\Booking;
use Illuminate\Support\Facades\DB;

class BookingService extends BaseService
{
    protected BookingRepositoryInterface $bookingRepository;

    protected AddOnRepositoryInterface $addOnRepository;

    public function __construct(
        BookingRepositoryInterface $bookingRepository,
        AddOnRepositoryInterface $addOnRepository
    ) {
        $this->bookingRepository = $bookingRepository;
        $this->addOnRepository = $addOnRepository;
    }

    public function getRepository(): BookingRepositoryInterface
    {
        return $this->bookingRepository;
    }

    public function create(array $data): Booking
    {
        return DB::transaction(function () use ($data) {
            $addOns = $data['add_ons'] ?? [];
            unset($data['add_ons']);

            /** @var Booking $booking */
            $booking = $this->bookingRepository->create($data);

            foreach ($addOns as $addOn) {
                $this->addOnRepository->create([
                    'booking_id' => $booking->id,
                    'add_on' => $addOn,
                ]);
            }

            return $booking->load(['addOns', 'coupon', 'passport']);
        });
    }

    public function update(int $id, array $data): Booking
    {
        return $this->bookingRepository->update($data, $id);
    }
}
