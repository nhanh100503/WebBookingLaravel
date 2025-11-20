import api from './api';

export const createBooking = async (bookingData) => {
  const response = await api.post('/api/bookings', bookingData);
  return response.data;
};

export const validateCoupon = async (couponCode) => {
  const response = await api.get(`/api/coupons/validate/${couponCode}`);
  return response.data;
};

export const getBooking = async (bookingId) => {
  const response = await api.get(`/api/bookings/${bookingId}`);
  return response.data;
};

