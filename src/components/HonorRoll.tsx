'use client';

import { Trophy, Star } from 'lucide-react';
import { FadeInUp, HoverCard } from '@/components/MotionContainer';

interface Student {
  id: string;
  name: string;
  grade: string;
  score: string;
  school: string;
  subject: string;
  rank: 1 | 2 | 3 | 4;
}

const TOP_STUDENTS: Student[] = [
  {
    id: 's1',
    name: 'أحمد محمد عبد الله',
    grade: 'الصف الأول الثانوي',
    score: '100% (المركز الأول)',
    school: 'مدرسة المتفوقين الرسمية لغات',
    subject: 'حاصل على الدرجة النهائية في الرياضيات والهندسة',
    rank: 1,
  },
  {
    id: 's2',
    name: 'مريم محمود السيد',
    grade: 'الصف الثالث الإعدادي (الشهادة)',
    score: '99.5% (المركز الثاني)',
    school: 'مدرسة الإعدادية بنات النموذجية',
    subject: 'حاصلة على 100% في امتحانات الجبر وحساب المثلثات',
    rank: 2,
  },
  {
    id: 's3',
    name: 'عمر خالد فاروق',
    grade: 'الصف الثاني الإعدادي',
    score: '99.0% (المركز الثالث)',
    school: 'مدرسة الأورمان الرسمية',
    subject: 'حاصل على 100% في امتحانات التقييم الدوري',
    rank: 3,
  },
];

export function HonorRoll() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <FadeInUp>
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-black border border-amber-500/30">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>لوحة شرف الأوائل</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            أوائل الطلاب مع المهندس رضا خيرت
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl mx-auto font-medium">
            نخبة من طلاب المرحلة الإعدادية والأول الثانوي المتفوقين الحاصلين على أعلى الدرجات.
          </p>
        </div>
      </FadeInUp>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {TOP_STUDENTS.map((student) => (
          <HoverCard key={student.id}>
            <div className="bg-white dark:bg-[#0b0f19] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-md hover:shadow-2xl transition-all space-y-5 relative overflow-hidden group border-b-4 border-b-amber-500">
              
              {/* Rank Trophy Badge */}
              <div className="flex items-center justify-between">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black shadow-lg ${
                    student.rank === 1
                      ? 'bg-gradient-to-br from-amber-400 to-yellow-600 text-slate-950'
                      : student.rank === 2
                      ? 'bg-gradient-to-br from-slate-200 to-slate-400 text-slate-950'
                      : 'bg-gradient-to-br from-amber-700 to-amber-900 text-white'
                  }`}
                >
                  <Trophy className="w-6 h-6" />
                </div>
                <span className="text-xs font-black px-3 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                  {student.score}
                </span>
              </div>

              {/* Student Details */}
              <div className="space-y-1">
                <h3 className="font-black text-xl text-slate-900 dark:text-white">
                  {student.name}
                </h3>
                <p className="text-xs font-bold text-blue-600 dark:text-[#73c088]">
                  {student.grade}
                </p>
                <p className="text-[11px] text-slate-500 font-medium">
                  {student.school}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-xs text-amber-500 font-bold">
                <Star className="w-4 h-4 fill-amber-500" />
                <span>{student.subject}</span>
              </div>

            </div>
          </HoverCard>
        ))}
      </div>
    </section>
  );
}
