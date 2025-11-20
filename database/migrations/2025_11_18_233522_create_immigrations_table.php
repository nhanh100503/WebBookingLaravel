<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Enums\ImmigrationPackageEnum;
use App\Enums\PickupVehicleEnum;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('immigration', function (Blueprint $table) {
            $table->id();

            $table->string('flight_reservation_num', 50);
            $table->string('flight_num', 20);
            $table->string('airport', 100);
            $table->date('arrival_date');

            $table->boolean('pickup_at_airplain_exit')->default(false);

            $table->enum('immigration_package', ImmigrationPackageEnum::getValues());
            $table->boolean('complete_within_15min')->default(false);

            $table->enum('pickup_vehicle_using', PickupVehicleEnum::getValues())
                  ->default(PickupVehicleEnum::NO);

            $table->string('phone_num_of_picker', 20)->nullable();
            $table->text('requirement')->nullable();

            $table->foreignId('booking_id')->constrained('bookings')->cascadeOnDelete();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('immigration');
    }
};
