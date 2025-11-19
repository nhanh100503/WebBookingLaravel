<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Enums\BookingTypeEnum;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();

            $table->string('phone_num', 20);
            $table->string('first_name', 50);
            $table->string('last_name', 50);
            $table->string('email', 100);
            $table->string('email_cc', 100)->nullable();
            $table->string('company_name', 100)->nullable();
            $table->string('referer_name', 100)->nullable();

            $table->string('contact', 100);
            $table->string('survey_channel', 100)->nullable();
            $table->enum('type', BookingTypeEnum::getValues());

            $table->decimal('service_price', 10, 2)->default(0);
            $table->decimal('sub_price', 10, 2)->default(0);
            $table->decimal('vat_price', 10, 2)->default(0);
            $table->decimal('total_price', 10, 2)->default(0);

            $table->foreignId('coupon_id')->nullable()->constrained('coupons')->nullOnDelete();
            $table->foreignId('passport_id')->constrained('passports')->cascadeOnDelete();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
