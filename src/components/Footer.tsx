import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[#060913] text-slate-300 border-t border-slate-800 pt-12 pb-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* 2-Column Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          
          {/* Column 1: Brand & Copyrights */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#235d3a] via-emerald-800 to-slate-900 text-[#73c088] flex items-center justify-center font-black text-2xl shadow-md border border-[#73c088]/30">
                ∫
              </div>
              <div>
                <h3 className="font-black text-xl text-white">المهندس رضا خيرت</h3>
              </div>
            </div>
            <p className="text-xs text-slate-500 font-semibold pt-1">
              جميع الحقوق محفوظة © {new Date().getFullYear()} — منصة المهندس
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-black text-base text-white border-r-4 border-[#73c088] pr-3">روابط سريعة</h4>
            <ul className="space-y-2.5 text-xs font-bold text-slate-400">
              <li>
                <Link href="/" className="hover:text-[#73c088] transition-colors">الرئيسية</Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-[#73c088] transition-colors">الكورسات والدروس</Link>
              </li>
              <li>
                <Link href="/exams" className="hover:text-[#73c088] transition-colors">الامتحانات الإلكترونية</Link>
              </li>
              <li>
                <Link href="/payments/subscribe" className="hover:text-[#73c088] transition-colors">تفعيل اشتراك / كود الشحن</Link>
              </li>
            </ul>
          </div>

        </div>

      </div>
    </footer>
  );
}
