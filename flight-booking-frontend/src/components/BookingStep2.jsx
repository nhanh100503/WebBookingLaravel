import { useState } from 'react';
import ProcessIndicator from './ProcessIndicator';
import Error from './Error';
import FieldRequired from './FieldRequired';
import JapaneseDatePicker from './JapaneseDatePicker';

const BookingStep2 = ({ bookingData, setBookingData, onNextStep, onPrevStep }) => {
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
    { value: 'introduction_by_acquaintance', label: '知り合いのご紹介' },
    { value: 'service_introduction_email', label: 'サービス紹介メール' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'advertisement', label: '広告' },
    { value: 'search_sites', label: ' 検索サイト（Google、Yahooなど）' },
    { value: 'reuse', label: '再利用' },
  ];

  // Contact options matching the image
  const contactOptions = [
    { value: 'line_joined_sent_message', label: '加してメッセージ送った' },
    { value: 'add_line_later', label: '後でLINE追加する' },
    { value: 'email_only', label: 'メールだけ希望（空港で対応遅れる可能性ある）' },
    { value: 'phone_only', label: '電話だけ希望（課金やローミングの問題発生可能性ある）' },
    { value: 'zalo', label: '上の番号のZALOで連絡希望' },
    { value: 'no_communication', label: '空港で連絡手段なし、相談したい' },
  ];

  // Add-ons options matching AddOnEnum
  const addOnsOptions = [
    { value: 0, label: '空港ラウンジ' }, //Airport Lounge
    { value: 1, label: '日本人や外国人観光客向けのホテル' }, //Hotels for Japanese and foreign tourists
    { value: 2, label: 'ショッピングスポット' }, //Shopping spots
    { value: 3, label: 'レンタルカー' }, //Rental Car
    { value: 4, label: '航空券（購入・変更等）' },
    { value: 5, label: '日本人や外国人観光客向けのレストラン' }, //Restaurants for Japanese and foreign tourists
    { value: 6, label: 'マッサージ・健康ケア・美容ケア' }, //Massage, health care, beauty care
    { value: 7, label: '翻訳・観光情報' }, //Interpretation and tourist information
    { value: 8, label: 'ゴルフ' }, //golf
    { value: 9, label: 'ベトナムサプライヤー探し・ベトナム会社繋がり' }, //Finding Vietnamese suppliers and connecting with Vietnamese companies
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
    if (onPrevStep) {
      onPrevStep();
    }
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
    if (onNextStep) {
      onNextStep();
    }
  };


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
                    label="性（パスポートと同じくご記入ください）"
                    required={true}
                    error={errors.last_name}
                    isEmpty={isInputEmpty(formData.last_name)}
                  >
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-[#a3e7a3] border border-[#f2f2f2] rounded-lg focus:outline-none text-base ${errors.last_name ? 'border-[#c02b0b]' : 'border-[#b98d5d]'}`}
                    />
                  </FieldRequired>
                </div>

                {/* First Name */}
                <div>
                  <FieldRequired
                    label="名（パスポートと同じくご記入ください）"
                    required={true}
                    error={errors.first_name}
                    isEmpty={isInputEmpty(formData.first_name)}
                  >
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-[#a3e7a3] border border-[#f2f2f2] rounded-lg focus:outline-none text-base ${errors.first_name ? 'border-[#c02b0b]' : 'border-[#b98d5d]'}`}
                    />
                  </FieldRequired>
                </div>

                {/* Sex, Date of Birth, and Phone Number - grouped */}
                <div className="col-span-2 grid grid-cols-2 gap-6">
                  {/* Sex and Date of Birth - grouped in one column */}
                  <div className="grid grid-cols-2 gap-6">
                    {/* Sex */}
                    <div>
                      <FieldRequired label="性別" required={true} error={errors.gender} isEmpty={!formData.gender}>
                        <fieldset className="mt-2 flex gap-6 border-none p-0 m-0">
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="gender"
                              value="male"
                              checked={formData.gender === 'male'}
                              onChange={handleInputChange}
                              className={`w-4 h-4 focus:outline-none cursor-pointer ${errors.gender && !formData.gender ? 'border-[#c02b0b] text-[#c02b0b]' : 'text-blue-600 border-gray-300'}`}
                            />
                            <span className={`ml-3 text-base ${errors.gender && !formData.gender ? 'text-[#c02b0b]' : 'text-black'}`}>男性</span>
                          </label>
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="gender"
                              value="female"
                              checked={formData.gender === 'female'}
                              onChange={handleInputChange}
                              className={`w-4 h-4 focus:outline-none cursor-pointer ${errors.gender && !formData.gender ? 'border-[#c02b0b] text-[#c02b0b]' : 'text-blue-600 border-gray-300'}`}
                            />
                            <span className={`ml-3 text-base ${errors.gender && !formData.gender ? 'text-[#c02b0b]' : 'text-black'}`}>女性</span>
                          </label>
                        </fieldset>
                      </FieldRequired>
                    </div>
                    {/* Date of Birth */}
                    <div>
                      <FieldRequired
                        label="生年月日"
                        required={true}
                        error={errors.birthday}
                        isEmpty={!formData.birthday}
                      >
                        <JapaneseDatePicker
                          name="birthday"
                          value={formData.birthday}
                          onChange={handleInputChange}
                          placeholder="年/月/日"
                          maxDate={new Date()}
                          className={`w-full px-4 py-3 bg-[#a3e7a3] border border-[#f2f2f2] rounded-lg focus:outline-none text-base ${errors.birthday ? 'border-[#c02b0b]' : 'border-[#b98d5d]'}`}
                          error={errors.birthday}
                        />
                      </FieldRequired>
                    </div>
                  </div>
                  {/* Phone Number */}
                  <div className="text-start">
                    <FieldRequired
                      label="国コード 付電話番号（例：+81-050-6862-0772）"
                      required={true}
                      error={errors.phone_num}
                      isEmpty={isInputEmpty(formData.phone_num)}
                    >
                      <input
                        type="tel"
                        name="phone_num"
                        value={formData.phone_num}
                        onChange={handleInputChange}
                        placeholder=""
                        className={`w-full px-4 py-3 bg-[#a3e7a3] border border-[#f2f2f2] rounded-lg focus:outline-none text-base ${errors.phone_num ? 'border-[#c02b0b]' : 'border-[#b98d5d]'}`}
                      />
                    </FieldRequired>
                  </div>
                </div>

                {/* Email */}
                <div className="text-start">
                  <FieldRequired
                    label="案内を受け取るためのメールアドレス"
                    required={true}
                    error={errors.email}
                    isEmpty={isInputEmpty(formData.email)}
                  >
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-[#a3e7a3] border border-[#f2f2f2] rounded-lg focus:outline-none text-base ${errors.email ? 'border-[#c02b0b]' : 'border-[#b98d5d]'}`}
                    />
                  </FieldRequired>
                </div>

                {/* Email CC */}
                <div>
                  <FieldRequired
                    label="CCを希望されるメールアドレス"
                    required={false}
                  >
                    <input
                      type="email"
                      name="email_cc"
                      value={formData.email_cc}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#a3e7a3] border border-[#f2f2f2] rounded-lg focus:outline-none text-base"
                    />
                  </FieldRequired>
                </div>

                {/* Passport Number */}
                <div className="text-start">
                  <FieldRequired
                    label="パスポート No."
                    required={true}
                    error={errors.passport_num}
                    isEmpty={isInputEmpty(formData.passport_num)}
                  >
                    <input
                      type="text"
                      name="passport_num"
                      value={formData.passport_num}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-[#a3e7a3] border border-[#f2f2f2] rounded-lg focus:outline-none text-base ${errors.passport_num ? 'border-[#c02b0b]' : 'border-[#b98d5d]'}`}
                    />
                  </FieldRequired>
                </div>

                {/* Passport Expiration Date */}
                <div className="text-start">
                  <FieldRequired
                    label="パスポートの有効期限満了日"
                    required={true}
                    error={errors.expire_date}
                    isEmpty={!formData.expire_date}
                  >
                    <JapaneseDatePicker
                      name="expire_date"
                      value={formData.expire_date}
                      onChange={handleInputChange}
                      placeholder="年/月/日"
                      minDate={new Date()}
                      className={`w-full px-4 py-3 bg-[#a3e7a3] border border-[#f2f2f2] rounded-lg focus:outline-none text-base ${errors.expire_date ? 'border-[#c02b0b]' : 'border-[#b98d5d]'}`}
                      error={errors.expire_date}
                    />
                  </FieldRequired>
                </div>

                {/* Company Name */}
                <div className="text-start">
                  <FieldRequired
                    label="任意情報：会社宛に領収書の発行が希望される場合、会社名を教えてください。"
                    required={false}
                  >
                    <input
                      type="text"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleInputChange}
                      placeholder=""
                      className="w-full px-4 py-3 bg-[#a3e7a3] border border-[#f2f2f2] rounded-lg focus:outline-none text-base"
                    />
                  </FieldRequired>
                </div>

                {/* Referer Name */}
                <div className="text-start">
                  <FieldRequired
                    label="任意情報： ご紹介の方のお名前"
                    required={false}
                  >
                    <input
                      type="text"
                      name="referer_name"
                      value={formData.referer_name}
                      onChange={handleInputChange}

                      className="w-full px-4 py-3 bg-[#a3e7a3] border border-[#f2f2f2] rounded-lg focus:outline-none text-base"
                    />
                  </FieldRequired>
                </div>
              </div>
            </div>

            {/* LINE Contact Section */}
            <div className="mb-4 mx-24 pt-4 border-gray-200">
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
                    label="お客様に最適なサポートを提供するために、弊社のLINE公式アカウントと友だち追加をお願いいたします。"
                    required={true}
                    error={errors.contact}
                    isEmpty={!formData.contact}
                  >
                    <fieldset className="mt-3 space-y-2 grid grid-cols-2 gap-2 border-none p-0 m-0">
                      {contactOptions.map(option => (
                        <label key={option.value} className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="contact"
                            value={option.value}
                            checked={formData.contact === option.value}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:outline-none cursor-pointer"
                          />
                          <span className="ml-3 text-base text-black">{option.label}</span>
                        </label>
                      ))}
                    </fieldset>
                    <p className="mt-3 text-base text-blue-600 text-start">
                      ※ベトナムの空港では無料Wi-Fiがあります。
                    </p>
                  </FieldRequired>
                </div>
              </div>
            </div>

            {/* Survey Channel Section */}
            <div className="mb-6 pt-5 border-gray-200 text-start">
              <FieldRequired
                label="弊社のファストトラックサービスはどのチャンネルから知りましたか？"
                required={true}
                error={errors.survey_channel}
                isEmpty={!formData.survey_channel}
              >
                <fieldset className="mt-3 space-y-2 grid grid-cols-2 gap-2 border-none p-0 m-0">
                  {surveyChannels.map(channel => (
                    <label key={channel.value} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="survey_channel"
                        value={channel.value}
                        checked={formData.survey_channel === channel.value}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:outline-none cursor-pointer"
                      />
                      <span className="ml-3 text-base text-black">{channel.label}</span>
                    </label>
                  ))}
                </fieldset>
              </FieldRequired>
            </div>

            {/* Add-ons Section */}
            <div className="pt-4 border-gray-200 text-start">
              <label className="block text-base font-medium text-black mb-4">
                以下のサービスについての無料相談をご希望しませんか。
              </label>
              <div className="grid grid-cols-2 gap-3">
                {/* Left Column: value0, value1, value2, value3, value4 */}
                <div className="space-y-3">
                  {addOnsOptions.filter(addOn => addOn.value <= 4).map(addOn => (
                    <div key={addOn.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.add_ons?.includes(addOn.value) || false}
                        onChange={(e) => handleAddOnChange(addOn.value, e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:outline-none"
                      />
                      <label className="ml-3 text-base text-black cursor-pointer">{addOn.label}</label>
                    </div>
                  ))}
                </div>
                {/* Right Column: value5, value6, value7, value8, value9 */}
                <div className="space-y-3">
                  {addOnsOptions.filter(addOn => addOn.value >= 5).map(addOn => (
                    <div key={addOn.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.add_ons?.includes(addOn.value) || false}
                        onChange={(e) => handleAddOnChange(addOn.value, e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:outline-none"
                      />
                      <label className="ml-3 text-base text-black cursor-pointer">{addOn.label}</label>
                    </div>
                  ))}
                </div>
              </div>
              <p className="mt-4 text-base text-blue-900">
                弊社のスタッフが日本語で無料相談を行い、場合によっては提携サービスの割引券をプレゼントすることもありますので、 ぜひご協力をよろしくお願いいたします。
              </p>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-2 mt-8">
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 font-medium text-base"
            >
              戻る
            </button>
            <button
              //hover with bg-white-500 with slow transition
              type="submit"
              className="px-8 py-3 bg-[#01ae00] text-white rounded-full hover:bg-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 font-medium transition-all duration-300 text-base"
            >
              予約情報の確認
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default BookingStep2;
