# Data Flow Between Booking Steps

This document explains how data (coupon, immigration/emigration packages, and user information) is passed between booking steps.

## Overview

Data flows through a **central state** (`bookingData`) managed in `App.jsx` and passed as props to each step component. Each step updates this state before navigating to the next step.

## 1. Central State Management (App.jsx)

**Location:** `flight-booking-frontend/src/App.jsx`

The `bookingData` state is initialized with:
```javascript
const [bookingData, setBookingData] = useState({
  type: null,                    // 'immigration', 'emigration', or 'both'
  immigration: null,             // Immigration package data
  emigration: null,             // Emigration package data
  passport: null,                // User passport information
  contact: '',                   // LINE contact preference
  survey_channel: '',            // How user found the service
  first_name: '',                // User first name
  last_name: '',                 // User last name
  phone_num: '',                 // User phone number
  email: '',                     // User email
  email_cc: '',                  // CC email
  company_name: '',              // Company name
  referer_name: '',             // Referrer name
  service_price: 0,              // Service price
  sub_price: 0,                  // Subtotal
  vat_price: 0,                 // VAT amount
  total_price: 0,               // Total price
  coupon_id: null,               // Coupon ID
  coupon: null,                 // Coupon data (code + appliedCoupon)
});
```

This state is passed to all step components via props:
- `<BookingStep1 bookingData={bookingData} setBookingData={setBookingData} />`
- `<BookingStep2 bookingData={bookingData} setBookingData={setBookingData} />`
- `<BookingStep3 bookingData={bookingData} setBookingData={setBookingData} />`

---

## 2. Step 1 → Step 2: Immigration & Emigration Package Data

**Location:** `flight-booking-frontend/src/components/BookingStep1.jsx`

### 2.1 Initializing Form Data from bookingData

When Step1 loads, it initializes local `formData` from `bookingData`:

```javascript
const [formData, setFormData] = useState({
  // Immigration data
  useImmigration: bookingData?.immigration ? true : false,
  immigration_package: bookingData?.immigration?.immigration_package || '35$',
  flight_reservation_num: bookingData?.immigration?.flight_reservation_num || '',
  flight_num: bookingData?.immigration?.flight_num || '',
  airport: bookingData?.immigration?.airport,
  arrival_date: bookingData?.immigration?.arrival_date || '',
  pickup_at_airplain_exit: bookingData?.immigration?.pickup_at_airplain_exit || false,
  complete_within_15min: bookingData?.immigration?.complete_within_15min || false,
  pickup_vehicle_using: bookingData?.immigration?.pickup_vehicle_using || 'no',
  phone_num_of_picker: bookingData?.immigration?.phone_num_of_picker || '',
  requirement: bookingData?.immigration?.requirement || '',
  
  // Emigration data
  useEmigration: bookingData?.emigration ? true : false,
  emigration_package: bookingData?.emigration?.emigration_package || '50$',
  // ... more emigration fields
});
```

### 2.2 Saving Data to bookingData (handleNext)

When user clicks "Enter User Information", `handleNext()` saves immigration/emigration data:

```javascript
const handleNext = () => {
  // ... validation ...
  
  const updatedData = {
    ...bookingData,  // Preserve existing data (including coupon)
    immigration: formData.useImmigration ? {
      immigration_package: formData.immigration_package,
      flight_reservation_num: formData.flight_reservation_num,
      flight_num: formData.flight_num,
      airport: formData.airport,
      arrival_date: formData.arrival_date,
      pickup_at_airplain_exit: formData.pickup_at_airplain_exit,
      complete_within_15min: formData.complete_within_15min,
      pickup_vehicle_using: formData.pickup_vehicle_using,
      phone_num_of_picker: formData.phone_num_of_picker,
      requirement: formData.requirement,
    } : null,
    emigration: formData.useEmigration ? {
      emigration_package: formData.emigration_package,
      flight_reservation_num: formData.emigration_flight_reservation_num,
      flight_num: formData.emigration_flight_num,
      airline_membership_num: formData.airline_membership_num,
      airport: formData.emigration_airport,
      seating_pref: formData.seating_pref,
      phone_num_of_picker: formData.emigration_phone_num_of_picker,
      requirement: formData.emigration_requirement,
      departure_date: formData.departure_date,
      meeting_time: formData.meeting_time,
    } : null,
    type: formData.useImmigration && formData.useEmigration ? 'both' :
          formData.useImmigration ? 'immigration' : 'emigration',
  };

  setBookingData(updatedData);  // Update central state
  navigate('/booking/step2');   // Navigate to next step
};
```

