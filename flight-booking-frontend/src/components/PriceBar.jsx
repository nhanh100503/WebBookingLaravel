import { useState, useEffect, useRef } from 'react';
import { validateCoupon } from '../services/bookingService';

const PriceBar = ({ bookingData, onCouponApply }) => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
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
      setCouponError('Please enter a coupon code');
      return;
    }

    try {
      const response = await validateCoupon(couponCode);
      if (response.valid) {
        setAppliedCoupon(response.coupon);
        setCouponError('');
      } else {
        setCouponError(response.message || 'Invalid coupon code');
        setAppliedCoupon(null);
      }
    } catch (error) {
      setCouponError(error.response?.data?.message || 'Invalid coupon');
      setAppliedCoupon(null);
    }
  };

  const handleCouponRemove = () => {
    setCouponCode('');
    setAppliedCoupon(null);
    setCouponError('');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-lg z-50">
      <div className="max-w-6xl mx-auto px-4 py-5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          {/* Coupon Section */}
          <div className="flex-1 min-w-[250px]">
            <div className="flex gap-2 items-center">
              <span className="text-sm text-gray-700 mr-2">Coupon</span>
              <input
                type="text"
                placeholder=""
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                disabled={!!appliedCoupon}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              {appliedCoupon ? (
                <button
                  onClick={handleCouponRemove}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                >
                  Remove
                </button>
              ) : (
                <button
                  onClick={handleCouponApply}
                  className="px-4 py-2 bg-[#a3e7a3] text-black rounded-md hover:bg-[#8fd88f] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium"
                >
                  Applicable
                </button>
              )}
            </div>
            {couponError && (
              <div className="text-red-600 text-xs mt-1">
                {couponError}
              </div>
            )}
            {appliedCoupon && (
              <div className="text-green-600 text-xs mt-1">
                Coupon "{appliedCoupon.name}" applied!
              </div>
            )}
          </div>

          {/* Price Summary */}
          <div className="flex gap-6 md:gap-8 items-center flex-wrap">
            <div className="text-right">
              <div className="text-sm text-gray-600">Preliminary Calculation</div>
              <div className="text-xl font-bold text-[#ff0000]">${subtotal.toFixed(2)}</div>
            </div>
            {appliedCoupon && (
              <div className="text-right">
                <div className="text-sm text-gray-600">Coupon</div>
                <div className="text-xl font-bold text-green-600">
                  -${(subtotal - (subtotal - (appliedCoupon.type === 'value_discount' ? appliedCoupon.discount : (subtotal * appliedCoupon.discount) / 100))).toFixed(2)}
                </div>
              </div>
            )}
            <div className="text-right">
              <div className="text-sm text-gray-600">Tax</div>
              <div className="text-xl font-bold text-[#ff0000]">${vat.toFixed(2)}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Total</div>
              <div className="text-2xl font-bold text-[#1362cb]">
                ${total.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceBar;
