<?php

namespace App\Repositories;

use App\Contracts\Repositories\ImmigrationRepositoryInterface;
use App\Models\Immigration;
use Prettus\Repository\Criteria\RequestCriteria;

class ImmigrationRepository extends BaseRepository implements ImmigrationRepositoryInterface
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
