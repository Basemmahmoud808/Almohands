'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSignUp } from '@clerk/nextjs';
import { GraduationCap, Phone, User, Sparkles, ArrowLeft, ShieldCheck, AlertCircle } from 'lucide-react';

export function StudentSignUpForm() {
  const clerkSignUp = useSignUp() as any;
  const { isLoaded, signUp, setActive } = clerkSignUp || {};
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [gradeLevel, setGradeLevel] = useState<7 | 8 | 9 | 1>(9);
  const [confirmAccuracy, setConfirmAccuracy] = useState(false);

  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // 1. Validate full name (minimum 3 words)
    const nameParts = fullName.trim().split(/\s+/);
    if (nameParts.length < 3) {
      setErrorMsg('يرجى إدخال الاسم الثلاثي بالكامل (مثال: أحمد محمد محمود).');
      return;
    }

    // 2. Validate Egyptian phone numbers
    const phoneRegex = /^01[0125]\d{8}$/;
    if (!phoneRegex.test(studentPhone)) {
      setErrorMsg('يرجى إدخال رقم هاتف طالب صحيح يتكون من 11 رقم يبدأ بـ (010, 011, 012, 015).');
      return;
    }

    if (!phoneRegex.test(parentPhone)) {
      setErrorMsg('يرجى إدخال رقم هاتف ولي أمر صحيح يتكون من 11 رقم يبدأ بـ (010, 011, 012, 015).');
      return;
    }

    if (studentPhone === parentPhone) {
      setErrorMsg('رقم هاتف ولي الأمر يجب أن يكون مختلفاً عن رقم هاتف الطالب.');
      return;
    }

    // 3. Validate Password length
    if (password.length < 6) {
      setErrorMsg('يرجى كتابة كلمة مرور تتكون من 6 خانات أو أكثر.');
      return;
    }

    // 4. Validate Confirmation Checkbox
    if (!confirmAccuracy) {
      setErrorMsg('يجب الموافقة وتأكيد صحة المعلومات المدخلة للمتابعة.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (signUp) {
        const result = await signUp.create({
          firstName: nameParts[0],
          lastName: nameParts.slice(1).join(' '),
          phoneNumber: `+2${studentPhone}`,
          password,
          unsafeMetadata: {
            fullName,
            studentPhone,
            parentPhone,
            gradeLevel,
          },
        });

        if (result?.status === 'complete' && setActive) {
          await setActive({ session: result.createdSessionId });
          router.push('/dashboard');
          return;
        }
      }
      
      // Fallback redirection
      router.push('/courses');
    } catch (err: any) {
      if (err.errors?.[0]?.longMessage) {
        setErrorMsg(err.errors[0].longMessage);
      } else {
        // Safe redirect
        router.push('/courses');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white dark:bg-[#0b0f19] rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
      
      {/* Form Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#235d3a]/10 dark:bg-[#235d3a]/40 text-[#15803d] dark:text-[#73c088] text-xs font-black">
          <Sparkles className="w-4 h-4" />
          <span>إنشاء حساب طالب جديد — منصة المهندس</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          سجّل بياناتك للبدء في المذاكرة
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-xs font-medium">
          يرجى إدخال البيانات بدقة تامة لتفعيل متابعة ولي الأمر وتأكيد الحضور
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 font-bold text-xs border border-red-200 dark:border-red-800/50 flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 text-right">
        
        {/* Explicit Clerk Captcha Target Container to prevent Console Warning */}
        <div id="clerk-captcha" />

        {/* 1. Full Name (Three names) */}
        <div className="space-y-1.5">
          <label className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <User className="w-4 h-4 text-[#73c088]" />
            <span>الاسم الثلاثي للطالب <span className="text-red-500">*</span></span>
          </label>
          <input
            type="text"
            required
            placeholder="مثال: أحمد محمد محمود"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-bold focus:outline-hidden focus:border-[#73c088]"
          />
        </div>

        {/* 2. Grade Level */}
        <div className="space-y-1.5">
          <label className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-[#73c088]" />
            <span>الصف الدراسي <span className="text-red-500">*</span></span>
          </label>
          <select
            value={gradeLevel}
            onChange={(e) => setGradeLevel(parseInt(e.target.value, 10) as any)}
            className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-bold focus:outline-hidden focus:border-[#73c088]"
          >
            <option value={7}>الصف الأول الإعدادي (1 إعدادي)</option>
            <option value={8}>الصف الثاني الإعدادي (2 إعدادي)</option>
            <option value={9}>الصف الثالث الإعدادي (3 إعدادي - الشهادة)</option>
            <option value={1}>الصف الأول الثانوي (1 ثانوي عام)</option>
          </select>
        </div>

        {/* 3. Student Phone */}
        <div className="space-y-1.5">
          <label className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Phone className="w-4 h-4 text-sky-500" />
            <span>رقم هاتف الطالب (الموبايل) <span className="text-red-500">*</span></span>
          </label>
          <input
            type="tel"
            required
            maxLength={11}
            placeholder="01012345678"
            value={studentPhone}
            onChange={(e) => setStudentPhone(e.target.value)}
            className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-bold dir-ltr text-right focus:outline-hidden focus:border-[#73c088]"
          />
        </div>

        {/* 4. Parent Phone */}
        <div className="space-y-1.5">
          <label className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Phone className="w-4 h-4 text-emerald-500" />
            <span>رقم هاتف ولي الأمر <span className="text-red-500">*</span></span>
          </label>
          <input
            type="tel"
            required
            maxLength={11}
            placeholder="01112345678"
            value={parentPhone}
            onChange={(e) => setParentPhone(e.target.value)}
            className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-bold dir-ltr text-right focus:outline-hidden focus:border-[#73c088]"
          />
        </div>

        {/* 5. Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <span>كلمة المرور للحساب <span className="text-red-500">*</span></span>
          </label>
          <input
            type="password"
            required
            minLength={6}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-bold focus:outline-hidden focus:border-[#73c088]"
          />
        </div>

        {/* 6. Confirmation of Information Accuracy */}
        <div className="pt-2">
          <label className="flex items-start gap-3 cursor-pointer p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <input
              type="checkbox"
              checked={confirmAccuracy}
              onChange={(e) => setConfirmAccuracy(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded-md text-[#235d3a] focus:ring-[#73c088]"
            />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-relaxed">
              أقر وأؤكد بأن جميع البيانات الموضحة أعلاه (الاسم الثلاثي، رقم الطالب، رقم ولي الأمر، والصف الدراسي) صحيحة ودقيقة دقة كاملة.
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 rounded-2xl bg-[#235d3a] hover:bg-[#1b4a2e] text-white font-black text-sm shadow-xl transition-all border border-[#73c088]/40 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <span>جاري إنشاء الحساب والتأكيد...</span>
          ) : (
            <>
              <span>إنشاء الحساب الآن</span>
              <ArrowLeft className="w-5 h-5" />
            </>
          )}
        </button>

      </form>
    </div>
  );
}
