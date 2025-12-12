import React, { useState, useRef, useEffect } from 'react';

const Footer = () => {
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const [submenuStyle, setSubmenuStyle] = useState({});
  const submenuRef = useRef(null);
  const menuItemRef = useRef(null);

  // Calculate submenu position based on viewport
  useEffect(() => {
    if (isSubmenuOpen && menuItemRef.current) {
      requestAnimationFrame(() => {
        if (menuItemRef.current) {
          const menuItemRect = menuItemRef.current.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          const estimatedSubmenuHeight = 250; // Approximate height of submenu

          // Check if menu item is near bottom of viewport
          const spaceBelow = viewportHeight - menuItemRect.bottom;
          const spaceAbove = menuItemRect.top;

          let topPosition = 0;

          // If not enough space below but more space above, position submenu higher
          if (spaceBelow < estimatedSubmenuHeight && spaceAbove > spaceBelow) {
            // Position submenu so it fits in viewport, aligning bottom with menu item
            topPosition = -(estimatedSubmenuHeight - spaceBelow);
          } else {
            // Default: align top of submenu with top of menu item (slightly up)
            topPosition = -8;
          }

          setSubmenuStyle({ top: `${topPosition}px` });
        }
      });
    }
  }, [isSubmenuOpen]);
  return (
    <footer className="w-[100vw] bg-[#1a3e92] text-white mt-10">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">
          {/* Logo and Social Media Section */}
          <div className="col-span-1">
            <div className="mb-4">
              {/* Logo placeholder - replace with actual logo image */}
              <div className="flex items-center gap-2 mb-2">
                <div className="w-52 h-34 rounded flex items-center justify-center">
                  <img src="/uploads/VJP-FastTrack-Logo.png" alt="VJP Flight Booking Logo" />
                </div>
              </div>
            </div>
            {/* Social Media Icons */}
            <div className="flex flex-wrap gap-2">
              <a href="https://www.facebook.com/vietjapan.vip" target="_blank" className="w-12 h-12 bg-[#3c5998] rounded-[20%] flex items-center justify-center transition-colors">
                <svg className="p-3 text-white fill-current" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"></path></svg>
              </a>
              <a href="https://www.youtube.com/@vietnamfasttrack" target="_blank" className="w-12 h-12 bg-red-600 rounded-[20%] flex items-center justify-center transition-colors">
                <svg className="p-3 text-white fill-current" viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"></path></svg>
              </a>
              <a href="https://x.com/VietJapanVip" target="_blank" className="w-12 h-12 bg-black rounded-[20%] flex items-center justify-center transition-colors">
                <svg className="p-3 text-white fill-current" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"></path></svg>
              </a>
              <a href="https://www.instagram.com/vietjapan.vip/" target="_blank" className="w-12 h-12 bg-gray-800 rounded-[20%] flex items-center justify-center transition-colors">
                <svg className="p-3 text-white fill-current" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path></svg>
              </a>
              <a href="https://www.threads.com/@vietjapan.vip" target="_blank" className="w-12 h-12 bg-black rounded-[20%] flex items-center justify-center transition-colors">
                <svg className="p-3 text-white fill-current" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M331.5 235.7c2.2 .9 4.2 1.9 6.3 2.8c29.2 14.1 50.6 35.2 61.8 61.4c15.7 36.5 17.2 95.8-30.3 143.2c-36.2 36.2-80.3 52.5-142.6 53h-.3c-70.2-.5-124.1-24.1-160.4-70.2c-32.3-41-48.9-98.1-49.5-169.6V256v-.2C17 184.3 33.6 127.2 65.9 86.2C102.2 40.1 156.2 16.5 226.4 16h.3c70.3 .5 124.9 24 162.3 69.9c18.4 22.7 32 50 40.6 81.7l-40.4 10.8c-7.1-25.8-17.8-47.8-32.2-65.4c-29.2-35.8-73-54.2-130.5-54.6c-57 .5-100.1 18.8-128.2 54.4C72.1 146.1 58.5 194.3 58 256c.5 61.7 14.1 109.9 40.3 143.3c28 35.6 71.2 53.9 128.2 54.4c51.4-.4 85.4-12.6 113.7-40.9c32.3-32.2 31.7-71.8 21.4-95.9c-6.1-14.2-17.1-26-31.9-34.9c-3.7 26.9-11.8 48.3-24.7 64.8c-17.1 21.8-41.4 33.6-72.7 35.3c-23.6 1.3-46.3-4.4-63.9-16c-20.8-13.8-33-34.8-34.3-59.3c-2.5-48.3 35.7-83 95.2-86.4c21.1-1.2 40.9-.3 59.2 2.8c-2.4-14.8-7.3-26.6-14.6-35.2c-10-11.7-25.6-17.7-46.2-17.8H227c-16.6 0-39 4.6-53.3 26.3l-34.4-23.6c19.2-29.1 50.3-45.1 87.8-45.1h.8c62.6 .4 99.9 39.5 103.7 107.7l-.2 .2zm-156 68.8c1.3 25.1 28.4 36.8 54.6 35.3c25.6-1.4 54.6-11.4 59.5-73.2c-13.2-2.9-27.8-4.4-43.4-4.4c-4.8 0-9.6 .1-14.4 .4c-42.9 2.4-57.2 23.2-56.2 41.8l-.1 .1z"></path></svg>
              </a>
            </div>
          </div>

          {/* Menu Column */}
          <div className="col-span-1">
            <h3 className="text-lg mb-4">メニュー</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://vietjapan.vip/" className="hover:text-[#7FD67F]">ホーム</a>
              </li>
              <li
                ref={menuItemRef}
                className="relative"
                onMouseEnter={() => setIsSubmenuOpen(true)}
                onMouseLeave={() => setIsSubmenuOpen(false)}
              >
                <a
                  href="https://vietjapan.vip/about-vjp-fasttrack"
                  className="flex items-center gap-1 hover:text-[#7FD67F] group"
                >
                  VJPファストトラ
                  <br />
                  ックとは
                  <span className="sub-arrow">
                    <svg className={`w-3 h-3 fill-current transition-colors ${isSubmenuOpen ? 'text-[#7FD67F]' : 'group-hover:text-[#7FD67F]'}`} viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg">
                      <path d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z"></path>
                    </svg>
                  </span>
                </a>
                {isSubmenuOpen && (
                  <ul
                    ref={submenuRef}
                    className="absolute left-full ml-2 bg-white text-black min-w-[260px] max-w-[400px] py-2 z-50 shadow-lg"
                    style={submenuStyle}
                    onMouseEnter={() => setIsSubmenuOpen(true)}
                    onMouseLeave={() => setIsSubmenuOpen(false)}
                  >
                    <li>
                      <a
                        href="https://vietjapan.vip/tan-son-nhat-entry-vip-fasttrack/"
                        className="block px-4 py-2 text-sm hover:text-[#7FD67F] hover:bg-gray-100"
                      >
                        【入国専用】ホーチミン・タンソンニャット空港VIPファストトラック｜ベトナム入国を最速で｜日本語サポート
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://vietjapan.vip/%e3%80%90%e5%87%ba%e5%9b%bd%e5%b0%82%e7%94%a8%e3%80%91%e3%83%9b%e3%83%bc%e3%83%81%e3%83%9f%e3%83%b3%e3%83%bb%e3%82%bf%e3%83%b3%e3%82%bd%e3%83%b3%e3%83%8b%e3%83%a3%e3%83%83%e3%83%88%e7%a9%ba%e6%b8%afvi/"
                        className="block px-4 py-2 text-sm hover:text-[#7FD67F] hover:bg-gray-100"
                      >
                        【出国専用】ホーチミン・タンソンニャット空港VIPファストトラック｜チェックインをスムーズに｜日本語サポート
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://vietjapan.vip/tan-son-nhat-airport-fasttrack/"
                        className="block px-4 py-2 text-sm hover:text-[#7FD67F] hover:bg-gray-100"
                      >
                        タンソンニャットファストトラックとは
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://vietjapan.vip/hanoi-noibai-fasttrack/"
                        className="block px-4 py-2 text-sm hover:text-[#7FD67F] hover:bg-gray-100"
                      >
                        ハノイ・ノイバイファストトラックとは
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://vietjapan.vip/danang-fasttrack/"
                        className="block px-4 py-2 text-sm hover:text-[#7FD67F] hover:bg-gray-100"
                      >
                        ダナンファストトラックとは
                      </a>
                    </li>
                  </ul>
                )}
              </li>
              <li>
                <a href="https://vietjapan.vip/contact/" className="hover:text-[#7FD67F]">お問い合わせ</a>
              </li>
              <li>
                <a href="https://vietjapan.vip/faq/" className="hover:text-[#7FD67F]">よくあるご質問</a>
              </li>
              <li>
                <a href="https://vietjapan.vip/news/" className="hover:text-[#7FD67F]">お知らせ</a>
              </li>
              <li>
                <a href="https://vietjapan.vip/blog/" className="hover:text-[#7FD67F]">ブログ</a>
              </li>
            </ul>
          </div>

          {/* Service Introduction Column */}
          <div className="col-span-1">
            <h3 className="text-lg  mb-4">ベトナム国際空港ファストトラックのご紹介</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://vietjapan.vip/tan-son-nhat-entry-vip-fasttrack/" className="hover:text-[#7FD67F]">[入国専用] ホーチミン・タンソンニャット空港VIPファストトラック | ベトナム入国を最速で | 日本語サポート</a>
              </li>
              <li>
                <a href="https://vietjapan.vip/%e3%80%90%e5%87%ba%e5%9b%bd%e5%b0%82%e7%94%a8%e3%80%91%e3%83%9b%e3%83%bc%e3%83%81%e3%83%9f%e3%83%b3%e3%83%bb%e3%82%bf%e3%83%b3%e3%82%bd%e3%83%b3%e3%83%8b%e3%83%a3%e3%83%83%e3%83%88%e7%a9%ba%e6%b8%afvi/" className="hover:text-[#7FD67F]">[出国専用] ホーチミン・タンソンニャット空港VIPファストトラック | チェックインをスムーズに | 日本語サポート</a>
              </li>
              <li>
                <a href="https://vietjapan.vip/tan-son-nhat-airport-fasttrack/" className="hover:text-[#7FD67F]">ホーチミン・タンソンニャット国際空港ファストトラック</a>
              </li>
              <li>
                <a href="https://vietjapan.vip/hanoi-noibai-fasttrack/" className="hover:text-[#7FD67F]">ハノイ・ノイバイ国際空港ファストトラック</a>
              </li>
              <li>
                <a href="https://vietjapan.vip/danang-fasttrack/" className="hover:text-[#7FD67F]">ダナン国際空港ファストトラック</a>
              </li>
            </ul>
          </div>

          {/* Information Policy Column */}
          <div className="col-span-1">
            <h3 className="text-lg  mb-4">情報取り扱い方針</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://vietjapan.vip/privacy/" rel="privacy-policy" className="hover:text-[#7FD67F]">個人情報の取り扱い</a>
              </li>
              <li>
                <a href="https://vietjapan.vip/security/" rel="security-policy" className="hover:text-[#7FD67F]">情報セキュリティ基本方針</a>
              </li>
              <li>
                <a href="https://vietjapan.vip/privacy/" rel="privacy-policy" className="hover:text-[#7FD67F]">情報取り扱い方針</a>
              </li>
            </ul>
          </div>

          {/* Contact Information Column */}
          <div className="col-span-1">
            <h3 className="text-lg mb-4">連絡先情報</h3>
            <div className="space-y-2 text-sm">
              <div>VIET JAPAN PARTNER COOPERATION CO., LTD.</div>
              <div>税コード: 0317613936</div>
              <div className="flex items-start gap-2">
                <span>📍</span>
                <span>No. 3.40, The Prince Residence, 17-19-21 Nguyen Van Troi Str, Phu Nhuan Ward, HCMC, Viet Nam</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📞</span>
                <span>(+81) 050-6862-0772</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📞</span>
                <span>(+84) 028 7303 8939</span>
              </div>
              <div className="flex items-center gap-2">
                <span>✉️</span>
                <span>contact@vj-partner.com</span>
              </div>
              <div className="flex items-center gap-2">
                <span>💬</span>
                <span>cowboy_vn</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-blue-700 mt-6 text-center">
          <div className="text-sm mb-2">
            © 2025-All Rights Reserved - VIET JAPAN PARTNER COOPERATION Co.,LTD
          </div>
          <div className="text-sm">
            <a href="#" className="font-bold underline hover:no-underline hover:text-[#7FD67F]">Member of VIET JAPAN PARTNER Group</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

