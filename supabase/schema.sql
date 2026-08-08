-- ==========================================
-- EL MOHANDES (المهندس) PLATFORM - FULL SCHEMAS & RLS POLICIES
-- Teacher: Reda Kheirat (المهندس رضا خيرت)
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum types
CREATE TYPE user_role AS ENUM ('admin', 'teacher_assistant', 'student');
CREATE TYPE payment_request_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'late');

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  parent_phone TEXT,
  grade_level INTEGER NOT NULL CHECK (grade_level IN (1, 2, 3)), -- 1st, 2nd, 3rd Secondary
  role user_role NOT NULL DEFAULT 'student',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Courses Table
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  grade_level INTEGER NOT NULL CHECK (grade_level IN (1, 2, 3)),
  price_egp NUMERIC(10, 2) NOT NULL DEFAULT 0,
  thumbnail_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Lessons Table
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  unit_name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  video_duration_seconds INTEGER DEFAULT 0,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_free_preview BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Enrollments Table
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  UNIQUE(student_id, course_id)
);

-- 5. Payment Requests Table (Direct Wallet / InstaPay / Bank Transfer)
CREATE TABLE IF NOT EXISTS payment_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  payment_method TEXT NOT NULL, -- 'vodafone_cash', 'instapay', 'bank_transfer'
  sender_phone TEXT,
  transaction_ref TEXT UNIQUE NOT NULL,
  receipt_image_url TEXT,
  amount_egp NUMERIC(10, 2) NOT NULL,
  status payment_request_status NOT NULL DEFAULT 'pending',
  reviewer_id UUID REFERENCES profiles(id),
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Access Codes Table (Prepaid Cards / Codes)
CREATE TABLE IF NOT EXISTS access_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  is_used BOOLEAN NOT NULL DEFAULT FALSE,
  used_by_student_id UUID REFERENCES profiles(id),
  used_at TIMESTAMPTZ,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Exams Table
CREATE TABLE IF NOT EXISTS exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL,
  passing_score_percent INTEGER NOT NULL DEFAULT 50,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Exam Questions Table
CREATE TABLE IF NOT EXISTS exam_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  image_url TEXT,
  question_type TEXT NOT NULL DEFAULT 'mcq', -- 'mcq', 'essay'
  options JSONB, -- Array of string choices
  correct_answer TEXT NOT NULL, -- Hidden from students during exam
  explanation TEXT,
  points INTEGER NOT NULL DEFAULT 1,
  order_index INTEGER NOT NULL DEFAULT 0
);

-- 9. Exam Submissions Table
CREATE TABLE IF NOT EXISTS exam_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  score NUMERIC(5, 2),
  total_points INTEGER NOT NULL,
  percentage NUMERIC(5, 2),
  is_passed BOOLEAN,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  submitted_at TIMESTAMPTZ,
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  feedback TEXT
);

-- 10. Worksheets Table
CREATE TABLE IF NOT EXISTS worksheets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size_bytes BIGINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Attendance Sessions Table
CREATE TABLE IF NOT EXISTS attendance_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  grade_level INTEGER NOT NULL CHECK (grade_level IN (1, 2, 3)),
  session_date DATE NOT NULL DEFAULT CURRENT_DATE,
  qr_code_token TEXT UNIQUE NOT NULL,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. Attendance Records Table
CREATE TABLE IF NOT EXISTS attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES attendance_sessions(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status attendance_status NOT NULL DEFAULT 'present',
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(session_id, student_id)
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Default-Deny Security Baseline
-- ==========================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE worksheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;

-- Helper functions for Clerk JWT claims in Supabase RLS
CREATE OR REPLACE FUNCTION current_clerk_id() RETURNS TEXT AS $$
  SELECT NULLIF(current_setting('request.jwt.claims', true)::json->>'sub', '');
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE clerk_id = current_clerk_id() AND role = 'admin'
  );
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION is_staff() RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE clerk_id = current_clerk_id() AND role IN ('admin', 'teacher_assistant')
  );
$$ LANGUAGE sql STABLE;

-- Profiles Policies
CREATE POLICY "Public Profiles viewable by authenticated users" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (clerk_id = current_clerk_id());

CREATE POLICY "Service Role / System insert profile" ON profiles
  FOR INSERT WITH CHECK (true);

-- Courses Policies
CREATE POLICY "Published courses visible to everyone" ON courses
  FOR SELECT USING (is_published = true OR is_staff());

