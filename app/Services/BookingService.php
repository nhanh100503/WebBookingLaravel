<?php

namespace App\Services;

use App\Contracts\Repositories\AddOnRepositoryInterface;
use App\Contracts\Repositories\BookingRepositoryInterface;
use App\Contracts\Repositories\EmigrationRepositoryInterface;
use App\Contracts\Repositories\ImmigrationRepositoryInterface;
use App\Contracts\Repositories\PassportRepositoryInterface;
use App\Models\Booking;
use Illuminate\Support\Facades\DB;

class BookingService extends BaseService
{
    protected BookingRepositoryInterface $bookingRepository;
    protected AddOnRepositoryInterface $addOnRepository;
    protected PassportRepositoryInterface $passportRepository;
    protected ImmigrationRepositoryInterface $immigrationRepository;
    protected EmigrationRepositoryInterface $emigrationRepository;

    public function __construct(
        BookingRepositoryInterface $bookingRepository,
        AddOnRepositoryInterface $addOnRepository,
        PassportRepositoryInterface $passportRepository,
        ImmigrationRepositoryInterface $immigrationRepository,
        EmigrationRepositoryInterface $emigrationRepository
    ) {
        $this->bookingRepository = $bookingRepository;
        $this->addOnRepository = $addOnRepository;
        $this->passportRepository = $passportRepository;
        $this->immigrationRepository = $immigrationRepository;
        $this->emigrationRepository = $emigrationRepository;
    }

    public function getRepository(): BookingRepositoryInterface
    {
        return $this->bookingRepository;
    }

    public function create(array $data): Booking
    {
        return DB::transaction(function () use ($data) {
            // Extract nested data
            $passportData = $data['passport'] ?? [];
            $immigrationData = $data['immigration'] ?? null;
            $emigrationData = $data['emigration'] ?? null;
            $addOns = $data['add_ons'] ?? [];

            // Create passport
            $passport = $this->passportRepository->create($passportData);

            // Prepare booking data
            $bookingData = $data;
            $bookingData['passport_id'] = $passport->id;
            unset($bookingData['passport'], $bookingData['immigration'], $bookingData['emigration'], $bookingData['add_ons']);

            // Create booking
            /** @var Booking $booking */
            $booking = $this->bookingRepository->create($bookingData);

            // Create immigration if provided
            if ($immigrationData) {
                $immigrationData['booking_id'] = $booking->id;
                $this->immigrationRepository->create($immigrationData);
            }

            // Create emigration if provided
            if ($emigrationData) {
                $emigrationData['booking_id'] = $booking->id;
                $this->emigrationRepository->create($emigrationData);
            }

            // Create add-ons
            foreach ($addOns as $addOn) {
                $this->addOnRepository->create([
                    'booking_id' => $booking->id,
                    'add_on' => $addOn,
                ]);
            }

            return $booking->load(['addOns', 'coupon', 'passport', 'immigration', 'emigration']);
        });
    }

    public function update(int $id, array $data): Booking
    {
        return $this->bookingRepository->update($data, $id);
    }
}
