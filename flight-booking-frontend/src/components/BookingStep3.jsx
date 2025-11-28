import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBooking } from '../services/bookingService';
import ProcessIndicator from './ProcessIndicator';

const BookingStep3 = ({ bookingData }) => {
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
        add_ons: bookingData.add_ons || [],
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
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8 pb-32">
        <ProcessIndicator currentStep={3} />

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* User Information Table */}
        <div className="mb-6 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <h2 className="text-xl font-bold text-black text-center bg-gray-100 py-4 px-6 border-b border-gray-200">利用者情報</h2>
          <div className="p-6">
            <table className="w-full border-collapse">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-medium text-black text-base w-1/2 bg-gray-50">性、名</td>
                  <td className="py-3 px-4 text-black text-base">{bookingData?.passport?.last_name}, {bookingData?.passport?.first_name}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-medium text-black text-base bg-gray-50">性別、国コード 付電話番号</td>
                  <td className="py-3 px-4 text-black text-base">{getGenderLabel(bookingData?.passport?.gender)}, {bookingData?.passport?.phone_num}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-medium text-black text-base bg-gray-50">案内を受け取るためのメールアドレス</td>
                  <td className="py-3 px-4 text-black text-base">{bookingData?.passport?.email}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-medium text-black text-base bg-gray-50">CCを希望されるメールアドレス</td>
                  <td className="py-3 px-4 text-black text-base">{bookingData?.passport?.email_cc || ''}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-medium text-black text-base bg-gray-50">パスポート No.</td>
                  <td className="py-3 px-4 text-black text-base">{bookingData?.passport?.passport_num}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-medium text-black text-base bg-gray-50">パスポートの有効期限満了日</td>
                  <td className="py-3 px-4 text-black text-base">{formatDate(bookingData?.passport?.expire_date)}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-medium text-black text-base bg-gray-50">会社名</td>
                  <td className="py-3 px-4 text-black text-base">{bookingData?.passport?.company_name || 'その他'}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-medium text-black text-base bg-gray-50">ご紹介の方のお名前</td>
                  <td className="py-3 px-4 text-black text-base">{bookingData?.passport?.referer_name || ''}</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-medium text-black text-base bg-gray-50">LINE OA追加</td>
                  <td className="py-3 px-4 text-black text-base">{getContactLabel(bookingData?.contact)}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-black text-base bg-gray-50">弊社のファストトラックサービスはどのチャンネルから知りましたか？</td>
                  <td className="py-3 px-4 text-black text-base">{getSurveyChannelLabel(bookingData?.survey_channel)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Add-ons Table */}
        {bookingData?.add_ons && bookingData.add_ons.length > 0 && (
          <div className="mb-6 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <h2 className="text-xl font-bold text-black text-center bg-gray-100 py-4 px-6 border-b border-gray-200">追加サービス</h2>
            <div className="p-6">
              <table className="w-full border-collapse">
                <tbody>
                  {bookingData.add_ons.map((addOnValue, index) => (
                    <tr key={index} className={index < bookingData.add_ons.length - 1 ? 'border-b border-gray-200' : ''}>
                      <td className="py-3 px-4 font-medium text-black text-base w-1/2 bg-gray-50">サービス {index + 1}</td>
                      <td className="py-3 px-4 text-black text-base">{getAddOnLabel(addOnValue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Fast Track Entry Table */}
        {bookingData?.immigration && (
          <div className="mb-6 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <h2 className="text-xl font-bold text-black text-center bg-gray-100 py-4 px-6 border-b border-gray-200">入国ファストトラック</h2>
            <div className="p-6">
              <table className="w-full border-collapse">
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 font-medium text-black text-base w-1/3 bg-gray-50">入国ファストトラックパッケージ</td>
                    <td className="py-3 px-4 text-black text-base">{getImmigrationPackageLabel(bookingData.immigration.immigration_package)}</td>
                  </tr>
                  {bookingData.immigration.immigration_package !== '300$' && (
                    <tr className="border-b border-gray-200">
                      <td className="py-3 px-4 font-medium text-black text-base bg-gray-50">オプション：15分以内に入国審査手続き完了 (15$)</td>
                      <td className="py-3 px-4 text-black text-base">{bookingData.immigration.complete_within_15min ? '利用する (15$)' : '利用しない'}</td>
                    </tr>
                  )}
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 font-medium text-black text-base bg-gray-50">フライトの予約番号や予約コード</td>
                    <td className="py-3 px-4 text-black text-base">{bookingData.immigration.flight_reservation_num}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 font-medium text-black text-base bg-gray-50">便・フライトNo.</td>
                    <td className="py-3 px-4 text-black text-base">{bookingData.immigration.flight_num}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 font-medium text-black text-base bg-gray-50">ご利用の対象空港</td>
                    <td className="py-3 px-4 text-black text-base">{getAirportLabel(bookingData.immigration.airport)}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 font-medium text-black text-base bg-gray-50">到着日</td>
                    <td className="py-3 px-4 text-black text-base">{formatDate(bookingData.immigration.arrival_date)}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 font-medium text-black text-base bg-gray-50">他のオプション</td>
                    <td className="py-3 px-4 text-black text-base">
                      <div className="space-y-1">
                        <div>飛行機の降り口でのお迎え (60$): {bookingData.immigration.pickup_at_airplain_exit ? 'ご利用する (60$)' : '利用しない'}</div>
                        <div>迎車利用: {getPickupVehicleLabel(bookingData.immigration.pickup_vehicle_using)}</div>
                        {bookingData.immigration.phone_num_of_picker && (
                          <div>お迎えのベトナム語を話せる方の電話番号（任意）: {bookingData.immigration.phone_num_of_picker}</div>
                        )}
                        {bookingData.immigration.requirement && (
                          <div>他のご希望があればご記入くださいませ: {bookingData.immigration.requirement}</div>
                        )}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Departure Fast Track Table */}
        {bookingData?.emigration && (
          <div className="mb-6 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <h2 className="text-xl font-bold text-black text-center bg-gray-100 py-4 px-6 border-b border-gray-200">出国ファストトラック</h2>
            <div className="p-6">
              <table className="w-full border-collapse">
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 font-medium text-black text-base w-1/3 bg-gray-50">出国Fasttrack</td>
                    <td className="py-3 px-4 text-black text-base">{getEmigrationPackageLabel(bookingData.emigration.emigration_package)}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 font-medium text-black text-base bg-gray-50">フライトの予約番号や予約コード</td>
                    <td className="py-3 px-4 text-black text-base">{bookingData.emigration.flight_reservation_num}</td>
                  </tr>
                  {bookingData.emigration.airline_membership_num && (
                    <tr className="border-b border-gray-200">
                      <td className="py-3 px-4 font-medium text-black text-base bg-gray-50">運行航空の会員番号やマイレージ番号（あれば）</td>
                      <td className="py-3 px-4 text-black text-base">{bookingData.emigration.airline_membership_num}</td>
                    </tr>
                  )}
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 font-medium text-black text-base bg-gray-50">便・フライトNo.</td>
                    <td className="py-3 px-4 text-black text-base">{bookingData.emigration.flight_num}</td>
                  </tr>
                  {bookingData.emigration.seating_pref && (
                    <tr className="border-b border-gray-200">
                      <td className="py-3 px-4 font-medium text-black text-base bg-gray-50">席のご希望（出来るだけアレンジしますが、ご希望を応えない場合もあります）</td>
                      <td className="py-3 px-4 text-black text-base">{getSeatingPreferenceLabel(bookingData.emigration.seating_pref)}</td>
                    </tr>
                  )}
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 font-medium text-black text-base bg-gray-50">ご利用の対象空港</td>
                    <td className="py-3 px-4 text-black text-base">{getAirportLabel(bookingData.emigration.airport)}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-3 px-4 font-medium text-black text-base bg-gray-50">出発日</td>
                    <td className="py-3 px-4 text-black text-base">{formatDate(bookingData.emigration.departure_date)}</td>
                  </tr>
                  {bookingData.emigration.meeting_time && (
                    <tr className="border-b border-gray-200">
                      <td className="py-3 px-4 font-medium text-black text-base bg-gray-50">出発空港での待ち合わせご希望時間（出発の３時間前からご指定可）</td>
                      <td className="py-3 px-4 text-black text-base">{bookingData.emigration.meeting_time}</td>
                    </tr>
                  )}
                  {bookingData.emigration.phone_num_of_picker && (
                    <tr className="border-b border-gray-200">
                      <td className="py-3 px-4 font-medium text-black text-base bg-gray-50">お見送りのベトナム語を話せる方の電話番号（任意）</td>
                      <td className="py-3 px-4 text-black text-base">{bookingData.emigration.phone_num_of_picker}</td>
                    </tr>
                  )}
                  {bookingData.emigration.requirement && (
                    <tr>
                      <td className="py-3 px-4 font-medium text-black text-base bg-gray-50">他のご希望があればご記入くださいませ。</td>
                      <td className="py-3 px-4 text-black text-base">{bookingData.emigration.requirement}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Cost Table */}
        <div className="mb-6 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <h2 className="text-xl font-bold text-black text-center bg-gray-100 py-4 px-6 border-b border-gray-200">料金</h2>
          <div className="p-6">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-300 bg-gray-50">
                  <th className="py-3 px-4 text-left font-bold text-black text-base">No.</th>
                  <th className="py-3 px-4 text-left font-bold text-black text-base">内容</th>
                  <th className="py-3 px-4 text-left font-bold text-black text-base">有無</th>
                  <th className="py-3 px-4 text-right font-bold text-black text-base">金額</th>
                </tr>
              </thead>
              <tbody>
                {bookingData?.immigration && (
                  <>
                    <tr>
                      <td colSpan="4" className="py-2 px-4 font-bold text-black text-base bg-gray-100">入国ファストトラック:</td>
                    </tr>
                    {costData.breakdown.filter(item => item.no.startsWith('1.')).map((item, index) => (
                      <tr key={index} className="border-b border-gray-200">
                        <td className="py-3 px-4 text-black text-base">{item.no}</td>
                        <td className="py-3 px-4 text-black text-base">{item.content}</td>
                        <td className="py-3 px-4 text-black text-base">{item.presence}</td>
                        <td className="py-3 px-4 text-right text-black text-base">{item.amount}</td>
                      </tr>
                    ))}
                  </>
                )}
                {bookingData?.emigration && costData.breakdown.filter(item => item.no === '2').map((item, index) => (
                  <tr key={`emigration-${index}`} className="border-b border-gray-200">
                    <td className="py-3 px-4 text-black text-base">{item.no}</td>
                    <td className="py-3 px-4 text-black text-base">{item.content}</td>
                    <td className="py-3 px-4 text-black text-base">{item.presence}</td>
                    <td className="py-3 px-4 text-right text-black text-base">{item.amount}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-gray-300">
                  <td colSpan="3" className="py-3 px-4 font-bold text-black text-base text-right">仮計算</td>
                  <td className="py-3 px-4 text-right font-bold text-black text-base">${subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan="3" className="py-3 px-4 font-bold text-black text-base text-right">クーポン</td>
                  <td className="py-3 px-4 text-right font-bold text-green-600 text-base">- ${couponDiscount.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan="3" className="py-3 px-4 font-bold text-black text-base text-right">合計（税抜）</td>
                  <td className="py-3 px-4 text-right font-bold text-black text-base">${totalExcludingTax.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan="3" className="py-3 px-4 font-bold text-black text-base text-right">消費税 VAT(8%)</td>
                  <td className="py-3 px-4 text-right font-bold text-black text-base">${vat.toFixed(2)}</td>
                </tr>
                <tr className="border-t-2 border-gray-300">
                  <td colSpan="3" className="py-3 px-4 font-bold text-black text-base text-right">請求金額</td>
                  <td className="py-3 px-4 text-right font-bold text-red-600 text-xl">${billedAmount.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4 mt-8">
          <button
            type="button"
            onClick={handleBack}
            disabled={isSubmitting}
            className="px-6 py-3 bg-gray-500 text-white rounded-full hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            戻る
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-3 bg-[#01ae00] text-white rounded-full hover:bg-[#018800] focus:outline-none focus:ring-2 focus:ring-green-500 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '予約中...' : '予約する'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingStep3;