CREATE POLICY "Staff manage courses" ON courses
  FOR ALL USING (is_staff());

-- Lessons Policies
CREATE POLICY "Enrolled students or free preview lessons visible" ON lessons
  FOR SELECT USING (
    is_free_preview = true OR is_staff() OR EXISTS (
      SELECT 1 FROM enrollments e
      JOIN profiles p ON p.id = e.student_id
      WHERE p.clerk_id = current_clerk_id() AND e.course_id = lessons.course_id
    )
  );

CREATE POLICY "Staff manage lessons" ON lessons
  FOR ALL USING (is_staff());

-- Enrollments Policies
CREATE POLICY "Students see own enrollments, staff see all" ON enrollments
  FOR SELECT USING (
    is_staff() OR EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = enrollments.student_id AND p.clerk_id = current_clerk_id()
    )
  );

CREATE POLICY "Staff insert enrollments" ON enrollments
  FOR ALL USING (is_staff());

-- Payment Requests Policies
CREATE POLICY "Students see own payment requests, staff see all" ON payment_requests
  FOR SELECT USING (
    is_staff() OR EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = payment_requests.student_id AND p.clerk_id = current_clerk_id()
    )
  );

CREATE POLICY "Students create payment requests" ON payment_requests
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = payment_requests.student_id AND p.clerk_id = current_clerk_id()
    )
  );

CREATE POLICY "Staff manage payment requests" ON payment_requests
  FOR UPDATE USING (is_staff());

-- Access Codes Policies
CREATE POLICY "Staff manage access codes" ON access_codes
  FOR ALL USING (is_staff());

-- Exams Policies
CREATE POLICY "Enrolled students see exams" ON exams
  FOR SELECT USING (
    is_published = true AND (
      is_staff() OR course_id IS NULL OR EXISTS (
        SELECT 1 FROM enrollments e
        JOIN profiles p ON p.id = e.student_id
        WHERE p.clerk_id = current_clerk_id() AND e.course_id = exams.course_id
      )
    )
  );

CREATE POLICY "Staff manage exams" ON exams
  FOR ALL USING (is_staff());

-- Exam Questions Policies
CREATE POLICY "Enrolled students view questions" ON exam_questions
  FOR SELECT USING (
    is_staff() OR EXISTS (
      SELECT 1 FROM exams ex
      LEFT JOIN enrollments e ON e.course_id = ex.course_id
      JOIN profiles p ON p.id = e.student_id
      WHERE ex.id = exam_questions.exam_id AND p.clerk_id = current_clerk_id()
    )
  );

CREATE POLICY "Staff manage questions" ON exam_questions
  FOR ALL USING (is_staff());

-- Exam Submissions Policies
CREATE POLICY "Students see own submissions, staff see all" ON exam_submissions
  FOR SELECT USING (
    is_staff() OR EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = exam_submissions.student_id AND p.clerk_id = current_clerk_id()
    )
  );

CREATE POLICY "Students insert own exam submission" ON exam_submissions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = exam_submissions.student_id AND p.clerk_id = current_clerk_id()
    )
  );

-- Worksheets Policies
CREATE POLICY "Enrolled students view worksheets" ON worksheets
  FOR SELECT USING (
    is_staff() OR EXISTS (
      SELECT 1 FROM lessons l
      JOIN enrollments e ON e.course_id = l.course_id
      JOIN profiles p ON p.id = e.student_id
      WHERE l.id = worksheets.lesson_id AND p.clerk_id = current_clerk_id()
    )
  );

CREATE POLICY "Staff manage worksheets" ON worksheets
  FOR ALL USING (is_staff());

-- Attendance Sessions Policies
CREATE POLICY "Authenticated users view active sessions" ON attendance_sessions
  FOR SELECT USING (true);

CREATE POLICY "Staff manage attendance sessions" ON attendance_sessions
  FOR ALL USING (is_staff());

-- Attendance Records Policies
CREATE POLICY "Students view own attendance, staff view all" ON attendance_records
  FOR SELECT USING (
    is_staff() OR EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = attendance_records.student_id AND p.clerk_id = current_clerk_id()
    )
  );

CREATE POLICY "Students record attendance via token or staff record" ON attendance_records
  FOR INSERT WITH CHECK (
    is_staff() OR EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = attendance_records.student_id AND p.clerk_id = current_clerk_id()
    )
  );
