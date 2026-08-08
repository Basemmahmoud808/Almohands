import { requireRole } from '@/lib/auth';
import { getPendingPaymentRequests } from '@/actions/payments';
import { getCourses } from '@/actions/courses';
import { AdminPanel } from '@/components/AdminPanel';

export default async function AdminDashboardPage() {
  await requireRole(['admin', 'teacher_assistant']);

  const pendingRequests = await getPendingPaymentRequests();
  const courses = await getCourses();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
          لوحة التحكم والإدارة — المهندس رضا خيرت
        </h1>
        <p className="text-xs text-slate-500 mt-1">مراجعة الاشتراكات وتوليد الأكواد وإدارة جلسات الحضور.</p>
      </div>

      <AdminPanel initialPendingRequests={pendingRequests} courses={courses} />

    </div>
  );
}
