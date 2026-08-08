import { requireAuth } from '@/lib/auth';
import Link from 'next/link';
import { CoursesCarousel } from '@/components/CoursesCarousel';
import { BookOpen, Award, Clock, ArrowLeft, TrendingUp, Sparkles } from 'lucide-react';
import { FadeInUp, HoverCard } from '@/components/MotionContainer';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function StudentDashboard() {
  const { profile } = await requireAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Student Welcome Banner */}
      <FadeInUp>
        <div className="relative rounded-3xl bg-gradient-to-r from-blue-950 via-[#235d3a] to-blue-900 dark:from-[#060913] dark:via-[#235d3a] dark:to-[#060913] border border-[#73c088]/40 p-8 sm:p-10 text-white shadow-2xl overflow-hidden">
          
          <div className="absolute inset-0 math-grid-bg opacity-30 pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#73c088]/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#73c088]/20 text-[#73c088] text-xs font-black border border-[#73c088]/40">
                <Sparkles className="w-3.5 h-3.5" />
                <span>لوحة التحكم الشخصية</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black">
                أهلاً بيك يا بطل، {profile.full_name || 'طالب متميز'} 👋
              </h1>
              <p className="text-slate-200 text-sm font-medium">
                الصف الدراسي: {profile.grade_level ? `الصف ${profile.grade_level}` : 'المرحلة الدراسية'} — استكمل مذاكرتك وحل امتحاناتك.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/courses"
                className="px-6 py-3 rounded-2xl bg-[#73c088] hover:bg-[#5fa873] text-slate-950 font-black text-xs shadow-lg transition-all flex items-center gap-2 border border-white/20"
              >
                <span>تصفح كل الكورسات</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </FadeInUp>

      {/* Analytics Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <HoverCard>
          <div className="bg-white dark:bg-[#0b0f19] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 border-b-4 border-b-blue-500">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-500">الكورسات المشترك فيها</span>
              <BookOpen className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white">3 كورسات</p>
            <p className="text-[11px] text-emerald-600 dark:text-[#73c088] font-bold">نشط ومفعل بالكامل</p>
          </div>
        </HoverCard>

        <HoverCard>
          <div className="bg-white dark:bg-[#0b0f19] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 border-b-4 border-b-amber-500">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-500">الامتحانات المكتملة</span>
              <Award className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white">8 امتحانات</p>
            <p className="text-[11px] text-amber-600 dark:text-amber-400 font-bold">متوسط الدرجات 92%</p>
          </div>
        </HoverCard>

        <HoverCard>
          <div className="bg-white dark:bg-[#0b0f19] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 border-b-4 border-b-[#73c088]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-500">ساعات المذاكرة</span>
              <Clock className="w-5 h-5 text-[#73c088]" />
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white">24 ساعة</p>
            <p className="text-[11px] text-emerald-600 dark:text-[#73c088] font-bold">هذا الشهر</p>
          </div>
        </HoverCard>

        <HoverCard>
          <div className="bg-white dark:bg-[#0b0f19] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 border-b-4 border-b-purple-500">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-500">نسبة التقييم العام</span>
              <TrendingUp className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white">ممتاز 🌟</p>
            <p className="text-[11px] text-purple-600 dark:text-purple-400 font-bold">مستمر في التفوق</p>
          </div>
        </HoverCard>

      </div>

      {/* ----------------------------------------------------
         COURSES CAROUSEL SECTION (Inside Dashboard after Sign In)
         ---------------------------------------------------- */}
      <div className="space-y-6 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-[#235d3a] dark:text-[#73c088]" />
              <span>الكورسات المتاحة لك حالياً</span>
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              اختر الكورس المطلوب للبدء فوراً في مشاهدة الفيديوهات وتنزيل ملزمه المنهج.
            </p>
          </div>

          <Link href="/courses" className="text-xs font-black text-blue-600 dark:text-[#73c088] hover:underline">
            عرض الكل ←
          </Link>
        </div>

        <CoursesCarousel />
      </div>

    </div>
  );
}
