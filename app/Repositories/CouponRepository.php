<?php

namespace App\Repositories;

use App\Contracts\Repositories\BaseRepositoryInterface;
use App\Models\Coupon;
use Prettus\Repository\Criteria\RequestCriteria;

class CouponRepository extends BaseRepository implements BaseRepositoryInterface
{
    public function model(): string
    {
        return Coupon::class;
    }

    public function boot(): void
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }
}

