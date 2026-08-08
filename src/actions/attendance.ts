'use server';

import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAuth, requireRole } from '@/lib/auth';
import { AttendanceSession, AttendanceRecord } from '@/types/database';

const createSessionSchema = z.object({
  title: z.string().min(3, 'عنوان الجلسة مطلوب'),
  grade_level: z.union([z.literal(7), z.literal(8), z.literal(9), z.literal(1)]),
});

export async function createAttendanceSession(title: string, grade_level: 7 | 8 | 9 | 1) {
  const { profile } = await requireRole(['admin', 'teacher_assistant']);
  const validated = createSessionSchema.parse({ title, grade_level });

  const qrToken = `ATT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('attendance_sessions')
    .insert({
      title: validated.title,
      grade_level: validated.grade_level,
      qr_code_token: qrToken,
      created_by: profile.id,
    })
    .select()
    .single();

  if (error) throw new Error(`فشل إنشاء الجلسة: ${error.message}`);
  return data as AttendanceSession;
}

export async function recordAttendance(qrToken: string) {
  const { profile } = await requireAuth();
  const supabase = createAdminClient();

  const { data: session, error: sessionError } = await supabase
    .from('attendance_sessions')
    .select('*')
    .eq('qr_code_token', qrToken.trim())
    .single();

  if (sessionError || !session) {
    throw new Error('رمز الحضور غير صحيح أو منتهي الصلاحية');
  }

  // Record attendance
  const { data, error } = await supabase
    .from('attendance_records')
    .upsert(
      {
        session_id: session.id,
        student_id: profile.id,
        status: 'present',
        recorded_at: new Date().toISOString(),
      },
      { onConflict: 'session_id,student_id' }
    )
    .select()
    .single();

  if (error) throw new Error(`فشل تسجيل الحضور: ${error.message}`);
  return data as AttendanceRecord;
}

export async function getStudentAttendanceHistory() {
  const { profile } = await requireAuth();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('attendance_records')
    .select('*, attendance_sessions(*)')
    .eq('student_id', profile.id)
    .order('recorded_at', { ascending: false });

  if (error) return [];
  return data || [];
}
