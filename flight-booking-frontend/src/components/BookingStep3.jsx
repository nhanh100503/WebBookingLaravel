import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBooking } from '../services/bookingService';
import PriceBar from './PriceBar';
import ProcessIndicator from './ProcessIndicator';

const BookingStep3 = ({ bookingData, setBookingData }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Helper functions to get labels
  const getImmigrationPackageLabel = (value) => {
    const packages = {
      '35$': 'VIP_IN1_Use priority lane only at immigration (Fee: 35$)',
      '40$': 'VIP_IN2_Priority lane at immigration + escort to pick-up point outside the airport (Fee: $40)',
      '50$': 'VIP_IN3_Priority lane access at immigration + baggage claim assistance + escort to pick-up point outside the airport (Fee: $50)',
      '300$': 'VIP_IN6_VVIP Priority Lane Use Non-stop Package (Fee: $300)',
    };
    return packages[value] || value;
  };

  const getEmigrationPackageLabel = (value) => {
    const packages = {
      '50$': 'Use Fasttrack full support for departure (50$)',
      '300$': 'Use VVIP Departure Fasttrack (300$)',
    };
    return packages[value] || value;
  };

  const getPickupVehicleLabel = (value) => {
    const vehicles = {
      'no': 'Do not use',
      '4_seat': 'Pick-up car 4 seats (20$)',
      '7_seat': 'Pick-up car 7 seats (25$)',
      'limousine_7_seat': 'Pick-up car 7 seats Limousine (50$)',
    };
    return vehicles[value] || value;
  };

  const getSeatingPreferenceLabel = (value) => {
    const preferences = {
      'dont_want': "I don't want",
      'front_window': 'Front window seat',
      'front_aisle': 'Front aisle',
      'front_middle_window': 'Front middle seat or window seat',
      'middle_window': 'Middle row window seat',
      'middle_aisle': 'Middle row aisle',
      'middle_middle_window': 'Middle row: middle seat or window seat',
      'rear_aisle': 'Rear aisle side',
      'rear_window': 'Rear window seat',
      'rear_middle_window': 'Rear middle seat or window seat',
    };
    return preferences[value] || value;
  };

  const getAirportLabel = (value) => {
    const airports = {
      'SGN': 'SGN - Tan Son Nhat Airport (Tan Son Nhat, Ho Chi Minh City)',
      'DAD': 'DAD - Da Nang Airport',
      'HAN': 'HAN - Noi Bai (Ha Noi)',
    };
    return airports[value] || value;
  };

  const getContactLabel = (value) => {
    const contacts = {
      'line_joined_sent_message': 'Joined and sent a message',
      'email_only': 'I would prefer email only (response may be delayed at the airport)',
      'zalo': 'Please contact me at ZALO at the number above.',
      'add_line_later': 'Add LINE later',
      'phone_only': 'Phone only (problems with charges and roaming may occur)',
      'no_communication': 'I have no means of communication at the airport and would like to ask for advice.',
    };
    return contacts[value] || value;
  };

  const getSurveyChannelLabel = (value) => {
    const channels = {
      'introduction_by_acquaintance': 'Introduction by an acquaintance',
      'facebook': 'Facebook',
      'search_sites': 'Search sites (Google, Yahoo, etc.)',
      'service_introduction_email': 'Service introduction email',
      'advertisement': 'advertisement',
      'reuse': 'reuse',
    };
    return channels[value] || value;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    // Handle both YYYY-MM-DD and other formats
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  const getGenderLabel = (value) => {
    return value === 'male' ? 'Male' : value === 'female' ? 'Female' : value;
  };

  // Calculate cost breakdown
  const getCostBreakdown = () => {
    const breakdown = [];
    let subtotal = 0;

    if (bookingData?.immigration) {
      // 1.1 Use of pick-up vehicle
      if (bookingData.immigration.pickup_vehicle_using && bookingData.immigration.pickup_vehicle_using !== 'no') {
        const vehiclePrices = { '4_seat': 20, '7_seat': 25, 'limousine_7_seat': 50 };
        const price = vehiclePrices[bookingData.immigration.pickup_vehicle_using] || 0;
        if (price > 0) {
          breakdown.push({ no: '1.1', content: 'Use of pick-up vehicle', presence: 'Yes', amount: `$${price}` });
          subtotal += price;
        }
      } else {
        breakdown.push({ no: '1.1', content: 'Use of pick-up vehicle', presence: 'No', amount: '$0' });
      }

      // 1.2 Guaranteed immigration clearance within 15 minutes
      if (bookingData.immigration.complete_within_15min) {
        breakdown.push({ no: '1.2', content: 'Guaranteed immigration clearance within 15 minutes', presence: 'Yes', amount: '$15' });
        subtotal += 15;
      } else {
        breakdown.push({ no: '1.2', content: 'Guaranteed immigration clearance within 15 minutes', presence: 'No', amount: '$0' });
      }

      // 1.3 Pick-up at the plane's exit
      if (bookingData.immigration.pickup_at_airplain_exit) {
        breakdown.push({ no: '1.3', content: "Pick-up at the plane's exit", presence: 'Yes', amount: '$60' });
        subtotal += 60;
      } else {
        breakdown.push({ no: '1.3', content: "Pick-up at the plane's exit", presence: 'No', amount: '$0' });
      }

      // 1.4 Entry Fasttrack Package
      const packagePrices = { '35$': 35, '40$': 40, '50$': 50, '300$': 300 };
      const packagePrice = packagePrices[bookingData.immigration.immigration_package] || 0;
      breakdown.push({ no: '1.4', content: 'Entry Fasttrack Package', presence: 'Yes', amount: `$${packagePrice}` });
      subtotal += packagePrice;
    }

    // 2 Full support for departures with Fasttrack
    if (bookingData?.emigration) {
      const emigrationPrices = { '50$': 50, '300$': 300 };
      const emigrationPrice = emigrationPrices[bookingData.emigration.emigration_package] || 0;
      breakdown.push({ no: '2', content: 'Full support for departures with Fasttrack', presence: 'Yes', amount: `$${emigrationPrice}` });
      subtotal += emigrationPrice;
    }

    return { breakdown, subtotal };
  };

  const handleBack = () => {
    navigate('/booking/step2');
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      // Prepare data for API
      const submitData = {
        // Passport data
        passport: {
          first_name: bookingData.passport.first_name,
          last_name: bookingData.passport.last_name,
          birthday: bookingData.passport.birthday,
          expire_date: bookingData.passport.expire_date,
          gender: bookingData.passport.gender,
          phone_num: bookingData.passport.phone_num,
          email: bookingData.passport.email,
          email_cc: bookingData.passport.email_cc || null,
          passport_num: bookingData.passport.passport_num,
          company_name: bookingData.passport.company_name || null,
          referer_name: bookingData.passport.referer_name || null,
        },
        // Booking data
        type: bookingData.type,
        contact: bookingData.contact,
        survey_channel: bookingData.survey_channel || null,
        first_name: bookingData.first_name,
        last_name: bookingData.last_name,
        phone_num: bookingData.phone_num,
        email: bookingData.email,
        email_cc: bookingData.email_cc || null,
        company_name: bookingData.company_name || null,
        referer_name: bookingData.referer_name || null,
        service_price: bookingData.sub_price || 0,
        sub_price: bookingData.sub_price || 0,
        vat_price: bookingData.vat_price || 0,
        total_price: bookingData.total_price || 0,
        coupon_id: bookingData.coupon_id || null,
        // Immigration data
        immigration: bookingData.immigration ? {
          immigration_package: bookingData.immigration.immigration_package,
          flight_reservation_num: bookingData.immigration.flight_reservation_num,
          flight_num: bookingData.immigration.flight_num,
          airport: bookingData.immigration.airport,
          arrival_date: bookingData.immigration.arrival_date,
          pickup_at_airplain_exit: bookingData.immigration.pickup_at_airplain_exit,
          complete_within_15min: bookingData.immigration.complete_within_15min,
          pickup_vehicle_using: bookingData.immigration.pickup_vehicle_using,
          phone_num_of_picker: bookingData.immigration.phone_num_of_picker || null,
          requirement: bookingData.immigration.requirement || null,
        } : null,
        // Emigration data
        emigration: bookingData.emigration ? {
          emigration_package: bookingData.emigration.emigration_package,
          flight_reservation_num: bookingData.emigration.flight_reservation_num,
          flight_num: bookingData.emigration.flight_num,
          airline_membership_num: bookingData.emigration.airline_membership_num || null,
          airport: bookingData.emigration.airport,
          seating_pref: bookingData.emigration.seating_pref || null,
          phone_num_of_picker: bookingData.emigration.phone_num_of_picker || null,
          requirement: bookingData.emigration.requirement || null,
          departure_date: bookingData.emigration.departure_date,
          meeting_time: bookingData.emigration.meeting_time || null,
        } : null,
      };

      const response = await createBooking(submitData);

      // Navigate to success page with booking ID
      navigate(`/booking/success/${response.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking. Please try again.');
      setIsSubmitting(false);
    }
  };

  const showPriceBar = bookingData?.immigration || bookingData?.emigration;
  const costData = getCostBreakdown();

  // Use calculated values from bookingData (set by PriceBar)
  const subtotal = bookingData?.sub_price || costData.subtotal;
  const couponDiscount = bookingData?.coupon?.appliedCoupon
    ? (bookingData.coupon.appliedCoupon.type === 'value_discount'
      ? bookingData.coupon.appliedCoupon.discount
      : (subtotal * bookingData.coupon.appliedCoupon.discount) / 100)
    : 0;
  const totalExcludingTax = subtotal - couponDiscount;
  const vat = bookingData?.vat_price || (totalExcludingTax * 0.08);
  const billedAmount = bookingData?.total_price || (totalExcludingTax + vat);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8 pb-32">
        <ProcessIndicator currentStep={3} />

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* User Information Table */}
        <div className="mb-6 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold text-black mb-4">User Information</h2>
          <table className="w-full border-collapse">
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4 font-medium text-black w-1/2">Last name, First name</td>
                <td className="py-3 px-4 text-black">{bookingData?.passport?.last_name}, {bookingData?.passport?.first_name}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4 font-medium text-black">Gender, Phone number with country code</td>
                <td className="py-3 px-4 text-black">{getGenderLabel(bookingData?.passport?.gender)}, {bookingData?.passport?.phone_num}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4 font-medium text-black">Email address to receive notification, Email address to be CC'd</td>
                <td className="py-3 px-4 text-black">{bookingData?.passport?.email}{bookingData?.passport?.email_cc ? `, ${bookingData.passport.email_cc}` : ''}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4 font-medium text-black">Passport No, Passport expiration date</td>
                <td className="py-3 px-4 text-black">{bookingData?.passport?.passport_num}, {formatDate(bookingData?.passport?.expire_date)}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4 font-medium text-black">Company Name, Name of the person you referred</td>
                <td className="py-3 px-4 text-black">{bookingData?.passport?.company_name || 'Other'}, {bookingData?.passport?.referer_name || ''}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-black">Line OA added, From which channel did you find out about this survey?</td>
                <td className="py-3 px-4 text-black">{getContactLabel(bookingData?.contact)}, {getSurveyChannelLabel(bookingData?.survey_channel)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Fast Track Entry Table */}
        {bookingData?.immigration && (
          <div className="mb-6 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-black mb-4">Fast Track Entry</h2>
            <table className="w-full border-collapse">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-medium text-black w-1/3">Fast Track Immigration</td>
                  <td className="py-3 px-4 text-black">{getImmigrationPackageLabel(bookingData.immigration.immigration_package)}</td>
                </tr>
                {bookingData.immigration.immigration_package !== '300$' && (
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 font-medium text-black">Option: Complete immigration procedures within 15 minutes (15$)</td>
                    <td className="py-3 px-4 text-black">{bookingData.immigration.complete_within_15min ? 'Use (15$)' : 'Not available'}</td>
                  </tr>
                )}
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-medium text-black">Flight reservation number or code</td>
                  <td className="py-3 px-4 text-black">{bookingData.immigration.flight_reservation_num}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-medium text-black">Flight No.</td>
                  <td className="py-3 px-4 text-black">{bookingData.immigration.flight_num}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-medium text-black">Eligible airports</td>
                  <td className="py-3 px-4 text-black">{getAirportLabel(bookingData.immigration.airport)}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-medium text-black">Arrival date</td>
                  <td className="py-3 px-4 text-black">{formatDate(bookingData.immigration.arrival_date)}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-medium text-black">Other options</td>
                  <td className="py-3 px-4 text-black">
                    <div className="space-y-1">
                      <div>Pick up at the airport (60$): {bookingData.immigration.pickup_at_airplain_exit ? 'Use (60$)' : 'Not available'}</div>
                      <div>Pick-up car usage: {getPickupVehicleLabel(bookingData.immigration.pickup_vehicle_using)}</div>
                      {bookingData.immigration.phone_num_of_picker && (
                        <div>Vietnamese speaking pick-up phone number (optional): {bookingData.immigration.phone_num_of_picker}</div>
                      )}
                      {bookingData.immigration.requirement && (
                        <div>If you have any other requests for pick-up or drop-off, please fill them in: {bookingData.immigration.requirement}</div>
                      )}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Departure Fast Track Table */}
        {bookingData?.emigration && (
          <div className="mb-6 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-black mb-4">Departure Fast Track</h2>
            <table className="w-full border-collapse">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-medium text-black w-1/3">Departure Fast Track</td>
                  <td className="py-3 px-4 text-black">{getEmigrationPackageLabel(bookingData.emigration.emigration_package)}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-medium text-black">Flight reservation number or code</td>
                  <td className="py-3 px-4 text-black">{bookingData.emigration.flight_reservation_num}</td>
                </tr>
                {bookingData.emigration.airline_membership_num && (
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 font-medium text-black">Airlines membership number or frequent flyer number (if available)</td>
                    <td className="py-3 px-4 text-black">{bookingData.emigration.airline_membership_num}</td>
                  </tr>
                )}
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-medium text-black">Flight No.</td>
                  <td className="py-3 px-4 text-black">{bookingData.emigration.flight_num}</td>
                </tr>
                {bookingData.emigration.seating_pref && (
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 font-medium text-black">Seat preference (we will do our best to accommodate your request, but we may not be able to accommodate your request)</td>
                    <td className="py-3 px-4 text-black">{getSeatingPreferenceLabel(bookingData.emigration.seating_pref)}</td>
                  </tr>
                )}
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-medium text-black">Eligible airports</td>
                  <td className="py-3 px-4 text-black">{getAirportLabel(bookingData.emigration.airport)}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-medium text-black">Departure date</td>
                  <td className="py-3 px-4 text-black">{formatDate(bookingData.emigration.departure_date)}</td>
                </tr>
                {bookingData.emigration.meeting_time && (
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 font-medium text-black">Desired meeting time at the departure airport (can be specified from 3 hours before departure)</td>
                    <td className="py-3 px-4 text-black">{bookingData.emigration.meeting_time}</td>
                  </tr>
                )}
                {bookingData.emigration.phone_num_of_picker && (
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 font-medium text-black">Phone number of Vietnamese speaking person seeing you off (optional)</td>
                    <td className="py-3 px-4 text-black">{bookingData.emigration.phone_num_of_picker}</td>
                  </tr>
                )}
                {bookingData.emigration.requirement && (
                  <tr>
                    <td className="py-3 px-4 font-medium text-black">If you have any other requests, please fill them out</td>
                    <td className="py-3 px-4 text-black">{bookingData.emigration.requirement}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Cost Table */}
        <div className="mb-6 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold text-black mb-4">Cost</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="py-3 px-4 text-left font-bold text-black">No.</th>
                <th className="py-3 px-4 text-left font-bold text-black">Content</th>
                <th className="py-3 px-4 text-left font-bold text-black">presence or absence</th>
                <th className="py-3 px-4 text-right font-bold text-black">Amount</th>
              </tr>
            </thead>
            <tbody>
              {bookingData?.immigration && (
                <>
                  <tr>
                    <td colSpan="4" className="py-2 px-4 font-bold text-black bg-gray-50">Fast Track Entry:</td>
                  </tr>
                  {costData.breakdown.filter(item => item.no.startsWith('1.')).map((item, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="py-3 px-4 text-black">{item.no}</td>
                      <td className="py-3 px-4 text-black">{item.content}</td>
                      <td className="py-3 px-4 text-black">{item.presence}</td>
                      <td className="py-3 px-4 text-right text-black">{item.amount}</td>
                    </tr>
                  ))}
                </>
              )}
              {bookingData?.emigration && costData.breakdown.filter(item => item.no === '2').map((item, index) => (
                <tr key={`emigration-${index}`} className="border-b border-gray-200">
                  <td className="py-3 px-4 text-black">{item.no}</td>
                  <td className="py-3 px-4 text-black">{item.content}</td>
                  <td className="py-3 px-4 text-black">{item.presence}</td>
                  <td className="py-3 px-4 text-right text-black">{item.amount}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-gray-300">
                <td colSpan="3" className="py-3 px-4 font-bold text-black text-right">subtotal</td>
                <td className="py-3 px-4 text-right font-bold text-black">${subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan="3" className="py-3 px-4 font-bold text-black text-right">coupon</td>
                <td className="py-3 px-4 text-right font-bold text-green-600">- ${couponDiscount.toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan="3" className="py-3 px-4 font-bold text-black text-right">Total (excluding tax)</td>
                <td className="py-3 px-4 text-right font-bold text-black">${totalExcludingTax.toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan="3" className="py-3 px-4 font-bold text-black text-right">Consumption tax VAT(8%)</td>
                <td className="py-3 px-4 text-right font-bold text-black">${vat.toFixed(2)}</td>
              </tr>
              <tr className="border-t-2 border-gray-300">
                <td colSpan="3" className="py-3 px-4 font-bold text-black text-right">Billed amount</td>
                <td className="py-3 px-4 text-right font-bold text-red-600 text-xl">${billedAmount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4 mt-8">
          <button
            type="button"
            onClick={handleBack}
            disabled={isSubmitting}
            className="px-6 py-3 bg-gray-500 text-white rounded-full hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-3 bg-[#01ae00] text-white rounded-full hover:bg-[#018800] focus:outline-none focus:ring-2 focus:ring-green-500 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Booking...' : 'Book'}
          </button>
        </div>

        {showPriceBar && (
          <PriceBar
            bookingData={bookingData}
            onCouponApply={(priceData) => setBookingData(prev => ({ ...prev, ...priceData }))}
          />
        )}
      </div>
    </div>
  );
};

export default BookingStep3;

