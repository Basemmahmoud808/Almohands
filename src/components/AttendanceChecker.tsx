'use client';

import { useState } from 'react';
import { recordAttendance } from '@/actions/attendance';
import { QrCode, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';

export function AttendanceChecker() {
  const [tokenInput, setTokenInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      await recordAttendance(tokenInput.trim());
      setSuccessMessage('تم تسجيل حضورك بنجاح في الجلسة! 🎉');
      setTokenInput('');
    } catch (err: any) {
      setErrorMessage(err.message || 'فشل تسجيل الحضور');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-6 max-w-xl mx-auto">
      
      <div className="text-center space-y-2">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center font-bold">
          <QrCode className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">تسجيل حضور الجلسة</h2>
        <p className="text-xs text-slate-500">ادخل كود الجلسة الذي يظهره المهندس رضا خيرت في الحصة لتأكيد حضورك.</p>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 font-bold text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 font-bold text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleRecord} className="space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
            كود الجلسة (QR Token)
          </label>
          <input
            type="text"
            placeholder="مثال: ATT-X89A"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white font-mono font-bold text-sm tracking-wider uppercase focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !tokenInput.trim()}
          className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              جاري تسجيل الحضور...
            </>
          ) : (
            'تأكيد الحضور'
          )}
        </button>
      </form>

    </div>
  );
}
