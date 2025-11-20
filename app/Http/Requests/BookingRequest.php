<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\AddOnEnum;
use App\Enums\BookingTypeEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BookingRequest extends BaseRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * These rules map directly to the required columns on the bookings table.
     */
    public function rules(): array
    {
        return [
            // Passport data
            'passport' => ['required', 'array'],
            'passport.first_name' => ['required', 'string', 'max:50'],
            'passport.last_name' => ['required', 'string', 'max:50'],
            'passport.birthday' => ['required', 'date'],
            'passport.expire_date' => ['required', 'date'],
            'passport.gender' => ['required', 'string', 'max:100'],
            'passport.phone_num' => ['required', 'string', 'max:20'],
            'passport.email' => ['required', 'email', 'max:100'],
            'passport.email_cc' => ['nullable', 'email', 'max:100'],
            'passport.passport_num' => ['required', 'string', 'max:50'],
            'passport.company_name' => ['nullable', 'string', 'max:100'],
            'passport.referer_name' => ['nullable', 'string', 'max:100'],

            // Booking data
            'phone_num' => ['required', 'string', 'max:20'],
            'first_name' => ['required', 'string', 'max:50'],
            'last_name' => ['required', 'string', 'max:50'],
            'email' => ['required', 'email', 'max:100'],
            'email_cc' => ['nullable', 'email', 'max:100'],
            'company_name' => ['nullable', 'string', 'max:100'],
            'referer_name' => ['nullable', 'string', 'max:100'],
            'contact' => ['required', 'string', 'max:100'],
            'survey_channel' => ['nullable', 'string', 'max:100'],
            'type' => ['required', Rule::in(BookingTypeEnum::getValues())],
            'service_price' => ['required', 'numeric', 'min:0'],
            'sub_price' => ['required', 'numeric', 'min:0'],
            'vat_price' => ['required', 'numeric', 'min:0'],
            'total_price' => ['required', 'numeric', 'min:0'],
            'add_ons' => ['nullable', 'array'],
            'add_ons.*' => ['required', Rule::in(AddOnEnum::getValues())],
            'coupon_id' => ['nullable', 'integer', 'exists:coupons,id'],

            // Immigration data (optional)
            'immigration' => ['nullable', 'array'],
            'immigration.immigration_package' => ['required_with:immigration', 'string'],
            'immigration.flight_reservation_num' => ['required_with:immigration', 'string', 'max:50'],
            'immigration.flight_num' => ['required_with:immigration', 'string', 'max:20'],
            'immigration.airport' => ['required_with:immigration', 'string', 'max:100'],
            'immigration.arrival_date' => ['required_with:immigration', 'date'],
            'immigration.pickup_at_airplain_exit' => ['nullable', 'boolean'],
            'immigration.complete_within_15min' => ['nullable', 'boolean'],
            'immigration.pickup_vehicle_using' => ['nullable', 'string'],
            'immigration.phone_num_of_picker' => ['nullable', 'string', 'max:20'],
            'immigration.requirement' => ['nullable', 'string'],

            // Emigration data (optional)
            'emigration' => ['nullable', 'array'],
            'emigration.emigration_package' => ['required_with:emigration', 'string'],
            'emigration.flight_reservation_num' => ['required_with:emigration', 'string', 'max:50'],
            'emigration.airline_membership_num' => ['nullable', 'string', 'max:50'],
            'emigration.airport' => ['required_with:emigration', 'string', 'max:100'],
            'emigration.seating_pref' => ['nullable', 'string', 'max:50'],
            'emigration.phone_num_of_picker' => ['nullable', 'string', 'max:20'],
            'emigration.requirement' => ['nullable', 'string'],
        ];
    }
}


