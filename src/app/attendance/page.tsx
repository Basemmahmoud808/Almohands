import { getStudentAttendanceHistory } from '@/actions/attendance';
import { AttendanceChecker } from '@/components/AttendanceChecker';
import { Calendar, CheckCircle2 } from 'lucide-react';

export default async function AttendancePage() {
  let records: any[] = [];
  try {
    records = await getStudentAttendanceHistory();
  } catch {
    records = [];
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Attendance Form */}
      <AttendanceChecker />

      {/* Student Attendance History */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 max-w-4xl mx-auto">
        <h3 className="font-black text-xl text-slate-900 dark:text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-emerald-500" />
          سجل حضورك السلس في الحصص والجلسات
        </h3>

        {records.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">لم تقم بتسجيل الحضور في أي جلسة حتى الآن.</p>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {records.map((rec) => (
              <div key={rec.id} className="py-4 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {rec.attendance_sessions?.title || 'جلسة حصة رياضيات'}
                  </h4>
                  <span className="text-[10px] text-slate-400">
                    التاريخ: {new Date(rec.recorded_at).toLocaleDateString('ar-EG')}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>حاضر</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
