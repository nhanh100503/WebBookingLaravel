<?php

namespace App\Transformers;

use App\Models\Booking;

class BookingTransformer extends BaseTransformer
{
    /**
     * Transform a booking model into an array for API consumption.
     */
    public function transform(Booking $booking): array
    {
        return [
            'id'             => $booking->id,
            'phone_num'      => $booking->phone_num,
            'first_name'     => $booking->first_name,
            'last_name'      => $booking->last_name,
            'email'          => $booking->email,
            'email_cc'       => $booking->email_cc,
            'company_name'   => $booking->company_name,
            'referer_name'   => $booking->referer_name,
            'contact'        => $booking->contact,
            'survey_channel' => $booking->survey_channel,
            'type'           => $booking->type,
            'service_price'  => (float) $booking->service_price,
            'sub_price'      => (float) $booking->sub_price,
            'vat_price'      => (float) $booking->vat_price,
            'total_price'    => (float) $booking->total_price,
            'coupon_id'      => $booking->coupon_id,
            'passport_id'    => $booking->passport_id,
            'add_ons'        => $booking->relationLoaded('addOns')
                ? $booking->addOns->pluck('add_on')->toArray()
                : null,
            'created_at'     => $booking->created_at->toDateTimeString(),
            'updated_at'     => $booking->updated_at->toDateTimeString(),
        ];
    }
}
