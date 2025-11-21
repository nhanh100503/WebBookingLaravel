<?php

namespace App\Repositories;

use App\Contracts\Repositories\EmigrationRepositoryInterface;
use App\Models\Emigration;
use Prettus\Repository\Criteria\RequestCriteria;

class EmigrationRepository extends BaseRepository implements EmigrationRepositoryInterface
{
    public function model(): string
    {
        return Emigration::class;
    }

    public function boot(): void
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }
}
