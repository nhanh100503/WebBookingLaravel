import { useState, useEffect, useRef } from 'react';
import { validateCoupon } from '../services/bookingService';
import LineInquiry from './LineInquiry';

const PriceBar = ({
  bookingData,
  onCouponApply,
  primaryActionLabel,
  onPrimaryAction,
  primaryActionDisabled = false,
}) => {
  // Initialize coupon state from bookingData to persist across steps
  const [couponCode, setCouponCode] = useState(bookingData?.coupon?.code || '');
  const [appliedCoupon, setAppliedCoupon] = useState(bookingData?.coupon?.appliedCoupon || null);
  const [couponError, setCouponError] = useState('');
  const [usedCouponCodes, setUsedCouponCodes] = useState([]); // Track codes already used in this session (in-memory only)
  const [subtotal, setSubtotal] = useState(0);
  const [vat, setVat] = useState(0);
  const [total, setTotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState(bookingData?.payment_method || 'online_credit');
  const isCalculatingRef = useRef(false);

  // Package prices
  const packagePrices = {
    immigration: {
      '35$': 35,
      '40$': 40,
      '50$': 50,
      '300$': 300,
    },
    emigration: {
      '50$': 50,
      '300$': 300,
    },
    pickupVehicle: {
      no: 0,
      '4_seat': 20,
      '7_seat': 25,
      'limousine_7_seat': 50,
    },
    pickupAtExit: 60,
    completeWithin15min: 15,
  };

  // Sync coupon state when bookingData.coupon changes (e.g., when navigating between steps)
  useEffect(() => {
    const storedCoupon = bookingData?.coupon;
    if (storedCoupon?.appliedCoupon) {
      // Restore coupon from bookingData
      setAppliedCoupon(storedCoupon.appliedCoupon);
      setCouponError('');
    } else if (storedCoupon === null) {
      // Explicitly cleared
      setAppliedCoupon(null);
      setCouponCode('');
      setCouponError('');
    }
  }, [bookingData?.coupon]);

  // Initialize payment method on mount if not set
  useEffect(() => {
    if (!bookingData?.payment_method && paymentMethod === 'online_credit') {
      // Save default payment method to bookingData on initial mount
      if (onCouponApply) {
        onCouponApply({ payment_method: 'online_credit' });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync payment method from bookingData
  useEffect(() => {
    if (bookingData?.payment_method) {
      setPaymentMethod(bookingData.payment_method);
    }
  }, [bookingData?.payment_method]);

  useEffect(() => {
    if (isCalculatingRef.current) return;
    isCalculatingRef.current = true;

    let calculatedSubtotal = 0;

    // Immigration package price
    if (bookingData?.immigration?.immigration_package) {
      const price = packagePrices.immigration[bookingData.immigration.immigration_package] || 0;
      calculatedSubtotal += price;
    }

    // Emigration package price
    if (bookingData?.emigration?.emigration_package) {
      const price = packagePrices.emigration[bookingData.emigration.emigration_package] || 0;
      calculatedSubtotal += price;
    }

    // Pickup vehicle
    if (bookingData?.immigration?.pickup_vehicle_using) {
      const price = packagePrices.pickupVehicle[bookingData.immigration.pickup_vehicle_using] || 0;
      calculatedSubtotal += price;
    }

    // Pickup at exit
    if (bookingData?.immigration?.pickup_at_airplain_exit) {
      calculatedSubtotal += packagePrices.pickupAtExit;
    }

    // Complete within 15 min
    if (bookingData?.immigration?.complete_within_15min) {
      calculatedSubtotal += packagePrices.completeWithin15min;
    }

    // Apply coupon discount
    let discount = 0;
    if (appliedCoupon) {
      if (appliedCoupon.type === 'value_discount') {
        discount = appliedCoupon.discount;
      } else if (appliedCoupon.type === 'percent_discount') {
        discount = (calculatedSubtotal * appliedCoupon.discount) / 100;
      }
    }

    const afterDiscount = Math.max(0, calculatedSubtotal - discount);
    const calculatedVat = afterDiscount * 0.08; // 8% VAT
    const calculatedTotal = afterDiscount + calculatedVat;

    setSubtotal(calculatedSubtotal);
    setVat(calculatedVat);
    setTotal(calculatedTotal);

    // Update parent component only if callback exists and values changed
    if (onCouponApply) {
      const priceData = {
        sub_price: calculatedSubtotal,
        vat_price: calculatedVat,
        total_price: calculatedTotal,
        coupon_id: appliedCoupon?.id || null,
        // Preserve existing coupon data if present
        coupon: bookingData?.coupon || (appliedCoupon ? {
          code: couponCode,
          appliedCoupon: appliedCoupon,
        } : null),
      };
      // Use requestAnimationFrame to avoid infinite loop
      requestAnimationFrame(() => {
        onCouponApply(priceData);
        isCalculatingRef.current = false;
      });
    } else {
      isCalculatingRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    bookingData?.immigration?.immigration_package,
    bookingData?.immigration?.pickup_vehicle_using,
    bookingData?.immigration?.pickup_at_airplain_exit,
    bookingData?.immigration?.complete_within_15min,
    bookingData?.emigration?.emigration_package,
    appliedCoupon?.id,
    appliedCoupon?.type,
    appliedCoupon?.discount,
  ]);

  const handleCouponApply = async () => {
    const rawCode = couponCode.trim();
    const normalizedCode = rawCode.toUpperCase();

    if (!rawCode) {
      setCouponError('無効なクーポン。');
      setCouponCode(''); // Clear input
      return;
    }

    // Prevent applying a coupon if one is already applied
    if (appliedCoupon) {
      setCouponError('既にクーポンが適用されています。新しいクーポンを適用するには、まず現在のクーポンを削除してください。');
      setCouponCode(''); // Clear input
      return;
    }

    // Clear input immediately regardless of result
    setCouponCode('');

    // Prevent applying the same coupon multiple times in this session
    if (usedCouponCodes.includes(normalizedCode)) {
      setCouponError('このクーポンは複数回適用できません。');
      return;
    }

    try {
      const response = await validateCoupon(normalizedCode);
      if (response.valid) {
        const coupon = response.coupon;
        setAppliedCoupon(coupon);
        setCouponError('');
        setUsedCouponCodes(prev => (prev.includes(normalizedCode) ? prev : [...prev, normalizedCode]));

        // Store coupon in bookingData for persistence across steps
        if (onCouponApply) {
          onCouponApply({
            coupon: {
              code: normalizedCode,
              appliedCoupon: coupon,
            },
          });
        }
      } else {
        setCouponError('無効なクーポン。');
      }
    } catch (err) {
      // Backend error or invalid coupon; show message but keep existing coupon
      const errorMessage = err.response?.data?.message || '無効なクーポン。';

      // Handle specific error messages
      if (errorMessage.includes('Coupon code not found') || errorMessage.includes('not found')) {
        setCouponError('無効なクーポン。');
      } else if (errorMessage.includes('expired') || errorMessage.includes('Coupon has expired')) {
        setCouponError('無効なクーポンです。');
      } else {
        setCouponError('無効なクーポン。');
      }
    }
  };

  const handleCouponRemove = () => {
    setCouponCode('');
    setAppliedCoupon(null);
    setCouponError('');
    setUsedCouponCodes([]);

    // Remove coupon from bookingData
    if (onCouponApply) {
      onCouponApply({
        coupon: null,
        coupon_id: null,
      });
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#f0f8ff] border-t-1 border-black-200 shadow-lg z-40">
      <div className="max-w-[1140px] mx-auto px-4 py-2 h-38 max-[700px]:h-44">
        <div className="flex flex-col">
          <div className="flex flex-wrap justify-between items-start">
            {/* 仮計算 */}
            <div className="flex flex-col items-start">
              <span className="text-base text-black font-bold">仮計算</span>
              <span className="text-base font-regular text-[#ff0000]">${subtotal.toFixed(2)}</span>
            </div>

            {/* クーポン Section */}
            <div className="relative flex flex-col gap-2 min-h-[70px]">
              <div className="flex items-center gap-2">
                <span className="text-base text-black font-bold">クーポン</span>
                <input
                  type="text"
                  placeholder=""
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value);
                    // Clear error when user starts typing
                    if (couponError) {
                      setCouponError('');
                    }
                  }}
                  disabled={!!appliedCoupon}
                  className="w-24 px-3 py-2 bg-[#a3e7a3] border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                />

                {/* when bg-[#01ae00] hover:bg-gray-300*/}
                <button
                  onClick={handleCouponApply}
                  disabled={couponCode.trim() === '' || !!appliedCoupon}
                  className="px-3 py-2 bg-[#01ae00] text-white rounded-md hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
                >
                  適用
                </button>
              </div>

              {/* Applied coupon info - show below input/button */}
              {appliedCoupon && (
                <button
                  onClick={handleCouponRemove}
                  className="flex items-center gap-3 font-semibold text-[#015cc8] border-b border-dashed border-[#015cc8] w-fit"
                >
                  <span className="flex items-center justify-center w-4 h-4 font-bold rounded-full border-[1.5px] border-[#a42021] text-[#a42021] text-base">
                    ×
                  </span>
                  <span>{appliedCoupon.name}</span>
                  <span className="ml-6 ">-{`$${appliedCoupon.discount.toFixed(2)}`}</span>
                </button>
              )}

              {/* Error message - absolutely positioned, doesn't affect layout */}
              {couponError && (
                <div className="absolute top-[70%] px-1 bg-[#fff9f9] border border-[1px] border-[#c02b0b] w-38 text-blue-600 text-sm font-medium whitespace-pre-line z-10">
                  {couponError}
                </div>
              )}
            </div>

            {/* 税金 */}
            <div className="flex items-center gap-2">
              <span className="text-base text-black font-bold">税金</span>
              <span className="text-base font-regular text-[#ff0000]">${vat.toFixed(2)}</span>
            </div>

            {/* 合計 */}
            <div className="flex items-center gap-2">
              <span className="text-base text-black font-bold">合計</span>
              <span className="bg-[#a3e7a3] rounded-md w-24 p-2 text-center ">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Payment Method Section and Action Button in flex-row */}
          {primaryActionLabel && onPrimaryAction && (
            <div className="flex flex-row items-center justify-between gap-4">
              {/* Payment Method Section */}
              <div className="flex items-center gap-4 flex-1">
                <label className="text-base font-bold text-black whitespace-nowrap">支払方法</label>
                <fieldset className="flex gap-5">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="payment_method"
                      value="cash"
                      checked={paymentMethod === 'cash'}
                      onChange={(e) => {
                        setPaymentMethod(e.target.value);
                        if (onCouponApply) {
                          onCouponApply({ payment_method: e.target.value });
                        }
                      }}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:outline-none cursor-pointer"
                    />
                    <span className="ml-3 text-base text-black">現金払い</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="payment_method"
                      value="online_credit"
                      checked={paymentMethod === 'online_credit'}
                      onChange={(e) => {
                        setPaymentMethod(e.target.value);
                        if (onCouponApply) {
                          onCouponApply({ payment_method: e.target.value });
                        }
                      }}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:outline-none cursor-pointer"
                    />
                    <span className="ml-3 text-base text-black">オンラインでクレジット決済</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="payment_method"
                      value="vietnam_bank_transfer"
                      checked={paymentMethod === 'vietnam_bank_transfer'}
                      onChange={(e) => {
                        setPaymentMethod(e.target.value);
                        if (onCouponApply) {
                          onCouponApply({ payment_method: e.target.value });
                        }
                      }}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:outline-none cursor-pointer"
                    />
                    <span className="ml-3 text-base text-black">ベトナム口座振込</span>
                  </label>
                </fieldset>
              </div>

              <button
                onClick={onPrimaryAction}
                disabled={primaryActionDisabled}
                className="px-6 py-3 bg-[#01ae00] text-white rounded-full font-medium hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-base disabled:outline-none whitespace-nowrap"
              >
                {primaryActionLabel}
              </button>
            </div>
          )}

          {/* Payment Method Section when no action button */}
          {(!primaryActionLabel || !onPrimaryAction) && (
            <div className="w-full flex justify-center gap-20">
              <label className="block text-base font-bold text-black mb-2 text-center">支払方法</label>
              <fieldset className="flex justify-center gap-5">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="payment_method"
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={(e) => {
                      setPaymentMethod(e.target.value);
                      if (onCouponApply) {
                        onCouponApply({ payment_method: e.target.value });
                      }
                    }}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:outline-none cursor-pointer"
                  />
                  <span className="ml-3 text-base text-black">現金払い</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="payment_method"
                    value="online_credit"
                    checked={paymentMethod === 'online_credit'}
                    onChange={(e) => {
                      setPaymentMethod(e.target.value);
                      if (onCouponApply) {
                        onCouponApply({ payment_method: e.target.value });
                      }
                    }}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:outline-none cursor-pointer"
                  />
                  <span className="ml-3 text-base text-black">オンラインでクレジット決済</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="payment_method"
                    value="vietnam_bank_transfer"
                    checked={paymentMethod === 'vietnam_bank_transfer'}
                    onChange={(e) => {
                      setPaymentMethod(e.target.value);
                      if (onCouponApply) {
                        onCouponApply({ payment_method: e.target.value });
                      }
                    }}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:outline-none cursor-pointer"
                  />
                  <span className="ml-3 text-base text-black">ベトナム口座振込</span>
                </label>
              </fieldset>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PriceBar;
