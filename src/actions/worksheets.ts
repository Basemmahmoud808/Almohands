'use server';

import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAuth, requireRole } from '@/lib/auth';
import { Worksheet } from '@/types/database';

const worksheetSchema = z.object({
  lesson_id: z.string().uuid(),
  title: z.string().min(3, 'عنوان الملف مطلوب'),
  file_url: z.string().url('رابط الملف غير صالح'),
  file_size_bytes: z.number().optional(),
});

export async function addWorksheet(rawData: z.infer<typeof worksheetSchema>) {
  await requireRole(['admin', 'teacher_assistant']);
  const validated = worksheetSchema.parse(rawData);

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('worksheets')
    .insert(validated)
    .select()
    .single();

  if (error) throw new Error(`فشل إضافة ملزمة/شيت: ${error.message}`);
  return data as Worksheet;
}

export async function getLessonWorksheets(lessonId: string) {
  const { profile } = await requireAuth();
  const supabase = createAdminClient();

  // Verify access authorization
  const { data: lesson } = await supabase
    .from('lessons')
    .select('course_id, is_free_preview')
    .eq('id', lessonId)
    .single();

  if (!lesson) throw new Error('الدرس غير موجود');

  if (!lesson.is_free_preview && profile.role === 'student') {
    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('id')
      .eq('student_id', profile.id)
      .eq('course_id', lesson.course_id)
      .single();

    if (!enrollment) {
      throw new Error('يرجى الاشتراك في الكورس لتنزيل الملازم والشيتات الخاصة بهذا الدرس');
    }
  }

  const { data, error } = await supabase
    .from('worksheets')
    .select('*')
    .eq('lesson_id', lessonId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`فشل جلب الملازم: ${error.message}`);
  return data as Worksheet[];
}
