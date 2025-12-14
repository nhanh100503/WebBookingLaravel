import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BookingStep1 from './components/BookingStep1';
import BookingStep2 from './components/BookingStep2';
import BookingStep3 from './components/BookingStep3';
import BookingSuccess from './components/BookingSuccess';
import LineInquiry from './components/LineInquiry';
import Footer from './components/Footer';
import './App.css';

const STEP_STORAGE_KEY = 'bookingStep';

const getDefaultBookingData = () => ({
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

function App() {
  // bookingData is kept purely in React state; we do NOT persist it to localStorage.
  const [bookingData, setBookingData] = useState(getDefaultBookingData);

  return (
    <Router>
      <LineInquiry />
      <div className="w-[90vw] mx-20 max-[1150px]:w-[100vw] max-[1150px]:mx-0">
        <div className="flex flex-wrap justify-center w-[90vw] mx-auto mb-8 overflow-hidden max-[1150px]:w-[96vw]">
          <img src="/uploads/vjp-flight-booking-banner.jpg" alt="" />
        </div>
        <div className="text-blue-800 flex flex-start w-[90vw] mx-auto mb-8 font-bold hover:underline max-[1150px]:w-[96vw]">
          <a href="https://vietjapan.vip/book-domestic/" target="_blank" rel="noopener noreferrer">
            ベトナム国内線ファストトラックの予約はこちら＞＞
          </a>
        </div>
        <div className="App">
          <Routes>
            <Route path="/" element={<Navigate to="/book-now/" replace />} />
            <Route
              path="/book-now/"
              element={
                <BookingStepRouter
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
      </div>
      <Footer />
    </Router>
  );
}

// Router component to handle step routing with internal state
function BookingStepRouter({ bookingData, setBookingData }) {
  const [currentStep, setCurrentStep] = useState(() => {
    // Load step from localStorage on mount
    const saved = localStorage.getItem(STEP_STORAGE_KEY);
    return saved ? parseInt(saved) : 1;
  });

  // Save step to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STEP_STORAGE_KEY, currentStep.toString());
  }, [currentStep]);

  const handleNextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  switch (currentStep) {
    case 1:
      return (
        <BookingStep1
          bookingData={bookingData}
          setBookingData={setBookingData}
          onNextStep={handleNextStep}
        />
      );
    case 2:
      return (
        <BookingStep2
          bookingData={bookingData}
          setBookingData={setBookingData}
          onNextStep={handleNextStep}
          onPrevStep={handlePrevStep}
        />
      );
    case 3:
      return (
        <BookingStep3
          bookingData={bookingData}
          onPrevStep={handlePrevStep}
        />
      );
    default:
      setCurrentStep(1);
      return null;
  }
}

export default App;
