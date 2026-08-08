import { getCourseDetails } from '@/actions/courses';
import { getLessonWorksheets } from '@/actions/worksheets';
import { createAdminClient } from '@/lib/supabase/admin';
import Link from 'next/link';
import { Play, Download, FileText, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { FadeInUp } from '@/components/MotionContainer';

export default async function LessonViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();

  // Fetch Lesson details
  const { data: lesson, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !lesson) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-red-600">الدرس غير موجود أو تم حذفه</h2>
        <Link href="/courses" className="text-blue-600 underline font-bold text-sm">
          العودة للكورسات
        </Link>
      </div>
    );
  }

  // Fetch Worksheets
  let worksheets: any[] = [];
  try {
    worksheets = await getLessonWorksheets(lesson.id);
  } catch {
    worksheets = [];
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Breadcrumb / Back Link */}
      <FadeInUp>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <Link href={`/courses/${lesson.course_id}`} className="hover:text-[#73c088] transition-colors flex items-center gap-1">
            <ArrowRight className="w-4 h-4" />
            العودة للكورس
          </Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-white font-extrabold">{lesson.title}</span>
        </div>
      </FadeInUp>

      {/* Video Player Box */}
      <FadeInUp delay={0.1}>
        <div className="bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 border-b-4 border-b-[#73c088]">
          <div className="aspect-video w-full bg-slate-900 relative flex items-center justify-center">
            {lesson.video_url.includes('youtube.com') || lesson.video_url.includes('youtu.be') ? (
              <iframe
                src={lesson.video_url.replace('watch?v=', 'embed/')}
                className="w-full h-full border-0"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            ) : (
              <video
                src={lesson.video_url}
                controls
                className="w-full h-full"
                controlsList="nodownload"
              />
            )}
          </div>

          <div className="p-6 bg-slate-900 text-white space-y-2">
            <span className="text-xs text-[#73c088] font-bold bg-[#235d3a]/30 px-3 py-1 rounded-full border border-[#73c088]/40 inline-block">
              {lesson.unit_name}
            </span>
            <h1 className="text-2xl font-black">{lesson.title}</h1>
            {lesson.description && <p className="text-xs text-slate-400 font-medium leading-relaxed">{lesson.description}</p>}
          </div>
        </div>
      </FadeInUp>

      {/* Worksheets & PDF Documents */}
      <FadeInUp delay={0.2}>
        <div className="bg-white dark:bg-[#0b0f19] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-black text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#235d3a] dark:text-[#73c088]" />
            الملازم والشيتات التابعة للدرس
          </h3>

          {worksheets.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 font-medium">لا توجد ملازم مرفقة بهذا الدرس حالياً.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {worksheets.map((ws) => (
                <div
                  key={ws.id}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60 shadow-xs hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-amber-500 shrink-0" />
                    <div>
                      <h4 className="font-black text-sm text-slate-900 dark:text-white">{ws.title}</h4>
                      <span className="text-[10px] text-slate-400 font-bold">مستند PDF</span>
                    </div>
                  </div>

                  <a
                    href={ws.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-[#235d3a] hover:bg-[#1b4a2e] text-white font-black text-xs flex items-center gap-1.5 transition-colors border border-[#73c088]/40"
                  >
                    <Download className="w-4 h-4" />
                    تحميل
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </FadeInUp>

    </div>
  );
}
