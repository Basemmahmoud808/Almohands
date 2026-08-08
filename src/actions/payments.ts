'use server';

import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAuth, requireRole } from '@/lib/auth';
import { PaymentRequest, AccessCode } from '@/types/database';

const paymentRequestSchema = z.object({
  course_id: z.string().uuid(),
  payment_method: z.enum(['vodafone_cash', 'instapay', 'bank_transfer']),
  sender_phone: z.string().min(10, 'رقم المحفظة / الهاتف يجب أن يكون 10 أرقام على الأقل'),
  transaction_ref: z.string().min(4, 'رقم المعاملة / التحويل مطلوب'),
  receipt_image_url: z.string().optional(),
});

const accessCodeRedeemSchema = z.object({
  code: z.string().min(6, 'الكود غير صحيح'),
});

export async function submitPaymentRequest(rawData: z.infer<typeof paymentRequestSchema>) {
  const { profile } = await requireAuth();
  const validated = paymentRequestSchema.parse(rawData);

  const supabase = createAdminClient();

  // Fetch course to resolve authoritative price
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select('price_egp')
    .eq('id', validated.course_id)
    .single();

  if (courseError || !course) throw new Error('الكورس غير موجود');

  // Check if transaction_ref already exists (prevent duplicate submission)
  const { data: existing } = await supabase
    .from('payment_requests')
    .select('id')
    .eq('transaction_ref', validated.transaction_ref)
    .single();

  if (existing) {
    throw new Error('رقم العملية / المعاملة مسجل بالفعل مسبقاً');
  }

  const { data: request, error } = await supabase
    .from('payment_requests')
    .insert({
      student_id: profile.id,
      course_id: validated.course_id,
      payment_method: validated.payment_method,
      sender_phone: validated.sender_phone,
      transaction_ref: validated.transaction_ref,
      receipt_image_url: validated.receipt_image_url,
      amount_egp: course.price_egp,
      status: 'pending',
    })
    .select()
    .single();

  if (error) throw new Error(`فشل إرسال طلب الاشتراك: ${error.message}`);
  return request as PaymentRequest;
}

export async function redeemAccessCode(rawData: z.infer<typeof accessCodeRedeemSchema>) {
  const { profile } = await requireAuth();
  const { code } = accessCodeRedeemSchema.parse(rawData);

  const supabase = createAdminClient();

  const { data: accessCode, error: findError } = await supabase
    .from('access_codes')
    .select('*')
    .eq('code', code.trim())
    .single();

  if (findError || !accessCode) {
    throw new Error('كود الاشتراك غير صحيح أو غير موجود');
  }

  if (accessCode.is_used) {
    throw new Error('تم استخدام هذا الكود من قبل');
  }

  // Atomic update to mark code used
  const { error: updateCodeError } = await supabase
    .from('access_codes')
    .update({
      is_used: true,
      used_by_student_id: profile.id,
      used_at: new Date().toISOString(),
    })
    .eq('id', accessCode.id)
    .eq('is_used', false);

  if (updateCodeError) {
    throw new Error('حدث خطأ أثناء استخدام الكود، يرجى المحاولة مرة أخرى');
  }

  // Automatically enroll student in the course
  const { error: enrollError } = await supabase
    .from('enrollments')
    .insert({
      student_id: profile.id,
      course_id: accessCode.course_id,
    });

  if (enrollError && !enrollError.message.includes('unique constraint')) {
    throw new Error(`فشل تفعيل الاشتراك: ${enrollError.message}`);
  }

  return { success: true, courseId: accessCode.course_id };
}

export async function getPendingPaymentRequests() {
  await requireRole(['admin', 'teacher_assistant']);
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('payment_requests')
    .select('*, profiles!student_id(full_name, email, phone), courses!course_id(title)')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) throw new Error(`فشل جلب الطلبات: ${error.message}`);
  return data;
}

export async function reviewPaymentRequest(
  requestId: string,
  status: 'approved' | 'rejected',
  rejectionReason?: string
) {
  const { profile: reviewer } = await requireRole(['admin', 'teacher_assistant']);
  const supabase = createAdminClient();

  const { data: request, error: fetchError } = await supabase
    .from('payment_requests')
    .select('*')
    .eq('id', requestId)
    .single();

  if (fetchError || !request) throw new Error('طلب الدفع غير موجود');

  const { error: updateError } = await supabase
    .from('payment_requests')
    .update({
      status,
      reviewer_id: reviewer.id,
      rejection_reason: rejectionReason || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', requestId);

  if (updateError) throw new Error(`فشل تحديث حالة الطلب: ${updateError.message}`);

  if (status === 'approved') {
    // Automatically enroll student upon approval
    const { error: enrollError } = await supabase
      .from('enrollments')
      .upsert({
        student_id: request.student_id,
        course_id: request.course_id,
        enrolled_at: new Date().toISOString(),
      }, { onConflict: 'student_id,course_id' });

    if (enrollError) throw new Error(`فشل تفعيل الكورس للطالب: ${enrollError.message}`);
  }

  return { success: true };
}

export async function generateAccessCodes(courseId: string, count: number = 10) {
  const { profile } = await requireRole(['admin', 'teacher_assistant']);
  const supabase = createAdminClient();

  const codesToInsert = Array.from({ length: count }).map(() => {
    const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
    return {
      code: `ELMOHANDES-${randomHex}`,
      course_id: courseId,
      created_by: profile.id,
    };
  });

  const { data, error } = await supabase
    .from('access_codes')
    .insert(codesToInsert)
    .select();

  if (error) throw new Error(`فشل إنشاء الأكواد: ${error.message}`);
  return data as AccessCode[];
}
