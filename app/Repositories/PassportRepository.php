<?php

namespace App\Repositories;

use App\Contracts\Repositories\PassportRepositoryInterface;
use App\Models\Passport;
use Prettus\Repository\Criteria\RequestCriteria;

class PassportRepository extends BaseRepository implements PassportRepositoryInterface
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
