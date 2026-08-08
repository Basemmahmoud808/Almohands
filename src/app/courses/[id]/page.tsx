import { getCourseDetails } from '@/actions/courses';
import Link from 'next/link';
import { BookOpen, PlayCircle, Lock, ShieldCheck, FileText, CheckCircle, Sparkles, ArrowLeft } from 'lucide-react';
import { FadeInUp, HoverCard } from '@/components/MotionContainer';

export default async function CourseDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { course, lessons } = await getCourseDetails(id);

  // Group lessons by unit_name
  const unitsMap = lessons.reduce((acc, lesson) => {
    const unit = lesson.unit_name || 'الوحدة الأولى';
    if (!acc[unit]) acc[unit] = [];
    acc[unit].push(lesson);
    return acc;
  }, {} as Record<string, typeof lessons>);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Course Hero Header — Soothing Theme */}
      <FadeInUp>
        <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-[#1b4d3e] to-slate-950 dark:from-[#060913] dark:via-[#235d3a] dark:to-[#060913] border border-[#73c088]/30 p-8 sm:p-12 text-white shadow-2xl space-y-6 overflow-hidden">
          
          <div className="absolute inset-0 math-grid-bg opacity-30 pointer-events-none" />
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#73c088]/20 border border-[#73c088]/40 text-[#73c088] text-xs font-black">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{course.grade_level === 1 ? 'الصف الأول الثانوي' : course.grade_level === 7 ? 'الصف الأول الإعدادي' : course.grade_level === 8 ? 'الصف الثاني الإعدادي' : 'الصف الثالث الإعدادي'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight">
            {course.title}
          </h1>

          <p className="text-slate-200 text-sm sm:text-base max-w-3xl leading-relaxed font-medium">
            {course.description || 'كورس تعليمي متكامل يحتوي على فيديوهات الشرح بالتفصيل والشيتات المحلولة والامتحانات التفاعلية على كل درس.'}
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-6 border-t border-white/10 text-xs sm:text-sm font-semibold">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <BookOpen className="w-5 h-5" />
              <span>عدد الدروس: {lessons.length} درس</span>
            </div>
            <div className="flex items-center gap-2 text-[#73c088] font-bold">
              <ShieldCheck className="w-5 h-5" />
              <span>تحديثات مستمرة ومنظومة تقييم متقدمة</span>
            </div>
          </div>
        </div>
      </FadeInUp>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col: Units & Lessons List */}
        <div className="lg:col-span-8 space-y-8">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#235d3a] dark:text-[#73c088]" />
            <span>محتوى الكورس والدروس</span>
          </h2>

          {Object.keys(unitsMap).length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-[#0b0f19] rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-500 font-bold text-sm">
              لم يتم رفع دروس في هذا الكورس بعد.
            </div>
          ) : (
            Object.entries(unitsMap).map(([unitTitle, unitLessons]) => (
              <div key={unitTitle} className="bg-white dark:bg-[#0b0f19] rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm space-y-1">
                <div className="bg-slate-100 dark:bg-slate-900/80 px-6 py-4 border-b border-slate-200 dark:border-slate-800 font-black text-base text-slate-900 dark:text-white flex items-center justify-between">
                  <span>{unitTitle}</span>
                  <span className="text-xs font-bold text-[#73c088] bg-[#235d3a]/20 px-2.5 py-1 rounded-full border border-[#73c088]/30">
                    {unitLessons.length} دروس
                  </span>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {unitLessons.map((lesson, idx) => (
                    <div key={lesson.id} className="p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-900 dark:bg-slate-800 dark:text-blue-300 font-black text-xs flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <div>
                          <h4 className="font-black text-sm text-slate-900 dark:text-white">{lesson.title}</h4>
                          {lesson.description && <p className="text-xs text-slate-500 mt-0.5 font-medium">{lesson.description}</p>}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {lesson.is_free_preview ? (
                          <Link
                            href={`/lessons/${lesson.id}`}
                            className="px-4 py-2 rounded-xl bg-[#73c088] hover:bg-[#5fa873] text-slate-950 font-black text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                          >
                            <PlayCircle className="w-4 h-4" />
                            معاينة مجانية
                          </Link>
                        ) : (
                          <Link
                            href={`/lessons/${lesson.id}`}
                            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors"
                          >
                            <Lock className="w-3.5 h-3.5 text-slate-500" />
                            مشاهدة الدرس
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Col: Course Enrollment Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-[#0b0f19] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 sticky top-24 border-b-4 border-b-[#73c088]">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-500">رسوم الاشتراك</span>
              <div className="text-3xl font-black text-slate-900 dark:text-[#73c088]">
                {course.price_egp > 0 ? `${course.price_egp} جنيه مصري` : 'مجاناً'}
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <Link
                href={`/payments/subscribe?courseId=${course.id}`}
                className="w-full py-4 rounded-2xl bg-[#235d3a] hover:bg-[#1b4a2e] text-white font-black text-sm text-center block shadow-lg transition-all flex items-center justify-center gap-2 border border-[#73c088]/40"
              >
                <span>تفعيل الكورس الآن</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-4 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#73c088]" />
                <span>وصول غير محدود لجميع الدروس والشيتات</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#73c088]" />
                <span>تحديثات مستمرة طوال العام الدراسي</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#73c088]" />
                <span>طرق دفع سهلة: فودافون كاش / إنستا باي / كود شحن</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
