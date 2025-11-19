<?php

namespace App\Repositories;

use App\Contracts\Repositories\BaseRepositoryInterface;
use App\Models\Immigration;
use Prettus\Repository\Criteria\RequestCriteria;

class ImmigrationRepository extends BaseRepository implements BaseRepositoryInterface
{
    public function model(): string
    {
        return Immigration::class;
    }

    public function boot(): void
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }
}

