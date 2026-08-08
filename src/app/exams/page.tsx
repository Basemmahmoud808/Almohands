import { createAdminClient } from '@/lib/supabase/admin';
import Link from 'next/link';
import { Award, Clock, ArrowLeft, Sparkles } from 'lucide-react';
import { FadeInUp, HoverCard } from '@/components/MotionContainer';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const DEMO_EXAMS = [
  {
    id: 'e1',
    title: 'امتحان تفاضل وتكامل شامل — الوحدة الأولى',
    description: 'اختبار تقييمي مكون من 4 أسئلة متنوعة لاختبار الفهم والسرعة.',
    duration_minutes: 30,
    courses: { title: 'تفاضل وتكامل 3 ثانوي' },
  },
  {
    id: 'e2',
    title: 'امتحان الهندسة الفراغية — معادلة المستويات',
    description: 'أسئلة اختيار من متعدد على حواصيل الضرب القياسي والاتجاهي والمعادلات.',
    duration_minutes: 45,
    courses: { title: 'هندسة فراغية 3 ثانوي' },
  },
  {
    id: 'e3',
    title: 'اختبار شهر أكتوبر — الجبر والدوال 2 ثانوي',
    description: 'مراجعة على الدوال الحقيقية والتحويلات الهندسية ومجال ومدى الدالة.',
    duration_minutes: 25,
    courses: { title: 'جبر ودوال 2 ثانوي' },
  },
];

export default async function ExamsPage() {
  let exams: any[] = [];
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('exams')
      .select('*, courses!course_id(title)')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      exams = DEMO_EXAMS;
    } else {
      exams = data;
    }
  } catch {
    exams = DEMO_EXAMS;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      <FadeInUp>
        <div className="border-b border-slate-200 dark:border-slate-800 pb-6 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-black border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>نظام الاختبارات والتقييم الذكي</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <Award className="w-8 h-8 text-[#73c088]" />
            الامتحانات الإلكترونية
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
            اختبر مستواك في كل جزئية مع منظومة التقييم الذكية والتصحيح التلقائي المباشر.
          </p>
        </div>
      </FadeInUp>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map((exam) => (
          <HoverCard key={exam.id}>
            <div className="bg-white dark:bg-[#0b0f19] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl transition-all space-y-4 flex flex-col justify-between h-full border-b-4 border-b-amber-500">
              <div className="space-y-3">
                <span className="text-[11px] font-black px-3 py-1 rounded-full bg-[#235d3a]/20 text-[#235d3a] dark:text-[#73c088] border border-[#73c088]/30 inline-block">
                  {exam.courses?.title || 'امتحان عام'}
                </span>

                <h3 className="font-black text-xl text-slate-900 dark:text-white leading-tight">
                  {exam.title}
                </h3>

                {exam.description && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium line-clamp-2 leading-relaxed">{exam.description}</p>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span>المدة: {exam.duration_minutes} دقيقة</span>
                </div>

                <Link
                  href={`/exams/${exam.id}`}
                  className="px-5 py-2.5 rounded-xl bg-[#235d3a] hover:bg-[#1b4a2e] text-white font-black text-xs flex items-center gap-1.5 transition-colors border border-[#73c088]/30 shadow-md"
                >
                  <span>دخول الامتحان</span>
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </HoverCard>
        ))}
      </div>

    </div>
  );
}
