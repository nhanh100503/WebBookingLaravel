<?php

namespace App\Repositories;

use App\Contracts\Repositories\BaseRepositoryInterface;
use App\Models\AddOn;
use Prettus\Repository\Criteria\RequestCriteria;

class AddOnRepository extends BaseRepository implements BaseRepositoryInterface
{
    public function model(): string
    {
        return AddOn::class;
    }

    public function boot(): void
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }
}

