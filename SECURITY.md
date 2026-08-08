# SECURITY.md — El Mohandes Platform Security Architecture & Audit Log

## Security Mandate
El Mohandes platform processes user data (high-school minors) and financial access transactions (InstaPay, Vodafone Cash, Bank transfers, Prepaid Access Codes). Security is enforced by default at every layer (App Router, Server Actions, Middleware, and Supabase Row Level Security).

---

## 1. Zero-Trust Access Control & RLS Matrix

| Table | SELECT Policy | INSERT Policy | UPDATE Policy | DELETE Policy | Threat Model / Vulnerability Mitigated |
|---|---|---|---|---|---|
| `profiles` | Own profile OR admin/teacher_assistant | Service Role / User Signup Trigger | Own profile OR admin | Admin only | Prevents student profile impersonation & PII leak |
| `courses` | Published courses (Public) / All (Admin) | Admin only | Admin only | Admin only | Prevents unauthorized course modification / price tampering |
| `lessons` | Enrolled students OR admin | Admin only | Admin only | Admin only | Unenrolled users cannot retrieve lesson video URLs |
| `enrollments` | Student (own enrollment) OR admin | Admin / Approved Payment system | Admin only | Admin only | IDOR prevention on course enrollment records |
| `payment_requests` | Student (own requests) OR admin | Authenticated Student | Admin / Assistant (Approve/Reject) | Admin only | Prevents financial fraud & status tampering by students |
| `access_codes` | Admin only | Admin only | Admin / System Redeem | Admin only | Students cannot enumerate or guess unused codes |
| `exams` | Enrolled students OR admin | Admin only | Admin only | Admin only | Unenrolled users cannot access exam questions |
| `exam_questions` | Active exam taker (Excludes `correct_answer`) OR admin | Admin only | Admin only | Admin only | Prevents client-side cheat inspection before submission |
| `exam_submissions` | Own submissions OR admin | Authenticated Student (Active session) | System Auto-grader / Admin | Admin only | Students cannot alter their exam scores post-submission |
| `worksheets` | Enrolled students OR admin | Admin only | Admin only | Admin only | Protects course PDFs from direct public linking |
| `attendance_sessions` | Authenticated users | Admin / Assistant | Admin / Assistant | Admin only | Prevents unauthorized session creation |
| `attendance_records` | Student (own history) OR admin | Student (via valid session token) OR Admin | Admin only | Admin only | Prevents forged attendance logs |

---

## 2. Server Action & API Security Protocol

- **Session Verification**: Every Server Action invokes `await auth()` from Clerk and validates the user role via Supabase JWT claims before executing.
- **Input Validation**: All payload parameters are parsed using `zod` schemas. Invalid types, oversized inputs, and malformed strings are rejected at the edge.
- **No Client-Exposed Secrets**: Private API keys (`SUPABASE_SERVICE_ROLE_KEY`, `CLERK_SECRET_KEY`) reside exclusively in server execution contexts and are never bundled into client bundles.

---

## 3. Anti-Cheating & Exam Integrity Mechanisms

- **Server-Side Grading**: Exam questions choices are delivered to the client without `correct_answer` fields. Answers are submitted to a server action that computes points and percentage strictly on the server.
- **Single Active Exam Session**: Exam submissions track `started_at` and `submitted_at` timestamps. Submissions beyond `duration_minutes + 2 min buffer` are auto-flagged or auto-rejected.

---

## 4. Audit Log & Self-Review Vulnerability Closing Matrix

| Vulnerability ID | Description | Hypothetical Attack Vector | Defense Implemented & Closed | Verification Test |
|---|---|---|---|---|
| `VULN-001` | Exam Answer Inspection | Student opens Chrome DevTools during exam to read correct answers in JSON response. | `exam_questions` API/Action filters out `correct_answer` column for non-admin requests. | Verified query payload does not contain `correct_answer` key for student role. |
| `VULN-002` | Enrollment Price Bypass | Student modifies `amount_egp` or `course_id` client-side during payment request. | Payment amount is resolved server-side from `courses` table based on `course_id`. | Client input `amount_egp` is ignored; server calculates actual course price. |
| `VULN-003` | Access Code Reuse Attack | Student attempts to redeem the same code twice or concurrently. | DB constraint `is_used = FALSE` checked inside a serializable transaction/atomic update. | Multi-threaded redemption test returns `already_used` error on second attempt. |
| `VULN-004` | Attendance Token Spoofing | Student submits fake attendance record without attending. | Attendance sessions generate a cryptographically random `qr_code_token` with expiration. | Submitting invalid/expired token returns `400 Bad Request`. |
