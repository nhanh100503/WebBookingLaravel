import { useParams, Link } from 'react-router-dom';

const BookingSuccess = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Reservation Confirmation Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-4">Your Reservation Has Been Completed.</h1>
          <p className="text-lg text-gray-700 mb-4">
            Thank you for applying for our fast track service.
          </p>
          <p className="text-base text-gray-700 mb-6">
            Please wait a moment as our staff will check your reservation details and process your request promptly.
          </p>

          {id && (
            <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-base text-gray-700">
                <strong>Booking ID:</strong> <span className="font-mono text-lg">{id}</span>
              </p>
            </div>
          )}

          {/* Contact Information */}
          <div className="mb-8 p-6 bg-gray-50 border border-gray-200 rounded-lg">
            <h2 className="text-xl font-bold text-black mb-4">If you have any questions or requests, please feel free to contact us using one of the following methods.</h2>
            <div className="space-y-2 text-base text-gray-700">
              <p>
                <strong>• LINE OA:</strong>{' '}
                <a
                  href="https://page.line.me/vjp.fasttrack"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  https://page.line.me/vjp.fasttrack
                </a>
              </p>
              <p>
                <strong>• Inquiry form:</strong>{' '}
                <a
                  href="https://vietjapan.vip/contact/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  https://vietjapan.vip/contact/
                </a>
              </p>
              <p>
                <strong>• Email:</strong>{' '}
                <a
                  href="mailto:fasttrack@vietjapan.vip"
                  className="text-blue-600 hover:underline"
                >
                  fasttrack@vietjapan.vip
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* VJP-AiTrans Section */}
        <div className="mb-8 p-6 bg-white border-2 border-green-200 rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold text-black mb-4">A gift for VJP Fast Track customers.</h2>

          <p className="text-base text-gray-700 mb-6">
            We are pleased to announce that we are offering a free AI translation tool for Japanese, Vietnamese, and English that can be used on LINE.
          </p>

          <div className="mb-6">
            <h3 className="text-xl font-bold text-black mb-3">★What is VJP-AiTrans VN-JP-EN</h3>
            <p className="text-base text-gray-700 mb-4">
              "VJP-AiTrans VN-JP-EN" is an automatic translation LINE chatbot that supports Japanese, Vietnamese, and English. It allows you to easily translate on LINE and can be used in a variety of situations during your stay in Vietnam.
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-bold text-black mb-3">★It's very easy to use!★</h3>

            <div className="mb-4">
              <h4 className="text-lg font-semibold text-black mb-2">1. How to add "VJP-AiTrans" to LINE</h4>

              <div className="flex flex-col md:flex-row gap-6 items-start mb-4">
                <div className="flex-shrink-0">
                  <div className="w-48 h-48 bg-white border-2 border-green-300 rounded-lg flex items-center justify-center p-2">
                    <img
                      src="/uploads/Line-QR.png"
                      alt="VJP-AiTrans LINE QR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                <div className="flex-1">
                  <p className="text-base text-gray-700 mb-2">
                    <strong>①:</strong> Scan the attached QR code for LINE
                  </p>
                  <p className="text-base text-gray-700">
                    <strong>Method 2:</strong> Access the following URL for LINE chat:{' '}
                    <a
                      href="https://page.line.me/vnjpen"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      https://page.line.me/vnjpen
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-base text-gray-700 mb-2">
                <strong>2.</strong> Simply send a message in Japanese and the translation will be displayed automatically.
              </p>
              <p className="text-base text-gray-700 mb-2">
                <strong>3.</strong> Add it to a group chat to smoothly communicate with relevant parties.
              </p>
              <p className="text-sm text-blue-600 italic">
                *The English translation will also be displayed at the same time, so you can check the translation with peace of mind.
              </p>
            </div>

            <div className="mb-4">
              <p className="text-base text-gray-700">
                <strong>Here is an introduction to how to use the automatic translation chatbot:</strong>{' '}
                <a
                  href="https://www.youtube.com/shorts/S2muz2f684c"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  https://www.youtube.com/shorts/S2muz2f684c
                </a>
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-bold text-black mb-3">★ Useful in the following situations! ★</h3>
            <ul className="list-disc list-inside space-y-2 text-base text-gray-700 ml-4">
              <li>Communication at airports, hotels, and restaurants</li>
              <li>Chat conversations with local staff</li>
              <li>Group communication in business settings</li>
              <li>Everyday chats with Vietnamese acquaintances</li>
              <li>As your own personal translation tool, etc.</li>
            </ul>
          </div>

          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-base text-gray-700 mb-2">
              Take this opportunity to try out "VJP-AiTrans" and enjoy a more comfortable and safe stay in Vietnam.
            </p>
            <p className="text-base text-gray-700">
              If you have any questions, please feel free to contact us via our official LINE account.
            </p>
            <p className="text-base text-gray-700 mt-2">
              <strong>• LINE OA Inquiries:</strong>{' '}
              <a
                href="https://page.line.me/vjp.fasttrack"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                https://page.line.me/vjp.fasttrack
              </a>
            </p>
            <p className="text-base text-gray-700 mt-2">
              Thank you for your cooperation.
            </p>
          </div>
        </div>

        {/* Booking Section */}
        <div className="mb-8 p-6 bg-white border border-gray-200 rounded-lg">
          <h2 className="text-2xl font-bold text-black mb-6 text-center">
            Book Your Vietnam Fast Track International And Domestic Flights Now Here
          </h2>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
              to="/booking/step1"
              className="px-8 py-4 bg-[#01ae00] text-white rounded-full font-medium hover:bg-[#018800] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors text-center"
            >
              Open Vietnam Entry/Exit Fast Track Booking Form
            </Link>
            <a
              href="https://vietjapan.vip/book-domestic/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-[#01ae00] text-white rounded-full font-medium hover:bg-[#018800] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors text-center"
            >
              Open Vietnam Domestic Fast Track Booking Form
            </a>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex justify-center gap-4 mt-8">
          <Link
            to="/booking/step1"
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
          >
            Make Another Booking
          </Link>
          <Link
            to="/"
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
