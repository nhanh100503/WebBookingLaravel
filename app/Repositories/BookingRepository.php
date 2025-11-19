<?php

namespace App\Repositories;

use App\Contracts\Repositories\BaseRepositoryInterface;
use App\Models\Booking;
use Prettus\Repository\Criteria\RequestCriteria;

class BookingRepository extends BaseRepository implements BaseRepositoryInterface
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