**Key Points:**
- Uses spread operator `...bookingData` to preserve existing data (including coupon)
- Sets `immigration` and `emigration` objects or `null` based on user selection
- Sets `type` field to indicate which services are selected
- Data persists in `bookingData` state across navigation

---

## 3. Step 2 → Step 3: User Information Data

**Location:** `flight-booking-frontend/src/components/BookingStep2.jsx`

### 3.1 Initializing Form Data from bookingData

Step2 initializes form data from `bookingData.passport`:

```javascript
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
```

### 3.2 Saving Data to bookingData (handleNext)

When user clicks "Reservation Information", `handleNext()` saves user information:

```javascript
const handleNext = () => {
  // ... validation ...
  
  const updatedData = {
    ...bookingData,  // Preserve immigration/emigration/coupon data
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
    // Also store at root level for API submission
    first_name: formData.first_name,
    last_name: formData.last_name,
    phone_num: formData.phone_num,
    email: formData.email,
    email_cc: formData.email_cc,
    company_name: formData.company_name,
    referer_name: formData.referer_name,
  };

  setBookingData(updatedData);  // Update central state
  navigate('/booking/step3');   // Navigate to next step
};
```

**Key Points:**
- Preserves `immigration`, `emigration`, and `coupon` data from Step1
- Stores user info in both `passport` object and root level (for API compatibility)
- Data persists across navigation

---

## 4. Coupon Data Flow (via PriceBar Component)

**Location:** `flight-booking-frontend/src/components/PriceBar.jsx`

### 4.1 Coupon Application

The `PriceBar` component is used in all steps and handles coupon application:

```javascript
// In PriceBar.jsx
const handleCouponApply = async () => {
  const response = await validateCoupon(couponCode);
  if (response.valid) {
    const coupon = response.coupon;
    setAppliedCoupon(coupon);
    
    // Store coupon in bookingData for persistence across steps
    if (onCouponApply) {
      onCouponApply({
        coupon: {
          code: couponCode.trim().toUpperCase(),
          appliedCoupon: coupon,
        },
      });
    }
  }
};
```

### 4.2 Price Calculation & Coupon Persistence

The `PriceBar` component calculates prices and updates `bookingData`:

```javascript
// In PriceBar.jsx useEffect
useEffect(() => {
  // Calculate subtotal from immigration/emigration packages
  let calculatedSubtotal = 0;
  // ... calculation logic ...
  
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
  const calculatedVat = afterDiscount * 0.08;
  const calculatedTotal = afterDiscount + calculatedVat;
  
  // Update parent component (bookingData)
  if (onCouponApply) {
    const priceData = {
      sub_price: calculatedSubtotal,
      vat_price: calculatedVat,
      total_price: calculatedTotal,
      coupon_id: appliedCoupon?.id || null,
      coupon: bookingData?.coupon || (appliedCoupon ? {
        code: couponCode,
        appliedCoupon: appliedCoupon,
      } : null),
    };
    onCouponApply(priceData);  // Updates bookingData via callback
  }
}, [/* dependencies */]);
```

### 4.3 Coupon Persistence Across Steps

**In BookingStep1.jsx:**
```javascript
const handlePriceUpdate = (priceData) => {
  setBookingData(prev => ({
    ...prev,
    ...priceData,  // Includes coupon, sub_price, vat_price, total_price
  }));
};

// PriceBar usage
<PriceBar
  bookingData={{
    ...bookingData,  // Includes existing coupon
    immigration: formData.useImmigration ? { ... } : null,
    emigration: formData.useEmigration ? { ... } : null,
  }}
  onCouponApply={handlePriceUpdate}  // Updates bookingData
/>
```

**In BookingStep2.jsx:**
```javascript
<PriceBar
  bookingData={bookingData}  // Already contains coupon from Step1
  onCouponApply={(priceData) => setBookingData(prev => ({ ...prev, ...priceData }))}
/>
```

