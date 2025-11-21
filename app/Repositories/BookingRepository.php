<?php

namespace App\Repositories;

use App\Contracts\Repositories\BookingRepositoryInterface;
use App\Models\Booking;
use Prettus\Repository\Criteria\RequestCriteria;

class BookingRepository extends BaseRepository implements BookingRepositoryInterface
{
    public function model(): string
    {
        return Booking::class;
    }

    public function boot(): void
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }
}
