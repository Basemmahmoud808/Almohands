import { getStudentExamQuestions } from '@/actions/exams';
import { ExamTaker } from '@/components/ExamTaker';
import Link from 'next/link';

export default async function StudentExamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const { exam, questions } = await getStudentExamQuestions(id);

    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ExamTaker exam={exam} questions={questions} />
      </div>
    );
  } catch (err: any) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center space-y-4">
        <div className="bg-red-50 dark:bg-red-950/60 p-6 rounded-2xl border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 font-bold text-sm">
          {err.message || 'فشل تحميل بيانات الامتحان'}
        </div>
        <Link href="/exams" className="text-blue-900 dark:text-blue-400 underline font-bold text-xs">
          العودة لقائمة الامتحانات
        </Link>
      </div>
    );
  }
}
