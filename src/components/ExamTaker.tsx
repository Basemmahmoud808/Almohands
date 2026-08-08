'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { submitExam } from '@/actions/exams';
import { Exam, ExamQuestion } from '@/types/database';
import { Clock, AlertTriangle, CheckCircle, ShieldAlert, Loader2 } from 'lucide-react';

interface Props {
  exam: Exam;
  questions: Omit<ExamQuestion, 'correct_answer'>[];
}

export function ExamTaker({ exam, questions }: Props) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(exam.duration_minutes * 60);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);

  // Countdown Timer
  useEffect(() => {
    if (timeLeftSeconds <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeftSeconds]);

  // Anti-Cheating: Detect Tab Switching / Focus Loss
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount((prev) => prev + 1);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const handleSelectAnswer = (questionId: string, option: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const submission = await submitExam(exam.id, answers);
      router.push(`/exams/${exam.id}/results?submissionId=${submission.id}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'حدث خطأ أثناء تسليم الامتحان');
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="space-y-8">
      
      {/* Exam Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-800 sticky top-20 z-40 glass-panel">
        <div>
          <h2 className="text-xl font-black">{exam.title}</h2>
          <p className="text-xs text-slate-400">عدد الأسئلة: {questions.length} سؤال</p>
        </div>

        {/* Timer & Warnings */}
        <div className="flex items-center gap-4">
          {tabSwitchCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/30">
              <ShieldAlert className="w-4 h-4" />
              <span>تحذير: مغادرة الصفحة ({tabSwitchCount})</span>
            </div>
          )}

          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-base shadow-md">
            <Clock className="w-5 h-5" />
            <span>{formatTime(timeLeftSeconds)}</span>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 text-xs font-bold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-8">
        {questions.map((q, idx) => (
          <div
            key={q.id}
            className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
          >
            <div className="flex items-start gap-3">
              <span className="w-8 h-8 rounded-xl bg-blue-900 text-amber-400 font-extrabold text-sm flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
              <div className="space-y-2">
                <h3 className="font-bold text-base text-slate-900 dark:text-white leading-relaxed">
                  {q.question_text}
                </h3>
                {q.image_url && (
                  <img src={q.image_url} alt="سؤال" className="max-h-60 rounded-xl border border-slate-200" />
                )}
              </div>
            </div>

            {/* MCQ Choices */}
            {q.question_type === 'mcq' && q.options && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {q.options.map((opt, optIdx) => {
                  const isSelected = answers[q.id] === opt;
                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectAnswer(q.id, opt)}
                      className={`p-4 rounded-xl text-right font-medium text-xs border transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-blue-50 border-blue-900 text-blue-900 dark:bg-blue-950 dark:border-blue-400 dark:text-blue-200 font-bold shadow-xs'
                          : 'bg-slate-50 border-slate-200 dark:bg-slate-800/40 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      <span>{opt}</span>
                      {isSelected && <CheckCircle className="w-4 h-4 text-blue-900 dark:text-blue-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Essay Input */}
            {q.question_type === 'essay' && (
              <textarea
                rows={3}
                placeholder="اكتب إجابتك بالتفصيل هنا..."
                value={answers[q.id] || ''}
                onChange={(e) => handleSelectAnswer(q.id, e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-900"
              />
            )}
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              جاري إنهاء وتسليم الامتحان...
            </>
          ) : (
            'تسليم الامتحان وتصحيحه'
          )}
        </button>
      </div>

    </div>
  );
}
