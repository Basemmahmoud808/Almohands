export type UserRole = 'admin' | 'teacher_assistant' | 'student';
export type PaymentRequestStatus = 'pending' | 'approved' | 'rejected';
export type AttendanceStatus = 'present' | 'absent' | 'late';
export type GradeLevel = 7 | 8 | 9 | 1; // 7 = 1st Prep, 8 = 2nd Prep, 9 = 3rd Prep, 1 = 1st Secondary

export interface Profile {
  id: string;
  clerk_id: string;
  full_name: string;
  email: string;
  phone?: string;
  parent_phone?: string;
  grade_level: GradeLevel;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  title: string;
  description?: string;
  grade_level: GradeLevel;
  price_egp: number;
  thumbnail_url?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: string;
  course_id: string;
  unit_name: string;
  title: string;
  description?: string;
  video_url: string;
  video_duration_seconds: number;
  order_index: number;
  is_free_preview: boolean;
  created_at: string;
  updated_at: string;
}

export interface Enrollment {
  id: string;
  student_id: string;
  course_id: string;
  enrolled_at: string;
  expires_at?: string;
}

export interface PaymentRequest {
  id: string;
  student_id: string;
  course_id: string;
  payment_method: string;
  sender_phone?: string;
  transaction_ref: string;
  receipt_image_url?: string;
  amount_egp: number;
  status: PaymentRequestStatus;
  reviewer_id?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface AccessCode {
  id: string;
  code: string;
  course_id: string;
  is_used: boolean;
  used_by_student_id?: string;
  used_at?: string;
  created_by?: string;
  created_at: string;
}

export interface Exam {
  id: string;
  course_id?: string;
  title: string;
  description?: string;
  duration_minutes: number;
  passing_score_percent: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ExamQuestion {
  id: string;
  exam_id: string;
  question_text: string;
  image_url?: string;
  question_type: 'mcq' | 'essay';
  options?: string[]; // Choice options for MCQ
  correct_answer?: string; // Excluded from student API response
  explanation?: string;
  points: number;
  order_index: number;
}

export interface ExamSubmission {
  id: string;
  exam_id: string;
  student_id: string;
  score?: number;
  total_points: number;
  percentage?: number;
  is_passed?: boolean;
  started_at: string;
  submitted_at?: string;
  answers: Record<string, string>; // question_id -> student_answer
  feedback?: string;
}

export interface Worksheet {
  id: string;
  lesson_id: string;
  title: string;
  file_url: string;
  file_size_bytes?: number;
  created_at: string;
}

export interface AttendanceSession {
  id: string;
  title: string;
  grade_level: GradeLevel;
  session_date: string;
  qr_code_token: string;
  created_by?: string;
  created_at: string;
}

export interface AttendanceRecord {
  id: string;
  session_id: string;
  student_id: string;
  status: AttendanceStatus;
  recorded_at: string;
}
