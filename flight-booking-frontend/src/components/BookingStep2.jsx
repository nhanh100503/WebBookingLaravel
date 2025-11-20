import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PriceBar from './PriceBar';
import ProcessIndicator from './ProcessIndicator';
import Error from './Error';
import FieldRequired from './FieldRequired';

const BookingStep2 = ({ bookingData, setBookingData }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: bookingData?.passport?.first_name || '',
    last_name: bookingData?.passport?.last_name || '',
    birthday: bookingData?.passport?.birthday || '',
    expire_date: bookingData?.passport?.expire_date || '',
    gender: bookingData?.passport?.gender || '',
    phone_num: bookingData?.passport?.phone_num || '',
    email: bookingData?.passport?.email || '',
    email_cc: bookingData?.passport?.email_cc || '',
    passport_num: bookingData?.passport?.passport_num || '',
    company_name: bookingData?.passport?.company_name || '',
    referer_name: bookingData?.passport?.referer_name || '',
    survey_channel: bookingData?.survey_channel || '',
    contact: bookingData?.contact || '',
    add_ons: bookingData?.add_ons || [],
  });

  const [errors, setErrors] = useState({});
  const [showError, setShowError] = useState(false);

  // Survey channel options matching the image
  const surveyChannels = [
    { value: 'introduction_by_acquaintance', label: 'Introduction by an acquaintance' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'search_sites', label: 'Search sites (Google, Yahoo, etc.)' },
    { value: 'service_introduction_email', label: 'Service introduction email' },
    { value: 'advertisement', label: 'advertisement' },
    { value: 'reuse', label: 'reuse' },
  ];

  // Contact options matching the image
  const contactOptions = [
    { value: 'line_joined_sent_message', label: 'Joined and sent a message' },
    { value: 'email_only', label: 'I would prefer email only (response may be delayed at the airport)' },
    { value: 'zalo', label: 'Please contact me at ZALO at the number above.' },
    { value: 'add_line_later', label: 'Add LINE later' },
    { value: 'phone_only', label: 'Phone only (problems with charges and roaming may occur)' },
    { value: 'no_communication', label: 'I have no means of communication at the airport and would like to ask for advice.' },
  ];

  // Add-ons options matching AddOnEnum
  const addOnsOptions = [
    { value: 0, label: 'Airport Lounge' },
    { value: 1, label: 'Hotels for Japanese and foreign tourists' },
    { value: 2, label: 'Shopping spots' },
    { value: 3, label: 'Rental Car' },
    { value: 4, label: 'Airline tickets (purchase, change, etc.)' },
    { value: 5, label: 'Restaurants for Japanese and foreign tourists' },
    { value: 6, label: 'Massage, health care, beauty care' },
    { value: 7, label: 'Interpretation and tourist information' },
    { value: 8, label: 'golf' },
    { value: 9, label: 'Finding Vietnamese suppliers and connecting with Vietnamese companies' },
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

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddOnChange = (addOnValue, checked) => {
    setFormData(prev => {
      const currentAddOns = prev.add_ons || [];
      if (checked) {
        return {
          ...prev,
          add_ons: [...currentAddOns, addOnValue],
        };
      } else {
        return {
          ...prev,
          add_ons: currentAddOns.filter(val => val !== addOnValue),
        };
      }
    });
  };

  const isInputEmpty = (value) => !value || value.trim() === '';

  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name || !formData.first_name.trim()) {
      newErrors.first_name = 'This field is required';
    }
    if (!formData.last_name || !formData.last_name.trim()) {
      newErrors.last_name = 'This field is required';
    }
    if (!formData.gender) {
      newErrors.gender = 'This field is required';
    }
    if (!formData.birthday) {
      newErrors.birthday = 'This field is required';
    }
    if (!formData.phone_num || !formData.phone_num.trim()) {
      newErrors.phone_num = 'This field is required';
    }
    if (!formData.email || !formData.email.trim()) {
      newErrors.email = 'This field is required';
    }
    if (!formData.passport_num || !formData.passport_num.trim()) {
      newErrors.passport_num = 'This field is required';
    }
    if (!formData.expire_date) {
      newErrors.expire_date = 'This field is required';
    }
    if (!formData.survey_channel) {
      newErrors.survey_channel = 'This field is required';
    }
    if (!formData.contact) {
      newErrors.contact = 'This field is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBack = () => {
    navigate('/booking/step1');
  };

  const handleNext = () => {
    // Validate form
    if (!validateForm()) {
      setShowError(true);
      // Scroll to top to show error
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setShowError(false);
    const updatedData = {
      ...bookingData,
      passport: {
        first_name: formData.first_name,
        last_name: formData.last_name,
        birthday: formData.birthday,
        expire_date: formData.expire_date,
        gender: formData.gender,
        phone_num: formData.phone_num,
        email: formData.email,
        email_cc: formData.email_cc,
        passport_num: formData.passport_num,
        company_name: formData.company_name,
        referer_name: formData.referer_name,
      },
      contact: formData.contact,
      survey_channel: formData.survey_channel,
      add_ons: formData.add_ons,
      // Booking fields
      first_name: formData.first_name,
      last_name: formData.last_name,
      phone_num: formData.phone_num,
      email: formData.email,
      email_cc: formData.email_cc,
      company_name: formData.company_name,
      referer_name: formData.referer_name,
    };

    setBookingData(updatedData);
    navigate('/booking/step3');
  };

  const showPriceBar = bookingData?.immigration || bookingData?.emigration;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8 pb-32">

        {/* Error Message */}
        <Error message={showError ? "There Is A Problem With Your Answer. Please Check The Fields Below." : null} />

        <form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
          {/* All sections within one border */}
          <div className="mb-6 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            {/* Process Indicator inside the border */}
            <div className="mb-6">
              <ProcessIndicator currentStep={2} />
            </div>

            {/* Personal Information Section */}
            <div className="mb-6">

              <div className="grid grid-cols-2 gap-6">


                {/* Last Name */}
                <div>
                  <FieldRequired
                    label="Last name (please fill in the same as in your passport)"
                    required={true}
                    error={errors.last_name}
                    isEmpty={isInputEmpty(formData.last_name)}
                  >
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-[#a3e7a3] border border-[#f2f2f2] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </FieldRequired>
                </div>

                {/* First Name */}
                <div>
                  <FieldRequired
                    label="First name (please write it as it appears on your passport)"
                    required={true}
                    error={errors.first_name}
                    isEmpty={isInputEmpty(formData.first_name)}
                  >
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-[#a3e7a3] border border-[#f2f2f2] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </FieldRequired>
                </div>

                {/* Sex and Date of Birth - grouped in 2 columns */}
                <div className="col-span-2 grid grid-cols-2 gap-6 w-[49%]">
                  {/* Sex */}
                  <div>
                    <FieldRequired label="Sex" required={true} error={errors.gender} isEmpty={!formData.gender}>
                      <div className="mt-2 flex gap-6">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="gender"
                            value="male"
                            checked={formData.gender === 'male'}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <label className="ml-3 text-sm text-black">Male</label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="gender"
                            value="female"
                            checked={formData.gender === 'female'}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <label className="ml-3 text-sm text-black">Female</label>
                        </div>
                      </div>
                    </FieldRequired>
                  </div>
                  {/* Date of Birth */}
                  <div>
                    <FieldRequired
                      label="Date of birth"
                      required={true}
                      error={errors.birthday}
                      isEmpty={!formData.birthday}
                    >
                      <input
                        type="date"
                        name="birthday"
                        value={formData.birthday}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-[#a3e7a3] border border-[#f2f2f2] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </FieldRequired>
                  </div>
                </div>

                {/* Phone Number */}
                <div className="text-start">
                  <FieldRequired
                    label="Phone number with country code (e.g. +81-050-6862-0772)"
                    required={true}
                    error={errors.phone_num}
                    isEmpty={isInputEmpty(formData.phone_num)}
                  >
                    <input
                      type="tel"
                      name="phone_num"
                      value={formData.phone_num}
                      onChange={handleInputChange}
                      placeholder="+84913360358"
                      className="w-full px-4 py-2 bg-[#a3e7a3] border border-[#f2f2f2] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </FieldRequired>
                </div>

                {/* Email */}
                <div className="text-start">
                  <FieldRequired
                    label="Email address to receive notifications"
                    required={true}
                    error={errors.email}
                    isEmpty={isInputEmpty(formData.email)}
                  >
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-[#a3e7a3] border border-[#f2f2f2] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </FieldRequired>
                </div>

                {/* Email CC */}
                <div>
                  <FieldRequired
                    label="Email address you would like to CC"
                    required={false}
                  >
                    <input
                      type="email"
                      name="email_cc"
                      value={formData.email_cc}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-[#a3e7a3] border border-[#f2f2f2] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </FieldRequired>
                </div>

                {/* Passport Number */}
                <div className="text-start">
                  <FieldRequired
                    label="Passport No."
                    required={true}
                    error={errors.passport_num}
                    isEmpty={isInputEmpty(formData.passport_num)}
                  >
                    <input
                      type="text"
                      name="passport_num"
                      value={formData.passport_num}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-[#a3e7a3] border border-[#f2f2f2] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </FieldRequired>
                </div>

                {/* Passport Expiration Date */}
                <div className="text-start">
                  <FieldRequired
                    label="Passport expiration date"
                    required={true}
                    error={errors.expire_date}
                    isEmpty={!formData.expire_date}
                  >
                    <input
                      type="date"
                      name="expire_date"
                      value={formData.expire_date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-[#a3e7a3] border border-[#f2f2f2] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </FieldRequired>
                </div>

                {/* Company Name */}
                <div className="text-start">
                  <FieldRequired
                    label="Optional information: If you would like a receipt issued to your company, please tell us the name of your company."
                    required={false}
                  >
                    <input
                      type="text"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleInputChange}
                      placeholder="Other"
                      className="w-full px-4 py-2 bg-[#a3e7a3] border border-[#f2f2f2] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </FieldRequired>
                </div>

                {/* Referer Name */}
                <div className="text-start">
                  <FieldRequired
                    label="Optional information: Name of person you referred"
                    required={false}
                  >
                    <input
                      type="text"
                      name="referer_name"
                      value={formData.referer_name}
                      onChange={handleInputChange}

                      className="w-full px-4 py-2 bg-[#a3e7a3] border border-[#f2f2f2] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </FieldRequired>
                </div>
              </div>
            </div>

            {/* LINE Contact Section */}
            <div className="mb-6 pt-4 border-gray-200">
              <div className="flex flex-col md:flex-row gap-6">
                {/* QR Code Section */}
                <div className="flex-shrink-0">
                  <div className="w-70 h-70 bg-gray-200 border-gray-300 rounded-lg flex items-center justify-center">
                    <img src="/uploads/Line-QR.png" alt="" />
                  </div>
                </div>

                {/* Contact Options */}
                <div className="flex-1">
                  <FieldRequired
                    label="In order to provide you with the best possible support, please add our official LINE account as a friend."
                    required={true}
                    error={errors.contact}
                    isEmpty={!formData.contact}
                  >
                    <div className="mt-3 space-y-2">
                      {contactOptions.map(option => (
                        <div key={option.value} className="flex items-center">
                          <input
                            type="radio"
                            name="contact"
                            value={option.value}
                            checked={formData.contact === option.value}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <label className="ml-3 text-sm text-black">{option.label}</label>
                        </div>
                      ))}
                    </div>
                    <p className="mt-3 text-sm text-blue-600 text-start">
                      *Free Wi-Fi is available at airports in Vietnam.
                    </p>
                  </FieldRequired>
                </div>
              </div>
            </div>

            {/* Survey Channel Section */}
            <div className="mb-6 pt-5 border-gray-200 text-start">
              <FieldRequired
                label="How did you find out about our Fast Track service?"
                required={true}
                error={errors.survey_channel}
                isEmpty={!formData.survey_channel}
              >
                <div className="mt-3 space-y-2">
                  {surveyChannels.map(channel => (
                    <div key={channel.value} className="flex items-center">
                      <input
                        type="radio"
                        name="survey_channel"
                        value={channel.value}
                        checked={formData.survey_channel === channel.value}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <label className="ml-3 text-sm text-black">{channel.label}</label>
                    </div>
                  ))}
                </div>
              </FieldRequired>
            </div>

            {/* Add-ons Section */}
            <div className="pt-4 border-gray-200 text-start">
              <label className="block text-sm font-medium text-black mb-4">
                Would you like a free consultation regarding the following services?
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {addOnsOptions.map(addOn => (
                  <div key={addOn.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.add_ons?.includes(addOn.value) || false}
                      onChange={(e) => handleAddOnChange(addOn.value, e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label className="ml-3 text-sm text-black">{addOn.label}</label>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm text-gray-700">
                Our staff will provide free consultations in Japanese, and in some cases we may even give you discount coupons for affiliated services, so we appreciate your cooperation.
              </p>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-evenly gap-4 mt-8">
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 font-medium"
            >
              Back Confirm
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-[#01ae00] text-white rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 font-medium"
            >
              Reservation Information
            </button>
          </div>
        </form>

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

export default BookingStep2;
