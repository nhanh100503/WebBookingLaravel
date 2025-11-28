import React from 'react';

const Footer = () => {
  return (
    <footer className="w-[100vw] bg-blue-900 text-white mt-10">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Logo and Social Media Section */}
          <div className="col-span-1">
            <div className="mb-4">
              {/* Logo placeholder - replace with actual logo image */}
              <div className="flex items-center gap-2 mb-2">
                <div className="w-12 h-12 bg-white rounded flex items-center justify-center">
                  <span className="text-blue-900 font-bold text-xs">VJP</span>
                </div>
                <div>
                  <div className="text-sm font-bold">VJP FAST TRACK</div>
                  <div className="text-xs">日本人向け</div>
                  <div className="text-xs">ベトナム空港優先サービス</div>
                  <div className="text-xs">VIETJAPAN.VIP</div>
                </div>
              </div>
            </div>
            {/* Social Media Icons */}
            <div className="flex flex-wrap gap-2">
              <a href="#" className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center hover:bg-blue-500 transition-colors">
                <span className="text-white text-xs font-bold">f</span>
              </a>
              <a href="#" className="w-8 h-8 bg-red-600 rounded flex items-center justify-center hover:bg-red-500 transition-colors">
                <span className="text-white text-xs">▶</span>
              </a>
              <a href="#" className="w-8 h-8 bg-black rounded flex items-center justify-center hover:bg-gray-800 transition-colors">
                <span className="text-white text-xs">X</span>
              </a>
              <a href="#" className="w-8 h-8 bg-pink-600 rounded flex items-center justify-center hover:bg-pink-500 transition-colors">
                <span className="text-white text-xs">📷</span>
              </a>
              <a href="#" className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center hover:bg-gray-700 transition-colors">
                <span className="text-white text-xs">@</span>
              </a>
            </div>
          </div>

          {/* Menu Column */}
          <div className="col-span-1">
            <h3 className="text-lg font-bold mb-4">メニュー</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:underline">ホーム</a>
              </li>
              <li className="flex items-center gap-1">
                <a href="#" className="hover:underline">VJPファストトラックとは</a>
                <span className="text-xs">▼</span>
              </li>
              <li>
                <a href="#" className="hover:underline">お問い合わせ</a>
              </li>
              <li>
                <a href="#" className="hover:underline">よくあるご質問</a>
              </li>
              <li>
                <a href="#" className="hover:underline">お知らせ</a>
              </li>
              <li>
                <a href="#" className="hover:underline">ブログ</a>
              </li>
            </ul>
          </div>

          {/* Service Introduction Column */}
          <div className="col-span-1">
            <h3 className="text-lg font-bold mb-4">ベトナム国際空港ファストトラックのご紹介</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:underline">[入国専用] ホーチミン・タンソンニャット空港VIPファストトラック | ベトナム入国を最速で | 日本語サポート</a>
              </li>
              <li>
                <a href="#" className="hover:underline">[出国専用] ホーチミン・タンソンニャット空港VIPファストトラック | チェックインをスムーズに | 日本語サポート</a>
              </li>
              <li>
                <a href="#" className="hover:underline">ホーチミン・タンソンニャット国際空港ファストトラック</a>
              </li>
              <li>
                <a href="#" className="hover:underline">ハノイ・ノイバイ国際空港ファストトラック</a>
              </li>
              <li>
                <a href="#" className="hover:underline">ダナン国際空港ファストトラック</a>
              </li>
            </ul>
          </div>

          {/* Information Policy and Contact Column */}
          <div className="col-span-1">
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-4">情報取り扱い方針</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:underline">個人情報の取り扱い</a>
                </li>
                <li>
                  <a href="#" className="hover:underline">情報セキュリティ基本方針</a>
                </li>
                <li>
                  <a href="#" className="hover:underline">情報取り扱い方針</a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">連絡先情報</h3>
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
        </div>

        {/* Bottom Section */}
        <div className="border-t border-blue-700 mt-8 pt-6 text-center">
          <div className="text-sm mb-2">
            © 2025-All Rights Reserved - VIET JAPAN PARTNER COOPERATION Co.,LTD
          </div>
          <div className="text-sm">
            <a href="#" className="underline hover:no-underline">Member of VIET JAPAN PARTNER Group</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

