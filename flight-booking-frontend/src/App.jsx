import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BookingStep1 from './components/BookingStep1';
import BookingStep2 from './components/BookingStep2';
import BookingStep3 from './components/BookingStep3';
import BookingSuccess from './components/BookingSuccess';
import './App.css';

function App() {
  const [bookingData, setBookingData] = useState({
    type: null,
    immigration: null,
    emigration: null,
    passport: null,
    contact: '',
    survey_channel: '',
    first_name: '',
    last_name: '',
    phone_num: '',
    email: '',
    email_cc: '',
    company_name: '',
    referer_name: '',
    service_price: 0,
    sub_price: 0,
    vat_price: 0,
    total_price: 0,
    coupon_id: null,
  });

  return (
    <Router>
      <div className="flex flex-wrap justify-center w-[90vw] mx-auto mb-8 rounded-lg overflow-hidden">
        <img src="/uploads/vjp-flight-booking-banner.jpg" alt="" />
      </div>
      <div className="text-blue-800 flex flex-start w-[90vw] mx-auto mb-8 font-bold hover:underline">
        <a href="https://vietjapan.vip/book-domestic/" target="_blank" rel="noopener noreferrer">
          Vietnam domestic fast track booking available here &gt;&gt;
        </a>
      </div>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/booking/step1" replace />} />
          <Route
            path="/booking/step1"
            element={
              <BookingStep1
                bookingData={bookingData}
                setBookingData={setBookingData}
              />
            }
          />
          <Route
            path="/booking/step2"
            element={
              <BookingStep2
                bookingData={bookingData}
                setBookingData={setBookingData}
              />
            }
          />
          <Route
            path="/booking/step3"
            element={
              <BookingStep3
                bookingData={bookingData}
                setBookingData={setBookingData}
              />
            }
          />
          <Route
            path="/booking/success/:id"
            element={<BookingSuccess />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
