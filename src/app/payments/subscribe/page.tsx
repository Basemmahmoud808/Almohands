import { getCourses } from '@/actions/courses';
import { SubscriptionForm } from '@/components/SubscriptionForm';

export default async function SubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ courseId?: string }>;
}) {
  const params = await searchParams;
  const courses = await getCourses();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SubscriptionForm courses={courses} initialCourseId={params.courseId} />
    </div>
  );
}
