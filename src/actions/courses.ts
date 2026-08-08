'use server';

import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { requireRole } from '@/lib/auth';
import { Course, Lesson } from '@/types/database';

const courseSchema = z.object({
  title: z.string().min(3, 'عنوان الكورس يجب أن يكون 3 حروف على الأقل'),
  description: z.string().optional(),
  grade_level: z.union([z.literal(1), z.literal(7), z.literal(8), z.literal(9)]),
  price_egp: z.number().min(0, 'السعر يجب أن يكون 0 أو أكثر'),
  thumbnail_url: z.string().optional(),
  is_published: z.boolean().default(false),
});

const lessonSchema = z.object({
  course_id: z.string().uuid(),
  unit_name: z.string().min(2, 'اسم الوحدة مطلوب'),
  title: z.string().min(3, 'عنوان الدرس مطلوب'),
  description: z.string().optional(),
  video_url: z.string().url('رابط الفيديو غير صالحة'),
  video_duration_seconds: z.number().min(0).default(0),
  order_index: z.number().min(0).default(0),
  is_free_preview: z.boolean().default(false),
});

const MOCK_COURSES: Course[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    title: 'كورس الجبر والمثلثات والهندسة التحليلية — 1 ثانوي',
    description: 'شرح كامل للأعداد المركبة، الزوايا الموجهة، والمعادلات الكارتيزية والمتجهة خطوة بخطوة.',
    grade_level: 1,
    price_egp: 180,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    title: 'كورس الرياضيات الشامل وحساب المثلثات — 3 إعدادي (الشهادة)',
    description: 'مراجعة المنهج الكامل، نسبة التغير، حواسب النسب المثلثية، والدائرة مع نماذج امتحانات المحافظات.',
    grade_level: 9,
    price_egp: 150,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    title: 'كورس الجبر والإحصاء والهندسة — 2 إعدادي',
    description: 'الأعداد الحقيقية والعمليات عليها، التحليل بالجبر، ومتوسطات المثلث والنظريات الهندسية.',
    grade_level: 8,
    price_egp: 120,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    title: 'كورس أساسيات الجبر والهندسة — 1 إعدادي',
    description: 'الأعداد النسبية، الحدود والمقادير الجبرية، والإنشاءات الهندسية والتوازي.',
    grade_level: 7,
    price_egp: 100,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const MOCK_LESSONS: Lesson[] = [
  {
    id: 'l1',
    course_id: '11111111-1111-1111-1111-111111111111',
    unit_name: 'الوحدة الأولى: الجبر والأعداد المركبة',
    title: 'مقدمة في الأعداد المركبة والشكل التخيلي ت',
    description: 'شرح مفهوم ت وقوة ت وحل المعادلة من الدرجة الثانية في ت.',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    video_duration_seconds: 1800,
    order_index: 1,
    is_free_preview: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'l2',
    course_id: '11111111-1111-1111-1111-111111111111',
    unit_name: 'الوحدة الثانية: حساب المثلثات',
    title: 'الزوايا الموجهة والقياس الدائري والستيني',
    description: 'التحويل بين القياس الستيني والدائري وحساب طول القوس.',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    video_duration_seconds: 2400,
    order_index: 2,
    is_free_preview: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export async function getCourses(gradeLevel?: number) {
  try {
    const supabase = await createClient();
    let query = supabase.from('courses').select('*').order('created_at', { ascending: false });

    if (gradeLevel) {
      query = query.eq('grade_level', gradeLevel);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) throw error;
    return data as Course[];
  } catch {
    // Fallback to mock data for seamless UI demonstration
    let list = MOCK_COURSES;
    if (gradeLevel) {
      list = list.filter((c) => c.grade_level === gradeLevel);
    }
    return list;
  }
}

export async function getCourseDetails(courseId: string) {
  try {
    const supabase = await createClient();
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .single();

    if (courseError || !course) throw courseError;

    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', courseId)
      .order('order_index', { ascending: true });

    if (lessonsError) throw lessonsError;

    return {
      course: course as Course,
      lessons: (lessons || []) as Lesson[],
    };
  } catch {
    // Fallback mock course details
    const foundCourse = MOCK_COURSES.find((c) => c.id === courseId) || MOCK_COURSES[0];
    const foundLessons = MOCK_LESSONS.filter((l) => l.course_id === foundCourse.id);
    return {
      course: foundCourse,
      lessons: foundLessons.length > 0 ? foundLessons : MOCK_LESSONS,
    };
  }
}

export async function createCourse(rawData: z.infer<typeof courseSchema>) {
  await requireRole(['admin', 'teacher_assistant']);
  const validated = courseSchema.parse(rawData);

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('courses')
    .insert(validated)
    .select()
    .single();

  if (error) throw new Error(`فشل إنشاء الكورس: ${error.message}`);
  return data as Course;
}

export async function addLesson(rawData: z.infer<typeof lessonSchema>) {
  await requireRole(['admin', 'teacher_assistant']);
  const validated = lessonSchema.parse(rawData);

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('lessons')
    .insert(validated)
    .select()
    .single();

  if (error) throw new Error(`فشل إضافة الدرس: ${error.message}`);
  return data as Lesson;
}
