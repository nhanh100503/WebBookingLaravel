<?php

namespace App\Providers;

use App\Contracts\Repositories\AddOnRepositoryInterface;
use App\Contracts\Repositories\BookingRepositoryInterface;
use App\Contracts\Repositories\CouponRepositoryInterface;
use App\Contracts\Repositories\EmigrationRepositoryInterface;
use App\Contracts\Repositories\ImmigrationRepositoryInterface;
use App\Contracts\Repositories\PassportRepositoryInterface;
use App\Repositories\AddOnRepository;
use App\Repositories\BookingRepository;
use App\Repositories\CouponRepository;
use App\Repositories\EmigrationRepository;
use App\Repositories\ImmigrationRepository;
use App\Repositories\PassportRepository;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(BookingRepositoryInterface::class, BookingRepository::class);
        $this->app->bind(AddOnRepositoryInterface::class, AddOnRepository::class);
        $this->app->bind(CouponRepositoryInterface::class, CouponRepository::class);
        $this->app->bind(PassportRepositoryInterface::class, PassportRepository::class);
        $this->app->bind(ImmigrationRepositoryInterface::class, ImmigrationRepository::class);
        $this->app->bind(EmigrationRepositoryInterface::class, EmigrationRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
