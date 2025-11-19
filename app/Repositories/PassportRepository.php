<?php

namespace App\Repositories;

use App\Contracts\Repositories\BaseRepositoryInterface;
use App\Models\Passport;
use Prettus\Repository\Criteria\RequestCriteria;

class PassportRepository extends BaseRepository implements BaseRepositoryInterface
{
    public function model(): string
    {
        return Passport::class;
    }

    public function boot(): void
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }
}

