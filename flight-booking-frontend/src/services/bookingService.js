import api from './api';

export const createBooking = async (bookingData) => {
  const response = await api.post('/bookings', bookingData);
  return response.data;
};

export const validateCoupon = async (couponCode) => {
  // Trim and encode the coupon code for URL
  const encodedCode = encodeURIComponent(couponCode.trim().toUpperCase());
  const response = await api.get(`/coupons/validate/${encodedCode}`);
  return response.data;
};

export const getBooking = async (bookingId) => {
  const response = await api.get(`/bookings/${bookingId}`);
  return response.data;
};

