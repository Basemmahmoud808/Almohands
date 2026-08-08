# El Mohandes (المهندس) — E-Learning Mathematics Platform

Full-stack e-learning LMS platform for high-school mathematics taught by **Reda Kheirat (المهندس رضا خيرت)**. Built with Next.js 14 App Router, TypeScript, Supabase, Clerk, and Tailwind CSS with full RTL Arabic UI.

---

## 🚀 Key Features

- **Video Courses & Lessons**: Units organization, lesson progress, and free previews.
- **Anti-Cheating Exam System**: MCQ & Essay questions, real-time timer, tab-switch detection, and server-side auto-grading.
- **Custom Egyptian Payment System**: Direct wallet transfers (Vodafone Cash, InstaPay, Bank Transfer) with admin approval queue + One-time Prepaid Access Codes.
- **Attendance System**: Class QR code / Token session generator and student attendance history log.
- **Worksheets & PDF Downloads**: Lesson-linked PDF document attachments.
- **Security & RLS**: Zero-trust default-deny Row Level Security (RLS) on all Supabase tables, Zod server validation, and security headers.

---

## 🛠️ Local Development & Setup

### 1. Environment Configuration

Copy `.env.example` to `.env.local` and set your credentials:

```bash
cp .env.example .env.local
```

Fill in your:
- Clerk publishable key & secret key
- Supabase URL & keys (Anon key & Service Role key)
- Teacher details & payment wallet numbers

### 2. Supabase Database Migration

Executes the full SQL schema and RLS policies in `supabase/schema.sql` inside your Supabase project's SQL Editor:

```bash
supabase/schema.sql
```

### 3. Install Dependencies & Start Local Server

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔒 Security Documentation

Refer to [SECURITY.md](./SECURITY.md) for the complete Threat Modeling Matrix, RLS Policies, Anti-Cheating mechanisms, and closed vulnerabilities log.
