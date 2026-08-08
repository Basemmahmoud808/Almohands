import { createAdminClient } from '@/lib/supabase/admin';
import Link from 'next/link';
import { Award, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';

export default async function ExamResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ submissionId?: string }>;
}) {
  const params = await searchParams;
  const { submissionId } = params;

  if (!submissionId) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-4">
        <h3 className="text-lg font-bold text-red-600">نتيجة الامتحان غير متاحة</h3>
        <Link href="/exams" className="text-blue-900 underline font-bold text-xs">
          العودة للامتحانات
        </Link>
      </div>
    );
  }

  const supabase = createAdminClient();
  const { data: sub, error } = await supabase
    .from('exam_submissions')
    .select('*, exams!exam_id(title, passing_score_percent)')
    .eq('id', submissionId)
    .single();

  if (error || !sub) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-4">
        <h3 className="text-lg font-bold text-red-600">تعذر جلب نتيجة الإجابات</h3>
        <Link href="/exams" className="text-blue-900 underline font-bold text-xs">
          العودة للامتحانات
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-8">
      
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-6">
        
        <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center shadow-lg">
          {sub.is_passed ? (
            <div className="w-full h-full rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle className="w-12 h-12" />
            </div>
          ) : (
            <div className="w-full h-full rounded-full bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400 flex items-center justify-center">
              <XCircle className="w-12 h-12" />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-500">نتيجة {sub.exams?.title}</span>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">
            {sub.is_passed ? 'مبروك! لقد اجتزت الامتحان بنجاح 🎉' : 'للأسف لم تتجاوز النسبة المطلوبة 💔'}
          </h2>
        </div>

        {/* Score Stats */}
        <div className="grid grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 max-w-md mx-auto">
          <div>
            <span className="text-[10px] text-slate-400 font-bold block">الدرجة المحصلة</span>
            <span className="text-2xl font-black text-blue-900 dark:text-blue-400">{sub.score}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold block">الدرجة الكلية</span>
            <span className="text-2xl font-black text-slate-700 dark:text-slate-300">{sub.total_points}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold block">النسبة المئوية</span>
            <span className="text-2xl font-black text-amber-500">{sub.percentage}%</span>
          </div>
        </div>

        <div className="pt-4 flex justify-center gap-4">
          <Link
            href="/exams"
            className="px-6 py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-2 transition-colors"
          >
            العودة للامتحانات
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

      </div>

    </div>
  );
}
