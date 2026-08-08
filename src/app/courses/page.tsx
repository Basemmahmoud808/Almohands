import Link from 'next/link';
import Image from 'next/image';
import { getCourses } from '@/actions/courses';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { FadeInUp, HoverCard } from '@/components/MotionContainer';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface Props {
  searchParams: Promise<{ grade?: string }>;
}

export default async function CoursesPage({ searchParams }: Props) {
  const { grade } = await searchParams;
  const gradeNumber = grade ? parseInt(grade, 10) : undefined;
  const courses = await getCourses(gradeNumber);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header Section */}
      <FadeInUp>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#235d3a]/10 dark:bg-[#235d3a]/40 text-[#235d3a] dark:text-[#73c088] text-xs font-black border border-[#73c088]/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>مناهج المرحلة الإعدادية والأول الثانوي</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
              الكورسات والدروس التعليمية
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
              مناهج الرياضيات المشروحة بأسلوب المهندس رضا خيرت لمراحل الإعدادية والأول الثانوي.
            </p>
          </div>

          {/* Grade Level Filter Tabs */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-200/80 dark:bg-[#111827] border border-slate-300/60 dark:border-slate-800 self-start md:self-auto overflow-x-auto max-w-full">
            <Link
              href="/courses"
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
                !gradeNumber
                  ? 'bg-white dark:bg-[#235d3a] text-slate-900 dark:text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              الكل
            </Link>
            <Link
              href="/courses?grade=7"
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
                gradeNumber === 7
                  ? 'bg-white dark:bg-[#235d3a] text-slate-900 dark:text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              1 إعدادي
            </Link>
            <Link
              href="/courses?grade=8"
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
                gradeNumber === 8
                  ? 'bg-white dark:bg-[#235d3a] text-slate-900 dark:text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              2 إعدادي
            </Link>
            <Link
              href="/courses?grade=9"
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
                gradeNumber === 9
                  ? 'bg-white dark:bg-[#235d3a] text-slate-900 dark:text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              3 إعدادي
            </Link>
            <Link
              href="/courses?grade=1"
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
                gradeNumber === 1
                  ? 'bg-white dark:bg-[#235d3a] text-slate-900 dark:text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              1 ثانوي
            </Link>
          </div>
        </div>
      </FadeInUp>

      {/* Courses Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <HoverCard key={course.id}>
            <div className="bg-white dark:bg-[#0b0f19] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl transition-all space-y-6 flex flex-col justify-between h-full group border-b-4 border-b-[#73c088]">
              
              <div className="space-y-4">
                {/* Poster Image */}
                <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800">
                  <Image
                    src={course.thumbnail_url || '/images/teacher_reda_kheirat.jpg'}
                    alt={course.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover object-top opacity-90 group-hover:scale-105 transition-transform duration-500 hero-image-mask"
                  />
                  <span className="absolute top-3 right-3 text-[11px] font-black px-3 py-1 rounded-full bg-[#235d3a]/80 text-[#73c088] border border-[#73c088]/40 backdrop-blur-md">
                    {course.grade_level === 1 ? 'الصف الأول الثانوي' : course.grade_level === 7 ? 'الصف الأول الإعدادي' : course.grade_level === 8 ? 'الصف الثاني الإعدادي' : 'الصف الثالث الإعدادي'}
                  </span>
                </div>

                <h3 className="font-black text-xl text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-[#73c088] transition-colors">
                  {course.title}
                </h3>

                {course.description && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed font-medium">
                    {course.description}
                  </p>
                )}
              </div>

              {/* Price & Action */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 block">تكلفة الكورس</span>
                  <span className="text-lg font-black text-blue-600 dark:text-[#73c088]">
                    {course.price_egp} ج.م
                  </span>
                </div>

                <Link
                  href={`/courses/${course.id}`}
                  className="px-5 py-2.5 rounded-xl bg-[#235d3a] hover:bg-[#1b4a2e] text-white font-black text-xs flex items-center gap-1.5 shadow-md transition-all border border-[#73c088]/30"
                >
                  <span>عرض التفاصيل والدروس</span>
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
