import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PriceBar from './PriceBar';
import ProcessIndicator from './ProcessIndicator';
import Error from './Error';
import FieldRequired from './FieldRequired';

const BookingStep1 = ({ bookingData, setBookingData }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Immigration
    useImmigration: bookingData?.immigration ? true : false,
    immigration_package: bookingData?.immigration?.immigration_package || '35$', // Default to first option
    flight_reservation_num: bookingData?.immigration?.flight_reservation_num || '',
    flight_num: bookingData?.immigration?.flight_num || '',
    airport: bookingData?.immigration?.airport,
    arrival_date: bookingData?.immigration?.arrival_date || '',
    pickup_at_airplain_exit: bookingData?.immigration?.pickup_at_airplain_exit || false,
    complete_within_15min: bookingData?.immigration?.complete_within_15min || false,
    pickup_vehicle_using: bookingData?.immigration?.pickup_vehicle_using || 'no',
    phone_num_of_picker: bookingData?.immigration?.phone_num_of_picker || '',
    requirement: bookingData?.immigration?.requirement || '',

    // Emigration
    useEmigration: bookingData?.emigration ? true : false,
    emigration_package: bookingData?.emigration?.emigration_package || '50$', // Default to first option
    emigration_flight_reservation_num: bookingData?.emigration?.flight_reservation_num || '',
    airline_membership_num: bookingData?.emigration?.airline_membership_num || '',
    emigration_airport: bookingData?.emigration?.airport,
    seating_pref: bookingData?.emigration?.seating_pref || '',
    emigration_phone_num_of_picker: bookingData?.emigration?.phone_num_of_picker || '',
    emigration_requirement: bookingData?.emigration?.requirement || '',
    departure_date: bookingData?.emigration?.departure_date || '',
    meeting_time: bookingData?.emigration?.meeting_time || '',
    emigration_flight_num: bookingData?.emigration?.flight_num || '',
    sameAsEntry: false, // Track if "Same as entry" checkbox is checked
  });

  const airports = [
    { value: 'SGN', label: 'SGN - Tan Son Nhat Airport (Tan Son Nhat, Ho Chi Minh City)' },
    { value: 'DAD', label: 'DAD - Da Nang Airport' },
    { value: 'HAN', label: 'HAN - Noi Bai (Ha Noi)' },
  ];

  const immigrationPackages = [
    { value: '35$', label: 'VIP_IN1_Use priority lane only at immigration (Fee: 35$)' },
    { value: '40$', label: 'VIP_IN2_Priority lane at immigration + escort to pick-up point outside the airport (Fee: $40)' },
    { value: '50$', label: 'VIP_IN3_Priority lane access at immigration + baggage claim assistance + escort to pick-up location outside the airport (Fee: $50)' },
    { value: '300$', label: 'VIP_IN6_VVIP Priority Lane Use Non-stop Package (Fee: $300)' },
  ];

  const emigrationPackages = [
    { value: '50$', label: 'Use Fasttrack full support for departure (50$)' },
    { value: '300$', label: 'Use VVIP Departure Fasttrack (300$)' },
  ];

  const pickupVehicles = [
    { value: 'no', label: 'Do not use' },
    { value: '4_seat', label: 'Pick-up car 4 seats (20$)' },
    { value: '7_seat', label: 'Pick-up car 7 seats (25$)' },
    { value: 'limousine_7_seat', label: 'Pick-up car 7 seats Limousine (50$)' },
  ];

  const seatingPreferences = [
    { value: 'dont_want', label: "I don't want" },
    { value: 'front_window', label: 'Front window seat' },
    { value: 'front_aisle', label: 'Front aisle' },
    { value: 'front_middle_window', label: 'Front middle seat or window seat' },
    { value: 'middle_window', label: 'Middle row window seat' },
    { value: 'middle_aisle', label: 'Middle row aisle' },
    { value: 'middle_middle_window', label: 'Middle row: middle seat or window seat' },
    { value: 'rear_aisle', label: 'Rear aisle side' },
    { value: 'rear_window', label: 'Rear window seat' },
    { value: 'rear_middle_window', label: 'Rear middle seat or window seat' },
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Auto-select first package when checkbox is checked
    if (type === 'checkbox' && name === 'useImmigration' && checked && !formData.immigration_package) {
      setFormData(prev => ({
        ...prev,
        [name]: checked,
        immigration_package: '35$', // Auto-select first option
      }));
      return;
    }

    if (type === 'checkbox' && name === 'useEmigration' && checked && !formData.emigration_package) {
      setFormData(prev => ({
        ...prev,
        [name]: checked,
        emigration_package: '50$', // Auto-select first option
      }));
      return;
    }

    // If unchecking, reset package selection
    if (type === 'checkbox' && name === 'useImmigration' && !checked) {
      setFormData(prev => ({
        ...prev,
        [name]: checked,
        immigration_package: '35$', // Reset to first option
      }));
      return;
    }

    if (type === 'checkbox' && name === 'useEmigration' && !checked) {
      setFormData(prev => ({
        ...prev,
        [name]: checked,
        emigration_package: '50$', // Reset to first option
      }));
      return;
    }

    // If selecting 300$ package, disable complete_within_15min
    if (name === 'immigration_package' && value === '300$') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        complete_within_15min: false, // Disable when 300$ is selected
      }));
      return;
    }

    setFormData(prev => {
      const updated = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      };

      // If "Same as entry" is checked and immigration flight_reservation_num changes, update emigration
      if (name === 'flight_reservation_num' && prev.sameAsEntry && prev.useImmigration) {
        updated.emigration_flight_reservation_num = updated.flight_reservation_num;
      }

      // If user manually edits emigration flight reservation, uncheck "Same as entry"
      if (name === 'emigration_flight_reservation_num' && prev.sameAsEntry) {
        updated.sameAsEntry = false;
      }

      return updated;
    });
  };

  // Handle "Same as entry" checkbox for emigration flight reservation
  const handleSameAsEntry = (checked) => {
    if (checked && formData.useImmigration && formData.flight_reservation_num) {
      // When checked: copy immigration flight reservation to emigration
      setFormData(prev => ({
        ...prev,
        emigration_flight_reservation_num: prev.flight_reservation_num,
        sameAsEntry: true,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        emigration_flight_reservation_num: '',
        sameAsEntry: false,
      }));
    }
  };

  const handlePriceUpdate = (priceData) => {
    setBookingData(prev => ({
      ...prev,
      ...priceData,
    }));
  };

  const handleNext = () => {
    if (!validateForm()) {
      setShowError(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setShowError(false);
    const updatedData = {
      ...bookingData,
      immigration: formData.useImmigration ? {
        immigration_package: formData.immigration_package,
        flight_reservation_num: formData.flight_reservation_num,
        flight_num: formData.flight_num,
        airport: formData.airport,
        arrival_date: formData.arrival_date,
        pickup_at_airplain_exit: formData.pickup_at_airplain_exit,
        complete_within_15min: formData.complete_within_15min,
        pickup_vehicle_using: formData.pickup_vehicle_using,
        phone_num_of_picker: formData.phone_num_of_picker,
        requirement: formData.requirement,
      } : null,
      emigration: formData.useEmigration ? {
        emigration_package: formData.emigration_package,
        flight_reservation_num: formData.emigration_flight_reservation_num,
        flight_num: formData.emigration_flight_num,
        airline_membership_num: formData.airline_membership_num,
        airport: formData.emigration_airport,
        seating_pref: formData.seating_pref,
        phone_num_of_picker: formData.emigration_phone_num_of_picker,
        requirement: formData.emigration_requirement,
        departure_date: formData.departure_date,
        meeting_time: formData.meeting_time,
      } : null,
      type: formData.useImmigration && formData.useEmigration ? 'both' :
        formData.useImmigration ? 'immigration' : 'emigration',
    };

    setBookingData(updatedData);
    navigate('/booking/step2');
  };

  const [errors, setErrors] = useState({});
  const [showError, setShowError] = useState(false);

  const showPriceBar = formData.useImmigration || formData.useEmigration;

  // Helper function to check if input is empty and should show red label
  const isInputEmpty = (value) => !value || value.trim() === '';

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    if (formData.useImmigration) {
      if (!formData.immigration_package) {
        newErrors.immigration_package = 'Please select an immigration package';
      }
      if (!formData.flight_reservation_num || !formData.flight_reservation_num.trim()) {
        newErrors.flight_reservation_num = 'This field is required';
      }
      if (!formData.flight_num || !formData.flight_num.trim()) {
        newErrors.flight_num = 'This field is required';
      }
      if (!formData.arrival_date) {
        newErrors.arrival_date = 'This field is required';
      }
      if (formData.immigration_package !== '300$' && formData.complete_within_15min === undefined) {
        newErrors.complete_within_15min = 'This field is required';
      }
      if (!formData.airport) {
        newErrors.airport = 'This field is required';
      }
      if (!formData.pickup_vehicle_using) {
        newErrors.pickup_vehicle_using = 'This field is required';
      }
    }

    if (formData.useEmigration) {
      if (!formData.emigration_package) {
        newErrors.emigration_package = 'Please select an emigration package';
      }
      if (!formData.emigration_flight_reservation_num || !formData.emigration_flight_reservation_num.trim()) {
        newErrors.emigration_flight_reservation_num = 'This field is required';
      }
      if (!formData.emigration_flight_num || !formData.emigration_flight_num.trim()) {
        newErrors.emigration_flight_num = 'This field is required';
      }
      if (!formData.departure_date) {
        newErrors.departure_date = 'This field is required';
      }
      if (!formData.emigration_airport) {
        newErrors.emigration_airport = 'This field is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-full mx-auto px-4 py-8 pb-32">
        <ProcessIndicator currentStep={1} />
        {/* Error Message */}
        <Error message={showError ? "There Is A Problem With Your Answer. Please Check The Fields Below." : null} />
        {/* Information Box */}
        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700">
            <span>⚡ No account registration required, easy booking |</span>
            <span>🏃 Reservations can be made up to 4 hours before departure or arrival |</span>
            <span>🇯🇵 24-hour support in Japanese via LINE |</span>
            <span>😊 Free for ages 0-2 - Half price for ages 2-6</span>
          </div>
          <div className="mt-2 text-sm text-gray-700">
            <span>✈️ [Campaign in progress] For every 10 visits, receive a free visit of the same service package</span>
          </div>
          <div className="mt-2 text-sm">
            <span className="text-gray-700">📱 Easy booking via LINE chat here&gt;&gt;</span>
          </div>
        </div>
        {/* Your desired service */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-black mb-4 text-start">Your desired service</h2>
          {/* Immigration Checkbox */}
          <div className="mb-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="useImmigration"
                checked={formData.useImmigration}
                onChange={handleInputChange}
                className="w-5 h-5 mr-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-black">Use of the immigration fast track (from $35)</span>
            </label>
          </div>
          {/* Immigration Form - Show when checked */}
          {formData.useImmigration && (
            //make the div bigger 
            <div className=" mb-6 p-5 bg-gray-50 border border-gray-200 rounded-lg w-full">
              {/* Immigration Package and Complete within 15 minutes group using cols-2*/}
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-6">
                  <FieldRequired label="Entry Fast Track Package" required={true} error={errors.immigration_package} isEmpty={!formData.immigration_package}>
                    <div className="space-y-2 w-[98%]">
                      {immigrationPackages.map(pkg => (
                        <label key={pkg.value} className="flex items-start cursor-pointer text-start">
                          <input
                            type="radio"

                            name="immigration_package"
                            value={pkg.value}
                            checked={formData.immigration_package === pkg.value}
                            onChange={handleInputChange}
                            required={formData.useImmigration}
                            className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                          />
                          <label className="ml-3 text-sm text-black">{pkg.label}</label>
                        </label>
                      ))}
                    </div>
                  </FieldRequired>
                </div>
                {/* Only show "Complete within 15 min" option for first 3 packages (not 300$) */}
                {formData.immigration_package !== '300$' && (
                  <div className="mt-6">
                    <FieldRequired
                      label="Option: Complete immigration procedures in under 15 minutes"
                      required={true}
                      error={errors.complete_within_15min}
                      isEmpty={formData.complete_within_15min === undefined}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="complete_within_15min"
                            value="false"
                            checked={!formData.complete_within_15min}
                            onChange={() => {
                              if (errors.complete_within_15min) {
                                setErrors(prev => {
                                  const newErrors = { ...prev };
                                  delete newErrors.complete_within_15min;
                                  return newErrors;
                                });
                              }
                              setFormData(prev => ({ ...prev, complete_within_15min: false }));
                            }}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <label className="ml-3 text-sm text-black">Do not use</label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="complete_within_15min"
                            value="true"
                            checked={formData.complete_within_15min}
                            onChange={() => {
                              if (errors.complete_within_15min) {
                                setErrors(prev => {
                                  const newErrors = { ...prev };
                                  delete newErrors.complete_within_15min;
                                  return newErrors;
                                });
                              }
                              setFormData(prev => ({ ...prev, complete_within_15min: true }));
                            }}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <label className="ml-3 text-sm text-black">Use (15$)</label>
                        </div>
                        <p className="text-xs text-[#1362cb] mt-2 ml-7">
                          *Using the "Diplomats' Lane" will allow you to complete immigration procedures as quickly as possible. If it takes more than 15 minutes, you will receive a $15 refund. This is recommended for those without checked baggage.
                        </p>
                      </div>
                    </FieldRequired>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <FieldRequired
                    label="Flight reservation number or code"
                    required={true}
                    error={errors.flight_reservation_num}
                    isEmpty={isInputEmpty(formData.flight_reservation_num)}
                  >
                    <input
                      type="text"
                      name="flight_reservation_num"
                      value={formData.flight_reservation_num}
                      onChange={handleInputChange}
                      required={formData.useImmigration}
                      placeholder="Reservation number or code"
                      className={`w-full px-4 py-2 bg-[#a3e7a3] border
                        border-[#f2f2f2]
                        
                         rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.flight_reservation_num ? 'border-[#c02b0b]' : 'border-[#b98d5d]'}`}
                    />
                  </FieldRequired>
                </div>

                <div>
                  <FieldRequired
                    label="Flight No."
                    required={true}
                    error={errors.flight_num}
                    isEmpty={isInputEmpty(formData.flight_num)}
                  >
                    <input
                      type="text"
                      name="flight_num"
                      value={formData.flight_num}
                      onChange={handleInputChange}
                      required={formData.useImmigration}
                      placeholder="VN000"
                      className={`w-full px-4 py-2 bg-[#a3e7a3] border

                        border-[#f2f2f2] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.flight_num ? 'border-[#c02b0b]' : 'border-[#b98d5d]'}`}
                    />
                  </FieldRequired>
                </div>

                <div>
                  <FieldRequired label="Eligible airports" required={true} error={errors.airport} isEmpty={!formData.airport}>
                    <div className="space-y-2">
                      {airports.map(airport => (
                        <div key={airport.value} className="flex items-center">
                          <input
                            type="radio"
                            name="airport"
                            value={airport.value}
                            checked={formData.airport === airport.value}
                            onChange={handleInputChange}
                            required={formData.useImmigration}
                            className="w-4 h-4 
                            text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <label className="ml-3 text-sm text-black">{airport.label}</label>
                        </div>
                      ))}
                    </div>
                  </FieldRequired>
                </div>

                <div>
                  <FieldRequired
                    label="Arrival date"
                    required={true}
                    error={errors.arrival_date}
                    isEmpty={isInputEmpty(formData.arrival_date)}
                  >
                    <input
                      type="date"
                      name="arrival_date"
                      value={formData.arrival_date}
                      onChange={handleInputChange}
                      required={formData.useImmigration}
                      placeholder="year/month/day"
                      className={`w-full px-4 py-2 bg-[#a3e7a3] border placeholder-gray-400
                        border-[#f2f2f2]
                        rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.arrival_date ? 'border-[#c02b0b]' : 'border-[#b98d5d]'}`}
                    />
                  </FieldRequired>
                </div>
              </div>



              <div className="mt-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="pickup_at_airplain_exit"
                    checked={formData.pickup_at_airplain_exit}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-3 text-sm text-black">
                    Choose to be picked up at the plane exit (or bus stop): (required) - Use (60$)
                  </span>
                </label>
              </div>

              <div className="mt-6">
                <FieldRequired label="Use of pick-up vehicle" required={true} error={errors.pickup_vehicle_using} isEmpty={!formData.pickup_vehicle_using}>
                  <div className="space-y-2">
                    {pickupVehicles.map(vehicle => (
                      <div key={vehicle.value} className="flex items-center">
                        <input
                          type="radio"
                          name="pickup_vehicle_using"
                          value={vehicle.value}
                          checked={formData.pickup_vehicle_using === vehicle.value}
                          onChange={handleInputChange}
                          required={formData.useImmigration}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <label className="ml-3 text-sm text-black">{vehicle.label}</label>
                      </div>
                    ))}
                  </div>
                </FieldRequired>
              </div>

              <div className="grid grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Phone number of Vietnamese speaking person to pick you up (optional):
                  </label>
                  <input
                    type="text"
                    name="phone_num_of_picker"
                    value={formData.phone_num_of_picker}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-[#a3e7a3] border 
                    border-[#f2f2f2] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Please specify if you have any other requests:
                  </label>
                  <textarea
                    name="requirement"
                    value={formData.requirement}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 bg-[#a3e7a3] border border-[#f2f2f2] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="border-t border-gray-300 my-4"></div>

          {/* Emigration Checkbox */}
          <div className="mb-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="useEmigration"
                checked={formData.useEmigration}
                onChange={handleInputChange}
                className="w-5 h-5 mr-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-black">Use of the Departure Fast Track (from $50)</span>
            </label>
          </div>

          {/* Emigration Form - Show when checked */}
          {formData.useEmigration && (
            <div className="mb-6 p-6 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="mb-6">
                <FieldRequired label="Departure Fasttrack" required={true} error={errors.emigration_package} isEmpty={!formData.emigration_package}>
                  <div className="space-y-2">
                    {emigrationPackages.map(pkg => (
                      <div key={pkg.value} className="flex items-start">
                        <input
                          type="radio"
                          name="emigration_package"
                          value={pkg.value}
                          checked={formData.emigration_package === pkg.value}
                          onChange={handleInputChange}
                          required={formData.useEmigration}
                          className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <label className="ml-3 text-sm text-black">{pkg.label}</label>
                      </div>
                    ))}
                  </div>
                </FieldRequired>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <FieldRequired
                    label="Flight reservation number or code"
                    required={true}
                    error={errors.emigration_flight_reservation_num}
                    isEmpty={isInputEmpty(formData.emigration_flight_reservation_num)}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        name="emigration_flight_reservation_num"
                        value={formData.emigration_flight_reservation_num}
                        onChange={handleInputChange}
                        required={formData.useEmigration}
                        placeholder="Reservation number or code"
                        className={`flex-1 px-4 py-2 bg-[#a3e7a3] border border-[#f2f2f2] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.emigration_flight_reservation_num ? 'border-[#c02b0b]' : 'border-[#b98d5d]'}`}
                      />
                      <label className="flex items-center text-sm text-black whitespace-nowrap cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.sameAsEntry}
                          onChange={(e) => handleSameAsEntry(e.target.checked)}
                          disabled={!formData.useImmigration || !formData.flight_reservation_num}
                          className="w-4 h-4 mr-1 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        Same as entry
                      </label>
                    </div>
                  </FieldRequired>
                </div>

                <div>
                  <FieldRequired
                    label="Flight No."
                    required={true}
                    error={errors.emigration_flight_num}
                    isEmpty={isInputEmpty(formData.emigration_flight_num)}
                  >
                    <input
                      type="text"
                      name="emigration_flight_num"
                      value={formData.emigration_flight_num}
                      onChange={handleInputChange}
                      required={formData.useEmigration}
                      placeholder="VN999"
                      className={`w-full px-4 py-2 bg-[#a3e7a3] border border-[#f2f2f2] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.emigration_flight_num ? 'border-[#c02b0b]' : 'border-[#b98d5d]'}`}
                    />
                  </FieldRequired>
                </div>

                <div>
                  <FieldRequired label="Eligible airports" required={true} error={errors.emigration_airport} isEmpty={!formData.emigration_airport}>
                    <div className="space-y-2">
                      {airports.map(airport => (
                        <div key={airport.value} className="flex items-center">
                          <input
                            type="radio"
                            name="emigration_airport"
                            value={airport.value}
                            checked={formData.emigration_airport === airport.value}
                            onChange={handleInputChange}
                            required={formData.useEmigration}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <label className="ml-3 text-sm text-black">{airport.label}</label>
                        </div>
                      ))}
                    </div>
                  </FieldRequired>
                </div>

                <div>
                  <FieldRequired
                    label="Departure date"
                    required={true}
                    error={errors.departure_date}
                    isEmpty={isInputEmpty(formData.departure_date)}
                  >
                    <input
                      type="date"
                      name="departure_date"
                      value={formData.departure_date}
                      onChange={handleInputChange}
                      required={formData.useEmigration}
                      placeholder="year/month/day"
                      className={`w-full px-4 py-2 bg-[#a3e7a3] border placeholder-gray-400 border-[#f2f2f2] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.departure_date ? 'border-[#c02b0b]' : 'border-[#b98d5d]'}`}
                    />
                  </FieldRequired>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Airlines membership number or frequent flyer number (if available):
                  </label>
                  <input
                    type="text"
                    name="airline_membership_num"
                    value={formData.airline_membership_num}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-[#a3e7a3] border border-[#f2f2f2] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Desired meeting time at the departure airport (can be specified from 3 hours before departure):
                  </label>
                  <div className="flex items-center gap-2">
                    {/* Hours input box */}
                    <input
                      type="number"
                      name="meeting_time_hours"
                      min="0"
                      max="23"
                      value={formData.meeting_time ? parseInt(formData.meeting_time.split(':')[0] || '0') : ''}
                      onChange={(e) => {
                        const hours = e.target.value;
                        const minutes = formData.meeting_time ? formData.meeting_time.split(':')[1] : '00';
                        const timeValue = hours !== '' ? `${hours.padStart(2, '0')}:${minutes}` : '';
                        setFormData(prev => ({
                          ...prev,
                          meeting_time: timeValue,
                        }));
                      }}
                      className="w-16 px-3 py-2 bg-[#a3e7a3] border border-gray-300 rounded-md text-center text-black font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {/* Colon separator */}
                    <span className="text-black text-lg font-medium">:</span>
                    {/* Minutes input box */}
                    <input
                      type="number"
                      name="meeting_time_minutes"
                      min="0"
                      max="59"
                      value={formData.meeting_time ? parseInt(formData.meeting_time.split(':')[1] || '0') : ''}
                      onChange={(e) => {
                        const minutes = e.target.value;
                        const hours = formData.meeting_time ? formData.meeting_time.split(':')[0] : '00';
                        const timeValue = minutes !== '' ? `${hours}:${minutes.padStart(2, '0')}` : '';
                        setFormData(prev => ({
                          ...prev,
                          meeting_time: timeValue,
                        }));
                      }}
                      className="w-16 px-3 py-2 bg-[#a3e7a3] border border-gray-300 rounded-md text-center text-black font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-black mb-3">
                  Seating preference (we will do our best to accommodate your request, but we may not be able to accommodate your request):
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {seatingPreferences.map(seat => (
                    <div key={seat.value} className="flex items-center">
                      <input
                        type="radio"
                        name="seating_pref"
                        value={seat.value}
                        checked={formData.seating_pref === seat.value}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <label className="ml-3 text-sm text-black">{seat.label}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Phone number of a Vietnamese-speaking person seeing you off (optional):
                  </label>
                  <input
                    type="text"
                    name="emigration_phone_num_of_picker"
                    value={formData.emigration_phone_num_of_picker}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-[#a3e7a3] border border-[#b98d5d] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Please specify if you have any other requests:
                  </label>
                  <textarea
                    name="emigration_requirement"
                    value={formData.emigration_requirement}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 bg-[#a3e7a3] border border-[#b98d5d] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end mt-8">
          <button
            onClick={handleNext}
            disabled={(!formData.useImmigration && !formData.useEmigration) ||
              (formData.useImmigration && !formData.immigration_package) ||
              (formData.useEmigration && !formData.emigration_package)}
            className="px-6 py-3 bg-[#01ae00] text-white rounded-full font-medium hover:bg-[#018800] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Enter User Information
          </button>
        </div>

        {showPriceBar && (
          <PriceBar
            bookingData={{
              ...bookingData, // Include all bookingData including coupon
              immigration: formData.useImmigration ? {
                immigration_package: formData.immigration_package || '35$', // Default to first option if not selected
                pickup_at_airplain_exit: formData.pickup_at_airplain_exit,
                complete_within_15min: (formData.immigration_package || '35$') !== '300$' ? formData.complete_within_15min : false, // Only apply if not 300$ package
                pickup_vehicle_using: formData.pickup_vehicle_using,
              } : null,
              emigration: formData.useEmigration ? {
                emigration_package: formData.emigration_package || '50$', // Default to first option if not selected
              } : null,
            }}
            onCouponApply={handlePriceUpdate}
          />
        )}
      </div>
    </div>
  );
};

export default BookingStep1;
