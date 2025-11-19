<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('passports', function (Blueprint $table) {
            $table->id();
            $table->string('first_name', 50);
            $table->string('last_name', 50);
            $table->date('birthday');
            $table->date('expire_date');
            $table->string('gender', 100);
            $table->string('phone_num', 20);
            $table->string('email', 100);
            $table->string('email_cc', 100)->nullable();
            $table->string('passport_num', 50);
            $table->string('company_name', 100)->nullable();
            $table->string('referer_name', 100)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('passports');
    }
};
