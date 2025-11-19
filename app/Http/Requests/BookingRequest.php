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
            'phone_num'      => ['required', 'string', 'max:20'],
            'first_name'     => ['required', 'string', 'max:50'],
            'last_name'      => ['required', 'string', 'max:50'],
            'email'          => ['required', 'email', 'max:100'],
            'email_cc'       => ['nullable', 'email', 'max:100'],
            'company_name'   => ['nullable', 'string', 'max:100'],
            'referer_name'   => ['nullable', 'string', 'max:100'],
            'contact'        => ['required', 'string', 'max:100'],
            'survey_channel' => ['nullable', 'string', 'max:100'],
            'type'           => ['required', Rule::in(BookingTypeEnum::getValues())],
            'service_price'  => ['required', 'numeric', 'min:0'],
            'sub_price'      => ['required', 'numeric', 'min:0'],
            'vat_price'      => ['required', 'numeric', 'min:0'],
            'total_price'    => ['required', 'numeric', 'min:0'],
            'add_ons'        => ['nullable', 'array'],
            'add_ons.*'      => ['required', Rule::in(AddOnEnum::getValues())],
            'coupon_id'      => ['nullable', 'integer', 'exists:coupons,id'],
            'passport_id'    => ['required', 'integer', 'exists:passports,id'],
        ];
    }
}


