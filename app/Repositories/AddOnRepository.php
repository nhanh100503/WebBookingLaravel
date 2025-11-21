<?php

namespace App\Repositories;

use App\Contracts\Repositories\AddOnRepositoryInterface;
use App\Models\AddOn;
use Prettus\Repository\Criteria\RequestCriteria;

class AddOnRepository extends BaseRepository implements AddOnRepositoryInterface
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