**In BookingStep3.jsx:**
```javascript
<PriceBar
  bookingData={bookingData}  // Already contains coupon from previous steps
  onCouponApply={(priceData) => setBookingData(prev => ({ ...prev, ...priceData }))}
/>
```

**Key Points:**
- Coupon is stored in `bookingData.coupon` object with `code` and `appliedCoupon`
- `PriceBar` syncs coupon state from `bookingData` on mount (via `useEffect`)
- Coupon persists across all steps because `bookingData` is preserved
- Price calculations (sub_price, vat_price, total_price) are updated in `bookingData`

---

## 5. Data Persistence Summary

### What Persists Across Steps:

1. **Immigration Data** (from Step1):
   - Package selection, flight info, dates, options, etc.
   - Stored in: `bookingData.immigration`

2. **Emigration Data** (from Step1):
   - Package selection, flight info, dates, seating preferences, etc.
   - Stored in: `bookingData.emigration`

3. **Coupon Data** (from any step via PriceBar):
   - Coupon code and applied coupon object
   - Stored in: `bookingData.coupon`
   - Also: `bookingData.coupon_id`, `bookingData.sub_price`, `bookingData.vat_price`, `bookingData.total_price`

4. **User Information** (from Step2):
   - Passport details, contact preferences, survey channel
   - Stored in: `bookingData.passport` and root level fields

### How Data Persists:

- **React State**: `bookingData` state in `App.jsx` persists across route changes
- **Spread Operator**: Each step uses `...bookingData` to preserve existing data
- **No Local Storage**: Data is only in memory (lost on page refresh)

---

## 6. Step 3: Final Submission

**Location:** `flight-booking-frontend/src/components/BookingStep3.jsx`

Step3 reads all data from `bookingData` and submits to API:

```javascript
const handleSubmit = async () => {
  const submitData = {
    passport: {
      first_name: bookingData.passport.first_name,
      last_name: bookingData.passport.last_name,
      // ... all passport fields
    },
    type: bookingData.type,
    contact: bookingData.contact,
    survey_channel: bookingData.survey_channel,
    first_name: bookingData.first_name,
    // ... all booking fields
    service_price: bookingData.sub_price || 0,
    sub_price: bookingData.sub_price || 0,
    vat_price: bookingData.vat_price || 0,
    total_price: bookingData.total_price || 0,
    coupon_id: bookingData.coupon_id || null,
    immigration: bookingData.immigration ? { ... } : null,
    emigration: bookingData.emigration ? { ... } : null,
  };

  const response = await createBooking(submitData);
  navigate(`/booking/success/${response.data.id}`);
};
```

---

## Visual Flow Diagram

```
App.jsx (Central State)
    │
    ├─ bookingData state
    │   ├─ immigration: {...}
    │   ├─ emigration: {...}
    │   ├─ passport: {...}
    │   ├─ coupon: {...}
    │   └─ prices: {...}
    │
    ├─ Step1 Component
    │   ├─ Reads: bookingData.immigration, bookingData.emigration
    │   ├─ Updates: bookingData.immigration, bookingData.emigration, bookingData.type
    │   └─ PriceBar updates: bookingData.coupon, bookingData.sub_price, etc.
    │
    ├─ Step2 Component
    │   ├─ Reads: bookingData.passport, bookingData.contact, bookingData.survey_channel
    │   ├─ Updates: bookingData.passport, bookingData.contact, bookingData.survey_channel
    │   └─ PriceBar preserves: bookingData.coupon (from Step1)
    │
    └─ Step3 Component
        ├─ Reads: All bookingData fields
        └─ Submits: All data to API
```

---

## Key Code Locations

1. **Central State**: `flight-booking-frontend/src/App.jsx` (lines 10-29, 44-69)
2. **Step1 Data Save**: `flight-booking-frontend/src/components/BookingStep1.jsx` (lines 182-222)
3. **Step2 Data Save**: `flight-booking-frontend/src/components/BookingStep2.jsx` (lines 143-183)
4. **Step3 Data Read**: `flight-booking-frontend/src/components/BookingStep3.jsx` (lines 169-223)
5. **Coupon Handling**: `flight-booking-frontend/src/components/PriceBar.jsx` (lines 36-135, 137-193)
6. **Price Updates**: `flight-booking-frontend/src/components/BookingStep1.jsx` (lines 175-180, 817-833)

