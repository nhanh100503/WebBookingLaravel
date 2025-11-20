import { useParams, Link } from 'react-router-dom';

const BookingSuccess = () => {
  const { id } = useParams();

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
      <div style={{ padding: '40px', backgroundColor: '#d4edda', border: '1px solid #c3e6cb', borderRadius: '8px', marginBottom: '30px' }}>
        <h1 style={{ color: '#155724', marginBottom: '20px' }}>✓ Your Reservation Has Been Completed</h1>
        <p style={{ fontSize: '18px', color: '#155724', marginBottom: '10px' }}>
          Thank you for your booking!
        </p>
        {id && (
          <p style={{ fontSize: '16px', color: '#155724' }}>
            Booking ID: <strong>{id}</strong>
          </p>
        )}
      </div>

      <div style={{ padding: '30px', backgroundColor: '#f8f9fa', borderRadius: '8px', marginBottom: '30px' }}>
        <h2>What's Next?</h2>
        <p style={{ marginBottom: '20px' }}>
          You will receive a confirmation email with all the details of your booking.
        </p>
        <p style={{ marginBottom: '20px' }}>
          For any questions or changes to your reservation, please contact us:
        </p>
        <div style={{ marginTop: '20px' }}>
          <p><strong>LINE OA:</strong> Add our official account</p>
          <p><strong>Inquiry Form:</strong> Use our contact form</p>
          <p><strong>Email:</strong> support@vietjapan.vip</p>
        </div>
      </div>

      <div style={{ marginTop: '30px' }}>
        <Link
          to="/booking/step1"
          style={{
            padding: '12px 24px',
            backgroundColor: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            display: 'inline-block',
            marginRight: '10px',
          }}
        >
          Make Another Booking
        </Link>
        <Link
          to="/"
          style={{
            padding: '12px 24px',
            backgroundColor: '#6c757d',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            display: 'inline-block',
          }}
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default BookingSuccess;

