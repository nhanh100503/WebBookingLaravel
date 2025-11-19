<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Enums\EmigrationPackageEnum;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('emigration', function (Blueprint $table) {
            $table->id();

            $table->string('flight_reservation_num', 50);
            $table->string('airline_membership_num', 50)->nullable();
            $table->string('airport', 100);
            $table->string('seating_pref', 50)->nullable();
            
            $table->string('phone_num_of_picker', 20)->nullable();
            $table->text('requirement')->nullable();
            
            $table->enum('emigration_package', EmigrationPackageEnum::getValues());

            $table->foreignId('booking_id')->constrained('bookings')->cascadeOnDelete();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('emigrations');
    }
};
