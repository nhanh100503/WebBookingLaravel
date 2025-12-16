import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBooking } from '../services/bookingService';
import ProcessIndicator from './ProcessIndicator';

const BookingStep3 = ({ bookingData, onPrevStep }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Helper functions to get labels
  const getImmigrationPackageLabel = (value) => {
    const packages = {
      '35$': 'VIP_IN1_入国審査での優先レーンのみ利用(フィー：35$ )',
      '40$': 'VIP_IN2_入国審査での優先レーン利用＋空港の外の迎え場所への案内 (フィー：40$ )',
      '50$': 'VIP_IN3_ 入国審査での優先レーン利用＋荷物受取サポート＋空港の外の迎え場所への案内 (フィー：50$ )',
      '300$': 'VIP_IN6_VVIP最優先レーン利用・Non-stopパッケージ(フィー：300$)',
    };
    return packages[value] || value;
  };

  const getEmigrationPackageLabel = (value) => {
    const packages = {
      '50$': '出国Fasttrackフルサポートをご利用する(50$)',
      '300$': 'VVIP出国Fasttrackを利用する(300$)',
    };
    return packages[value] || value;
  };

  const getPickupVehicleLabel = (value) => {
    const vehicles = {
      'no': '利用しない',
      '4_seat': '迎車 4席 (20$)',
      '7_seat': '迎車 7席 (25$)',
      'limousine_7_seat': '迎車 9席 Limousine (50$)',
    };
    return vehicles[value] || value;
  };

  const getSeatingPreferenceLabel = (value) => {
    const preferences = {
      'dont_want': "希望しない",
      'front_window': '前方 窓側',
      'front_aisle': '前方 通路側',
      'front_middle_window': '前方 真ん中席又は窓側',
      'middle_window': '中列 窓側',
      'middle_aisle': '中列 通路側',
      'middle_middle_window': '中列 真ん中席又は窓側',
      'rear_aisle': '後方 通路側',
      'rear_window': '後方 窓側',
      'rear_middle_window': '後方 真ん中席又は窓側',
    };
    return preferences[value] || value;
  };

  const getAirportLabel = (value) => {
    const airports = {
      'SGN': 'SGN - タンソンニャット空港 (Tan Son Nhat・Ho Chi Minh City)',
      'DAD': 'DAD - ダナン空港(Da Nang)',
      'HAN': 'HAN - ノイバイ(Noi Bai・Ha Noi)',
    };
    return airports[value] || value;
  };

  const getContactLabel = (value) => {
    const contacts = {
      'line_joined_sent_message': '加してメッセージ送った',
      'email_only': 'メールだけ希望（空港で対応遅れる可能性ある）',
      'zalo': '上の番号のZALOで連絡希望',
      'add_line_later': '後でLINE追加する',
      'phone_only': '電話だけ希望（課金やローミングの問題発生可能性ある）',
      'no_communication': '空港で連絡手段なし、相談したい',
    };
    return contacts[value] || value;
  };

  const getSurveyChannelLabel = (value) => {
    const channels = {
      'introduction_by_acquaintance': '知り合いのご紹介',
      'facebook': 'Facebook',
      'search_sites': ' 検索サイト（Google、Yahooなど）',
      'service_introduction_email': 'サービス紹介メール',
      'advertisement': '広告',
      'reuse': '再利用',
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
    return value === 'male' ? '男性' : value === 'female' ? '女性' : value;
  };

  const getAddOnLabel = (value) => {
    const addOns = {
      0: '空港ラウンジ',
      1: '日本人や外国人観光客向けのホテル',
      2: 'ショッピングスポット',
      3: 'レンタルカー',
      4: '航空券（購入・変更等）',
      5: '日本人や外国人観光客向けのレストラン',
      6: 'マッサージ・健康ケア・美容ケア',
      7: '翻訳・観光情報',
      8: 'ゴルフ',
      9: 'ベトナムサプライヤー探し・ベトナム会社繋がり',
    };
    return addOns[value] || value;
  };

  const getPaymentMethodLabel = (value) => {
    const methods = {
      'cash': '現金払い',
      'online_credit': 'オンラインでクレジット決済',
      'vietnam_bank_transfer': 'ベトナム口座振込',
    };
    return methods[value] || value;
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
          breakdown.push({ no: '1.1', content: '迎車利用', presence: 'あり', amount: `$${price}` });
          subtotal += price;
        }
      } else {
        breakdown.push({ no: '1.1', content: '迎車利用', presence: 'なし', amount: '$0' });
      }

      // 1.2 Guaranteed immigration clearance within 15 minutes
      if (bookingData.immigration.complete_within_15min) {
        breakdown.push({ no: '1.2', content: '15分以内に入国審査手続き完了', presence: 'あり', amount: '$15' });
        subtotal += 15;
      } else {
        breakdown.push({ no: '1.2', content: '15分以内に入国審査手続き完了', presence: 'なし', amount: '$0' });
      }

      // 1.3 Pick-up at the plane's exit
      if (bookingData.immigration.pickup_at_airplain_exit) {
        breakdown.push({ no: '1.3', content: "飛行機の降り口でのお迎え", presence: 'あり', amount: '$60' });
        subtotal += 60;
      } else {
        breakdown.push({ no: '1.3', content: "飛行機の降り口でのお迎え", presence: 'なし', amount: '$0' });
      }

      // 1.4 Entry Fasttrack Package
      const packagePrices = { '35$': 35, '40$': 40, '50$': 50, '300$': 300 };
      const packagePrice = packagePrices[bookingData.immigration.immigration_package] || 0;
      breakdown.push({ no: '1.4', content: '入国ファストトラックパッケージ', presence: 'あり', amount: `$${packagePrice}` });
      subtotal += packagePrice;
    }

    // 2 Full support for departures with Fasttrack
    if (bookingData?.emigration) {
      const emigrationPrices = { '50$': 50, '300$': 300 };
      const emigrationPrice = emigrationPrices[bookingData.emigration.emigration_package] || 0;
      breakdown.push({ no: '2', content: '出国Fasttrackフルサポート', presence: 'あり', amount: `$${emigrationPrice}` });
      subtotal += emigrationPrice;
    }

    return { breakdown, subtotal };
  };

  const handleBack = () => {
    if (onPrevStep) {
      onPrevStep();
    }
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
          nationality: bookingData.passport.nationality || null,
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
        add_ons: bookingData.add_ons || [],
        service_price: bookingData.sub_price || 0,
        sub_price: bookingData.sub_price || 0,
        vat_price: bookingData.vat_price || 0,
        total_price: bookingData.total_price || 0,
        coupon_id: bookingData.coupon_id || null,
        payment_method: bookingData.payment_method || null,
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

      // Clear step from localStorage when going to success
      localStorage.removeItem('bookingStep');

      // Navigate to success page with booking ID
      navigate(`/booking/success/${response.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || '予約の作成に失敗しました。もう一度お試しください。');
      setIsSubmitting(false);
    }
  };

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
    <div className="min-h-screen bg-white border border-gray-200  shadow-sm rounded-lg">
      <div className="max-w-6xl mx-auto px-2 max-[640px]:px-1 py-4">
        <ProcessIndicator currentStep={3} />
        <hr className="border-b-[0.4px] border-gray-200 mt-3 mb-4 " />

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 ">
            {error}
          </div>
        )}

        {/* User Information Table - match reference UI layout */}
        <div className="mb-6 bg-white border-2 border-gray-300 overflow-hidden mt-10 max-[640px]:mt-4">
          <h2 className="text-xl max-[640px]:text-lg font-bold text-black text-center bg-gray-100 py-4 max-[640px]:py-2 px-6 max-[640px]:px-2 border-b border-gray-200">
            利用者の情報
          </h2>
          <div className="p-0">
            <table className="w-full border-collapse max-[640px]:text-sm">
              <tbody>
                {/* Row 1: Last name & First name / Gender & DOB */}
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-black text-base max-[640px]:text-sm w-1/2 border-r border-gray-200">
                    <span className="font-bold">性:</span>{' '}
                    {bookingData?.passport?.last_name}{' '}
                    <span className="font-bold ml-4 max-[640px]:ml-2">名:</span>{' '}
                    {bookingData?.passport?.first_name}
                  </td>
                  <td className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-black text-base max-[640px]:text-sm w-1/2">
                    <span className="font-bold">性別:</span>{' '}
                    {getGenderLabel(bookingData?.passport?.gender)}{' '}
                    <span className="font-bold ml-6 max-[640px]:ml-2">生年月日:</span>{' '}
                    {formatDate(bookingData?.passport?.birthday)}
                  </td>
                </tr>

                {/* Row 2: Phone number & Nationality */}
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-black text-base max-[640px]:text-sm w-1/2 border-r border-gray-200">
                    <span className="font-bold">国コード 付電話番号:</span>{' '}
                    {bookingData?.passport?.phone_num}
                  </td>
                  <td className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-black text-base max-[640px]:text-sm w-1/2">
                    <span className="font-bold">国籍:</span>{' '}
                    {bookingData?.passport?.nationality === 'japan' ? '日本' :
                      bookingData?.passport?.nationality === 'vietnam' ? 'ベトナム' :
                        bookingData?.passport?.nationality === 'others' ? 'その他' :
                          bookingData?.passport?.nationality || ''}
                  </td>
                </tr>

                {/* Row 3: Email / CC Email */}
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-black text-base max-[640px]:text-sm w-1/2 border-r border-gray-200">
                    <span className="font-bold">案内を受け取るためのメールアドレス:</span>{' '}
                    <span className="break-all">{bookingData?.passport?.email}</span>
                  </td>
                  <td className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-black text-base max-[640px]:text-sm w-1/2">
                    <span className="font-bold">CCを希望されるメールアドレス:</span>{' '}
                    <span className="break-all">{bookingData?.passport?.email_cc || ''}</span>
                  </td>
                </tr>

                {/* Row 4: Passport No / Passport Expiration */}
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-black text-base max-[640px]:text-sm w-1/2 border-r border-gray-200">
                    <span className="font-bold">パスポート No.:</span>{' '}
                    {bookingData?.passport?.passport_num}
                  </td>
                  <td className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-black text-base max-[640px]:text-sm w-1/2">
                    <span className="font-bold">パスポートの有効期限満了日:</span>{' '}
                    {formatDate(bookingData?.passport?.expire_date)}
                  </td>
                </tr>

                {/* Row 5: Company name / Referrer */}
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-black text-base max-[640px]:text-sm w-1/2 border-r border-gray-200">
                    <span className="font-bold">会社名:</span>{' '}
                    {bookingData?.passport?.company_name || 'Other'}
                  </td>
                  <td className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-black text-base max-[640px]:text-sm w-1/2">
                    <span className="font-bold">ご紹介の方のお名前:</span>{' '}
                    {bookingData?.passport?.referer_name || ''}
                  </td>
                </tr>

                {/* Row 6: Contact / Survey channel */}
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-black text-base max-[640px]:text-sm w-1/2 border-r border-gray-200">
                    <span className="font-bold">Line OA追加:</span>{' '}
                    {getContactLabel(bookingData?.contact)}
                  </td>
                  <td className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-black text-base max-[640px]:text-sm w-1/2">
                    <span className="font-bold">
                      本アンケートをどのチャンネルから知りましたか？:
                    </span>{' '}
                    {getSurveyChannelLabel(bookingData?.survey_channel)}
                  </td>
                </tr>

                {/* Row 7: Add-ons Section */}
                {bookingData?.add_ons && bookingData.add_ons.length > 0 && (
                  <tr>
                    <td colSpan="2" className="py-2 px-4 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">
                      <span className="font-bold">以下のサービスについての無料相談をご希望しませんか。</span>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        {bookingData.add_ons.map((addOnValue) => (
                          <li key={addOnValue}>{getAddOnLabel(addOnValue)}</li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Reservation Service tables - dynamic width: 100% if 1 table, 50% if 2 */}
        {(bookingData?.immigration || bookingData?.emigration) && (
          <>
            <h2 className="font-bold text-black text-base mt-6">
              ご予約サービス
            </h2>

            <hr className="border-b-3 border-[#CBCBCB] mt-3 mb-4" />
            <div className="p-0">
              <div className={`grid gap-6 max-[640px]:gap-4 ${bookingData?.immigration && bookingData?.emigration ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                {/* Fast Track Entry column */}
                {bookingData?.immigration && (
                  <div className="border-2 border-gray-300 overflow-hidden">
                    <div className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 font-bold text-black text-center border-b border-gray-200 bg-gray-100 max-[640px]:text-sm">
                      入国ファストトラック
                    </div>
                    <table className="w-full border-collapse max-[640px]:text-sm">
                      <tbody>
                        <tr className="border-b border-gray-200">
                          <td className="py-2 px-4 max-[640px]:py-1 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">
                            <strong>入国ファストトラック:</strong> {getImmigrationPackageLabel(bookingData.immigration.immigration_package)}
                          </td>
                        </tr>
                        {bookingData.immigration.immigration_package !== '300$' && (
                          <tr className="border-b border-gray-200">
                            <td className="py-2 px-4 max-[640px]:py-1 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">
                              <strong>オプション：15分以内に入国審査手続き完了ン:</strong> {bookingData.immigration.complete_within_15min ? '利用する (15$)' : '利用しない'}
                            </td>
                          </tr>
                        )}
                        <tr className="border-b border-gray-200">
                          <td className="py-2 px-4 max-[640px]:py-1 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">
                            <strong>フライトの予約番号や予約コード:</strong> {bookingData.immigration.flight_reservation_num}
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-2 px-4 max-[640px]:py-1 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">
                            <strong>便・フライトNo.:</strong> {bookingData.immigration.flight_num}
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-2 px-4 max-[640px]:py-1 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">
                            <strong>ご利用の対象空港:</strong> {getAirportLabel(bookingData.immigration.airport)}
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-2 px-4 max-[640px]:py-1 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">
                            <strong>到着日:</strong> {formatDate(bookingData.immigration.arrival_date)}
                          </td>
                        </tr>
                        {/* Other options – same table section as 入国ファストトラック */}
                        <tr className="border-b border-gray-200">
                          <td className="py-2 px-4 max-[640px]:py-1 max-[640px]:px-2 text-black text-base max-[640px]:text-sm font-bold text-center">
                            他のオプション
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-2 px-4 max-[640px]:py-1 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">
                            <strong>飛行機の降り口でお迎え (60$):</strong> {bookingData.immigration.pickup_at_airplain_exit ? 'ご利用する (60$)' : '利用しない'}
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-2 px-4 max-[640px]:py-1 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">
                            <strong>迎車利用:</strong> {getPickupVehicleLabel(bookingData.immigration.pickup_vehicle_using)}
                          </td>
                        </tr>
                        {bookingData.immigration.phone_num_of_picker && (
                          <tr className="border-b border-gray-200">
                            <td className="py-2 px-4 max-[640px]:py-1 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">
                              <strong>お迎えのベトナム語を話せる方の電話番号（任意）:</strong> {bookingData.immigration.phone_num_of_picker}
                            </td>
                          </tr>
                        )}
                        {bookingData.immigration.requirement && (
                          <tr>
                            <td className="py-2 px-4 max-[640px]:py-1 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">
                              <strong>迎えや見送りの他のご希望があればご記入くださいませ。</strong> {bookingData.immigration.requirement}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Departure Fast Track column */}
                {bookingData?.emigration && (
                  <div className="border-2 border-gray-300 overflow-hidden">
                    <div className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 font-bold text-black text-center border-b border-gray-200 bg-gray-100 max-[640px]:text-sm">
                      出国ファストトラック
                    </div>
                    <table className="w-full border-collapse max-[640px]:text-sm">
                      <tbody>
                        <tr className="border-b border-gray-200">
                          <td className="py-2 px-4 max-[640px]:py-1 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">
                            <strong>出国ファストトラック:</strong> {getEmigrationPackageLabel(bookingData.emigration.emigration_package)}
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-2 px-4 max-[640px]:py-1 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">
                            <strong>フライトの予約番号や予約コード:</strong> {bookingData.emigration.flight_reservation_num}
                          </td>
                        </tr>
                        {bookingData.emigration.airline_membership_num && (
                          <tr className="border-b border-gray-200">
                            <td className="py-2 px-4 max-[640px]:py-1 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">
                              <strong>運行航空の会員番号やマイレージ番号（あれば）:</strong> {bookingData.emigration.airline_membership_num}
                            </td>
                          </tr>
                        )}
                        <tr className="border-b border-gray-200">
                          <td className="py-2 px-4 max-[640px]:py-1 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">
                            <strong>便・フライトNo.:</strong> {bookingData.emigration.flight_num}
                          </td>
                        </tr>
                        {bookingData.emigration.seating_pref && (
                          <tr className="border-b border-gray-200">
                            <td className="py-2 px-4 max-[640px]:py-1 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">
                              <strong>席のご希望（出来るだけアレンジしますが、ご希望を応えない場合もあります）:</strong> {getSeatingPreferenceLabel(bookingData.emigration.seating_pref)}
                            </td>
                          </tr>
                        )}
                        <tr className="border-b border-gray-200">
                          <td className="py-2 px-4 max-[640px]:py-1 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">
                            <strong>ご利用の対象空港:</strong> {getAirportLabel(bookingData.emigration.airport)}
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="py-2 px-4 max-[640px]:py-1 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">
                            <strong>出発日:</strong> {formatDate(bookingData.emigration.departure_date)}
                          </td>
                        </tr>
                        {bookingData.emigration.meeting_time && (
                          <tr className="border-b border-gray-200">
                            <td className="py-2 px-4 max-[640px]:py-1 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">
                              <strong>出発空港での待ち合わせご希望時間（出発の３時間前からご指定可）:</strong> {bookingData.emigration.meeting_time}
                            </td>
                          </tr>
                        )}
                        {bookingData.emigration.phone_num_of_picker && (
                          <tr className="border-b border-gray-200">
                            <td className="py-2 px-4 max-[640px]:py-1 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">
                              <strong>お見送りのベトナム語を話せる方の電話番号（任意）:</strong> {bookingData.emigration.phone_num_of_picker}
                            </td>
                          </tr>
                        )}
                        {bookingData.emigration.requirement && (
                          <tr>
                            <td className="py-2 px-4 max-[640px]:py-1 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">
                              <strong>他のご希望があればご記入くださいませ。</strong> {bookingData.emigration.requirement}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Cost Table */}

        <h2 className="text-base font-bold text-black mt-6">料金</h2>
        <hr className="border-b-3 border-[#CBCBCB] mt-3 mb-4" />

        <div className="overflow-x-auto">
          <table className="w-full border-collapse max-[640px]:text-sm">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-left font-bold text-black text-base max-[640px]:text-sm">No.</th>
                <th className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-left font-bold text-black text-base max-[640px]:text-sm">内容</th>
                <th className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-left font-bold text-black text-base max-[640px]:text-sm">有無</th>
                <th className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-right font-bold text-black text-base max-[640px]:text-sm">金額</th>
              </tr>
            </thead>
            <tbody>
              {bookingData?.immigration && (
                <>
                  <tr>
                    <td colSpan="4" className="py-2 px-4 max-[640px]:px-2 font-bold text-black text-base max-[640px]:text-sm bg-gray-100">入国ファストトラック:</td>
                  </tr>
                  {costData.breakdown.filter(item => item.no.startsWith('1.')).map((item, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">{item.no}</td>
                      <td className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">{item.content}</td>
                      <td className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">{item.presence}</td>
                      <td className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-right text-black text-base max-[640px]:text-sm">{item.amount}</td>
                    </tr>
                  ))}
                </>
              )}
              {bookingData?.emigration && costData.breakdown.filter(item => item.no === '2').map((item, index) => (
                <tr key={`emigration-${index}`} className="border-b border-gray-200">
                  <td className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">{item.no}</td>
                  <td className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">{item.content}</td>
                  <td className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-black text-base max-[640px]:text-sm">{item.presence}</td>
                  <td className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-right text-black text-base max-[640px]:text-sm">{item.amount}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-gray-300">
                <td colSpan="3" className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 font-bold text-black text-base max-[640px]:text-sm text-right">仮計算</td>
                <td className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-right font-bold text-black text-base max-[640px]:text-sm">${subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan="3" className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 font-bold text-black text-base max-[640px]:text-sm text-right">クーポン</td>
                <td className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-right font-bold text-green-600 text-base max-[640px]:text-sm">- ${couponDiscount.toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan="3" className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 font-bold text-black text-base max-[640px]:text-sm text-right">合計（税抜）</td>
                <td className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-right font-bold text-black text-base max-[640px]:text-sm">${totalExcludingTax.toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan="3" className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 font-bold text-black text-base max-[640px]:text-sm text-right">消費税 VAT(8%)</td>
                <td className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-right font-bold text-black text-base max-[640px]:text-sm">${vat.toFixed(2)}</td>
              </tr>
              <tr className="border-t-2 border-gray-300">
                <td colSpan="3" className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 font-bold text-black text-base max-[640px]:text-sm text-right">請求金額</td>
                <td className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-right font-bold text-red-600 text-xl max-[640px]:text-base">${billedAmount.toFixed(2)}</td>
              </tr>
              {bookingData?.payment_method && (
                <tr>
                  <td colSpan="3" className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 font-bold text-black text-base max-[640px]:text-sm text-right">お支払い方法</td>
                  <td className="py-3 px-4 max-[640px]:py-2 max-[640px]:px-2 text-right font-bold text-black text-base max-[640px]:text-sm">{getPaymentMethodLabel(bookingData.payment_method)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-center gap-4 mt-8 max-[640px]:gap-2 max-[640px]:px-4 max-[640px]:pb-4">
        <button
          type="button"
          onClick={handleBack}
          disabled={isSubmitting}
          className="px-6 py-3 max-[640px]:px-4 max-[640px]:py-2 text-gray-500 rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          前へ
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-6 py-3 max-[640px]:px-4 max-[640px]:py-2 bg-[#01ae00] text-white rounded-full hover:bg-[#018800] focus:outline-none focus:ring-2 focus:ring-green-500 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '予約中...' : '予約する'}
        </button>
      </div>
    </div>
  );
};

export default BookingStep3;

