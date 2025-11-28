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
  const [subtotal, setSubtotal] = useState(0);
  const [vat, setVat] = useState(0);
  const [total, setTotal] = useState(0);
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
      setCouponCode(storedCoupon.code || '');
      setCouponError('');
    } else if (storedCoupon === null) {
      // Explicitly cleared
      setAppliedCoupon(null);
      setCouponCode('');
      setCouponError('');
    }
  }, [bookingData?.coupon]);

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
    if (!couponCode.trim()) {
      setCouponError('無効なクーポン。');
      setCouponCode(''); // Clear input
      return;
    }

    try {
      const response = await validateCoupon(couponCode);
      if (response.valid) {
        const coupon = response.coupon;
        setAppliedCoupon(coupon);
        setCouponError('');

        // Store coupon in bookingData for persistence across steps
        if (onCouponApply) {
          onCouponApply({
            coupon: {
              code: couponCode.trim().toUpperCase(),
              appliedCoupon: coupon,
            },
          });
        }
      } else {
        // Invalid coupon: clear input and show error
        setCouponCode('');
        setCouponError('無効なクーポン。');
        setAppliedCoupon(null);
        // Clear coupon from bookingData if invalid
        if (onCouponApply) {
          onCouponApply({
            coupon: null,
          });
        }
      }
    } catch (err) {
      // Invalid coupon: clear input and show error
      setCouponCode('');
      setCouponError(err.response?.data?.message || '無効なクーポン。');
      setAppliedCoupon(null);
      // Clear coupon from bookingData on error
      if (onCouponApply) {
        onCouponApply({
          coupon: null,
        });
      }
    }
  };

  const handleCouponRemove = () => {
    setCouponCode('');
    setAppliedCoupon(null);
    setCouponError('');

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


      <div className="max-w-[1140px] mx-auto  px-4 py-2 h-40">

        <div className="flex flex-col">
          <div className="flex flex-wrap justify-around items-center mb-4">
            {/* 仮計算 */}
            <div className="flex items-center gap-8">
              <span className="text-base text-black">仮計算</span>
              <span className="text-xl font-bold text-[#ff0000]">${subtotal.toFixed(2)}</span>
            </div>

            {/* クーポン Section */}
            <div className="relative flex items-center gap-2">
              <span className="text-base text-black">クーポン</span>
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
                className="w-24 px-3 py-2 bg-[#a3e7a3] border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-base"
              />

              <button
                onClick={handleCouponApply}
                disabled={couponCode.trim() === '' || !!appliedCoupon}
                className="px-3 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
              >
                適用
              </button>
              {/* Error message - absolutely positioned, doesn't affect layout */}
              {couponError && (
                <div className="absolute top-full mt-1 px-2 py-1 bg-[#fff9f9] border border-[1px] border-[#000000] w-48 text-blue-600 text-base font-medium whitespace-nowrap z-10">
                  無効なクーポン。
                </div>
              )}
            </div>


            {/* 税金 */}
            <div className="flex items-center gap-2">
              <span className="text-base text-black">税金</span>
              <span className="text-xl font-bold text-[#ff0000]">${vat.toFixed(2)}</span>
            </div>


            {/* 合計 */}
            <div className="flex items-center gap-2">
              <span className="text-base text-black">合計</span>

              <span className="bg-[#a3e7a3] rounded-md w-24 p-2 text-center ">
                ${total.toFixed(2)}
              </span>
            </div>


          </div>

          {/* Applied coupon info - show when coupon is valid */}
          {appliedCoupon && (
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={handleCouponRemove}
                className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors font-medium text-base"
              >
                <i className="fa-solid fa-trash text-white text-sm" />
              </button>
              <div className="text-blue-600 flex flex-row gap-6 font-semibold">
                <div>{`${appliedCoupon.name}`}</div>
                <div>{`-$${appliedCoupon.discount.toFixed(2)}`}</div>
              </div>
            </div>
          )}

          {/* Primary action button (optional, e.g. Enter User Information) */}
          {primaryActionLabel && onPrimaryAction && (
            <div className="flex justify-center">
              <button
                onClick={onPrimaryAction}
                disabled={primaryActionDisabled}
                className="px-6 py-3 bg-[#01ae00] text-white rounded-full font-medium hover:bg-[#018800] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-base"
              >
                {primaryActionLabel}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PriceBar;
