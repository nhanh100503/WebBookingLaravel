import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBooking } from '../services/bookingService';
import PriceBar from './PriceBar';
import ProcessIndicator from './ProcessIndicator';

const BookingStep3 = ({ bookingData, setBookingData }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

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
          airline_membership_num: bookingData.emigration.airline_membership_num || null,
          airport: bookingData.emigration.airport,
          seating_pref: bookingData.emigration.seating_pref || null,
          phone_num_of_picker: bookingData.emigration.phone_num_of_picker || null,
          requirement: bookingData.emigration.requirement || null,
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

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', paddingBottom: showPriceBar ? '200px' : '20px' }}>
      <h1>Check reservation information</h1>

      <ProcessIndicator currentStep={3} />

      {/* User Information Review */}
      <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '20px' }}>
        <h2>User Information</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
          <div>
            <strong>Name:</strong> {bookingData?.passport?.first_name} {bookingData?.passport?.last_name}
          </div>
          <div>
            <strong>Gender:</strong> {bookingData?.passport?.gender}
          </div>
          <div>
            <strong>Date of Birth:</strong> {bookingData?.passport?.birthday}
          </div>
          <div>
            <strong>Phone:</strong> {bookingData?.passport?.phone_num}
          </div>
          <div>
            <strong>Email:</strong> {bookingData?.passport?.email}
          </div>
          {bookingData?.passport?.email_cc && (
            <div>
              <strong>Email CC:</strong> {bookingData.passport.email_cc}
            </div>
          )}
          <div>
            <strong>Passport No:</strong> {bookingData?.passport?.passport_num}
          </div>
          <div>
            <strong>Passport Expiry:</strong> {bookingData?.passport?.expire_date}
          </div>
          {bookingData?.passport?.company_name && (
            <div>
              <strong>Company:</strong> {bookingData.passport.company_name}
            </div>
          )}
        </div>
      </div>

      {/* Immigration Review */}
      {bookingData?.immigration && (
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '20px' }}>
          <h2>Fast Track Entry</h2>
          <div style={{ marginTop: '15px' }}>
            <div><strong>Package:</strong> {bookingData.immigration.immigration_package}</div>
            <div><strong>Flight Reservation:</strong> {bookingData.immigration.flight_reservation_num}</div>
            <div><strong>Flight No:</strong> {bookingData.immigration.flight_num}</div>
            <div><strong>Airport:</strong> {bookingData.immigration.airport}</div>
            <div><strong>Arrival Date:</strong> {bookingData.immigration.arrival_date}</div>
            {bookingData.immigration.pickup_at_airplain_exit && (
              <div><strong>Pickup at Exit:</strong> Yes (60$)</div>
            )}
            {bookingData.immigration.complete_within_15min && (
              <div><strong>Complete within 15 min:</strong> Yes (15$)</div>
            )}
            {bookingData.immigration.pickup_vehicle_using !== 'no' && (
              <div><strong>Pickup Vehicle:</strong> {bookingData.immigration.pickup_vehicle_using}</div>
            )}
          </div>
        </div>
      )}

      {/* Emigration Review */}
      {bookingData?.emigration && (
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '20px' }}>
          <h2>Departure Fast Track</h2>
          <div style={{ marginTop: '15px' }}>
            <div><strong>Package:</strong> {bookingData.emigration.emigration_package}</div>
            <div><strong>Flight Reservation:</strong> {bookingData.emigration.flight_reservation_num}</div>
            <div><strong>Airport:</strong> {bookingData.emigration.airport}</div>
            {bookingData.emigration.seating_pref && (
              <div><strong>Seating Preference:</strong> {bookingData.emigration.seating_pref}</div>
            )}
          </div>
        </div>
      )}

      {error && (
        <div style={{ padding: '15px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginTop: '30px' }}>
        <button
          type="button"
          onClick={handleBack}
          disabled={isSubmitting}
          style={{
            padding: '12px 24px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            opacity: isSubmitting ? 0.6 : 1,
          }}
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          style={{
            padding: '12px 24px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            opacity: isSubmitting ? 0.6 : 1,
          }}
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
  );
};

export default BookingStep3;

