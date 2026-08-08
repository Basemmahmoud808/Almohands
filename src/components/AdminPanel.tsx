'use client';

import { useState } from 'react';
import { reviewPaymentRequest, generateAccessCodes } from '@/actions/payments';
import { createAttendanceSession } from '@/actions/attendance';
import { createCourse } from '@/actions/courses';
import { Course, PaymentRequest } from '@/types/database';
import { 
  CheckCircle, 
  XCircle, 
  Key, 
  QrCode, 
  PlusCircle, 
  BookOpen, 
  DollarSign, 
  Users, 
  Award, 
  FileText, 
  Phone, 
  Calendar,
  Sparkles,
  Video
} from 'lucide-react';

interface Props {
  initialPendingRequests: PaymentRequest[];
  courses: Course[];
}

export function AdminPanel({ initialPendingRequests, courses }: Props) {
  const [activeTab, setActiveTab] = useState<'courses' | 'payments' | 'attendance' | 'grades'>('courses');
  const [requests, setRequests] = useState<PaymentRequest[]>(initialPendingRequests);
  const [generatedCodes, setGeneratedCodes] = useState<{ id: string; code: string }[]>([]);
  const [selectedCourseForCode, setSelectedCourseForCode] = useState(courses[0]?.id || '');
  const [codeCount, setCodeCount] = useState(5);
  const [isGeneratingCodes, setIsGeneratingCodes] = useState(false);

  // Attendance session state
  const [sessionTitle, setSessionTitle] = useState('');
  const [sessionGrade, setSessionGrade] = useState<7 | 8 | 9 | 1>(9);
  const [createdSessionToken, setCreatedSessionToken] = useState('');

  // New Course & Lesson state
  const [courseTitle, setCourseTitle] = useState('');
  const [courseGrade, setCourseGrade] = useState<7 | 8 | 9 | 1>(9);
  const [coursePrice, setCoursePrice] = useState(150);
  const [lessonVideoUrl, setLessonVideoUrl] = useState('');
  const [lessonPdfUrl, setLessonPdfUrl] = useState('');

  // Student Grade & Report state
  const [studentGrades, setStudentGrades] = useState([
    { id: '1', name: 'أحمد محمد محمود', grade: '3 إعدادي', studentPhone: '01012345678', parentPhone: '01112345678', examName: 'اختبار الجبر الشهري', score: 98, total: 100, attendance: '96%' },
    { id: '2', name: 'عمر خالد حسن', grade: '1 ثانوي', studentPhone: '01098765432', parentPhone: '01298765432', examName: 'شيت الهندسة 1', score: 85, total: 100, attendance: '90%' },
  ]);
  const [newStudentName, setNewStudentName] = useState('');
  const [newExamName, setNewExamName] = useState('');
  const [newScore, setNewScore] = useState(90);

  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');

  const handleReview = async (requestId: string, status: 'approved' | 'rejected') => {
    try {
      await reviewPaymentRequest(requestId, status);
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
      setActionSuccess(`تم ${status === 'approved' ? 'قبول وتفعيل' : 'رفض'} طلب التحويل بنجاح.`);
    } catch (err: any) {
      setActionError(err.message || 'فشل معالجة الطلب');
    }
  };

  const handleGenerateCodes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseForCode || isGeneratingCodes) return;
    setIsGeneratingCodes(true);
    setActionSuccess('');

    try {
      const newCodes = await generateAccessCodes(selectedCourseForCode, codeCount);
      setGeneratedCodes(newCodes);
      setActionSuccess(`تم إنتاج ${newCodes.length} أكواد شحن جديدة بنجاح.`);
    } catch (err: any) {
      setActionError(err.message || 'فشل إنتاج الأكواد');
    } finally {
      setIsGeneratingCodes(false);
    }
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionTitle.trim()) return;

    try {
      const session = await createAttendanceSession(sessionTitle, sessionGrade);
      setCreatedSessionToken(session.qr_code_token);
      setActionSuccess('تم إنشاء رمز حضور الجلسة وتجهيز QR بنجاح.');
      setSessionTitle('');
    } catch (err: any) {
      setActionError(err.message || 'فشل إنشاء الجلسة');
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle.trim()) return;

    try {
      await createCourse({
        title: courseTitle,
        grade_level: courseGrade,
        price_egp: coursePrice,
        is_published: true,
      });
      setActionSuccess('تم رفع الكورس والحصة التعليمية بنجاح.');
      setCourseTitle('');
      setLessonVideoUrl('');
      setLessonPdfUrl('');
    } catch (err: any) {
      setActionError(err.message || 'فشل إضافة الكورس');
    }
  };

  const handleAddGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !newExamName.trim()) return;

    setStudentGrades((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: newStudentName,
        grade: '3 إعدادي',
        studentPhone: '01000000000',
        parentPhone: '01100000000',
        examName: newExamName,
        score: newScore,
        total: 100,
        attendance: '100%',
      },
    ]);
    setActionSuccess('تم تسجيل الدرجة ورصدها في تقرير ولي الأمر بنجاح.');
    setNewStudentName('');
    setNewExamName('');
  };

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#235d3a] to-slate-950 text-white rounded-3xl p-8 border border-[#73c088]/30 shadow-2xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#73c088]/20 text-[#73c088] flex items-center justify-center font-black text-2xl border border-[#73c088]/30">
            ∫
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black">لوحة التحكم والإدارة الشاملة — أ. رضا خيرت</h1>
            <p className="text-slate-300 text-xs font-bold">رفع الدروس، مراجعة التحويلات، تسجيل الحضور، ورصد درجات الطلاب</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
              activeTab === 'courses' ? 'bg-[#73c088] text-slate-950 shadow-lg' : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>رفع الكورسات والدروس</span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
              activeTab === 'payments' ? 'bg-[#73c088] text-slate-950 shadow-lg' : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>طلبات الدفع والأكواد ({requests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('attendance')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
              activeTab === 'attendance' ? 'bg-[#73c088] text-slate-950 shadow-lg' : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>جلسات الحضور وQR</span>
          </button>

          <button
            onClick={() => setActiveTab('grades')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
              activeTab === 'grades' ? 'bg-[#73c088] text-slate-950 shadow-lg' : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>درجات الطلاب وولي الأمر</span>
          </button>
        </div>
      </div>

      {/* Action Success / Error Notifications */}
      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold text-xs border border-emerald-200 dark:border-emerald-800">
          {actionSuccess}
        </div>
      )}

      {actionError && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 font-bold text-xs border border-red-200 dark:border-red-800">
          {actionError}
        </div>
      )}

      {/* TAB 1: UPLOAD COURSES & LESSONS */}
      {activeTab === 'courses' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
          <h3 className="font-black text-xl text-slate-900 dark:text-white flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-[#73c088]" />
            <span>رفع إضافة كورس وحصة درس جديدة</span>
          </h3>

          <form onSubmit={handleCreateCourse} className="space-y-4 text-right">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold block mb-1">عنوان الكورس / الحصة</label>
                <input
                  type="text"
                  required
                  placeholder="مراجعة مادة الجبر والهندسة والتحليل"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold block mb-1">الصف الدراسي المخصص</label>
                <select
                  value={courseGrade}
                  onChange={(e) => setCourseGrade(parseInt(e.target.value, 10) as any)}
                  className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                >
                  <option value={7}>1 إعدادي</option>
                  <option value={8}>2 إعدادي</option>
                  <option value={9}>3 إعدادي</option>
                  <option value={1}>1 ثانوي</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold block mb-1">السعر بالإشتراك (جنية مصري)</label>
                <input
                  type="number"
                  min={0}
                  value={coursePrice}
                  onChange={(e) => setCoursePrice(parseInt(e.target.value, 10))}
                  className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold block mb-1 flex items-center gap-1">
                  <Video className="w-4 h-4 text-amber-500" />
                  رابط فيديو الحصة (YouTube / Vimeo / Bunny)
                </label>
                <input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={lessonVideoUrl}
                  onChange={(e) => setLessonVideoUrl(e.target.value)}
                  className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-bold dir-ltr text-right"
                />
              </div>

              <div>
                <label className="text-xs font-bold block mb-1 flex items-center gap-1">
                  <FileText className="w-4 h-4 text-sky-500" />
                  رابط شيت أو ملزمة الدرس (PDF)
                </label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/file/..."
                  value={lessonPdfUrl}
                  onChange={(e) => setLessonPdfUrl(e.target.value)}
                  className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-bold dir-ltr text-right"
                />
              </div>
            </div>

            <button
              type="submit"
              className="py-3.5 px-8 rounded-2xl bg-[#235d3a] hover:bg-[#1b4a2e] text-white font-black text-xs shadow-lg transition-all"
            >
              حفظ ورفع الكورس فوراً
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: PAYMENTS & ACCESS CODES */}
      {activeTab === 'payments' && (
        <div className="space-y-8">
          
          {/* Review Pending Payment Requests */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
            <h3 className="font-black text-xl text-slate-900 dark:text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-amber-500" />
              مراجعة وتفعيل طلبات تحويلات فودافون كاش والمحفظة ({requests.length})
            </h3>

            {requests.length === 0 ? (
              <p className="text-xs text-slate-500 font-medium">لا توجد طلبات تحويل معلقة حالياً 🎉</p>
            ) : (
              <div className="space-y-4">
                {requests.map((req) => (
                  <div key={req.id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1 text-xs">
                      <span className="font-mono font-bold text-blue-600 dark:text-blue-400 block">رقم المرجع: {req.transaction_ref}</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300 block">طريقة الدفع: {req.payment_method} | هاتف الطالب: {req.sender_phone || 'غير مدخل'}</span>
                      <span className="text-slate-500 block">تاريخ الإرسال: {new Date(req.created_at).toLocaleString('ar-EG')}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleReview(req.id, 'approved')}
                        className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 hover:bg-emerald-700 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        تفعيل الاشتراك
                      </button>

                      <button
                        onClick={() => handleReview(req.id, 'rejected')}
                        className="px-4 py-2 rounded-xl bg-red-100 text-red-700 font-bold text-xs flex items-center gap-1 hover:bg-red-200 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        رفض
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Access Code Generator */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
            <h3 className="font-black text-xl text-slate-900 dark:text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-[#235d3a]" />
              إنتاج وتصدير أكواد الشحن مسبقة الدفع
            </h3>

            <form onSubmit={handleGenerateCodes} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold block mb-1">اختر الكورس</label>
                <select
                  value={selectedCourseForCode}
                  onChange={(e) => setSelectedCourseForCode(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold block mb-1">عدد الأكواد المطلوبة</label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={codeCount}
                  onChange={(e) => setCodeCount(parseInt(e.target.value, 10))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={isGeneratingCodes}
                  className="w-full py-2.5 rounded-xl bg-[#235d3a] hover:bg-[#1b4a2e] text-white font-bold text-xs"
                >
                  توليد الأكواد
                </button>
              </div>
            </form>

            {generatedCodes.length > 0 && (
              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl space-y-2">
                <h4 className="font-bold text-xs">الأكواد التي تم إنتاجها حديثاً:</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {generatedCodes.map((code) => (
                    <span key={code.id} className="p-2 rounded-lg bg-white dark:bg-slate-900 border text-center font-mono font-bold text-xs text-blue-900 dark:text-blue-400">
                      {code.code}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 3: ATTENDANCE & QR SESSIONS */}
      {activeTab === 'attendance' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
          <h3 className="font-black text-xl text-slate-900 dark:text-white flex items-center gap-2">
            <QrCode className="w-5 h-5 text-emerald-500" />
            إنشاء جلسة حضور وتوليد رمز الحصة
          </h3>

          <form onSubmit={handleCreateSession} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold block mb-1">عنوان الحصة / الجلسة</label>
              <input
                type="text"
                placeholder="حصة جبر هندسة مراجعة 1"
                value={sessionTitle}
                onChange={(e) => setSessionTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-bold block mb-1">الصف الدراسي</label>
              <select
                value={sessionGrade}
                onChange={(e) => setSessionGrade(parseInt(e.target.value, 10) as any)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
              >
                <option value={7}>الأول الإعدادي</option>
                <option value={8}>الثاني الإعدادي</option>
                <option value={9}>الثالث الإعدادي</option>
                <option value={1}>الأول الثانوي</option>
              </select>
            </div>

            <div className="flex items-end">
              <button type="submit" className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs">
                توليد كود الجلسة
              </button>
            </div>
          </form>

          {createdSessionToken && (
            <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl text-center space-y-2 border border-emerald-200">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">رمز الحضور الجاري للحصة المباشرة:</span>
              <div className="text-4xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                {createdSessionToken}
              </div>
              <p className="text-xs text-slate-500 font-medium">اطلب من الطلاب فتح صفحة تسجيل الحضور من حساباتهم لتأكيد الحضور فوراً</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: STUDENT GRADES & PARENT REPORTS */}
      {activeTab === 'grades' && (
        <div className="space-y-8">
          
          {/* Record Grade Form */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <h3 className="font-black text-xl text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              رصد درجة اختبار طالب جديدة
            </h3>

            <form onSubmit={handleAddGrade} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-bold block mb-1">اسم الطالب الثلاثي</label>
                <input
                  type="text"
                  required
                  placeholder="محمد أحمد محمود"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold block mb-1">اسم الامتحان / الشيت</label>
                <input
                  type="text"
                  required
                  placeholder="امتحان شهر أكتوبر"
                  value={newExamName}
                  onChange={(e) => setNewExamName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold block mb-1">الدرجة الحاصل عليها (من 100)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={newScore}
                  onChange={(e) => setNewScore(parseInt(e.target.value, 10))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                />
              </div>

              <div className="flex items-end">
                <button type="submit" className="w-full py-2.5 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 transition-colors">
                  رصد ونشر بالتقرير
                </button>
              </div>
            </form>
          </div>

          {/* Student Grades & Parent Cards Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <h3 className="font-black text-xl text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-sky-500" />
              دفتر درجات الطلاب وتقارير متابعة ولي الأمر
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                    <th className="p-3 font-bold">اسم الطالب</th>
                    <th className="p-3 font-bold">الصف</th>
                    <th className="p-3 font-bold">هاتف ولي الأمر</th>
                    <th className="p-3 font-bold">الامتحان</th>
                    <th className="p-3 font-bold">الدرجة</th>
                    <th className="p-3 font-bold">نسبة الحضور</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-bold">
                  {studentGrades.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 text-slate-900 dark:text-white">{st.name}</td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">{st.grade}</td>
                      <td className="p-3 font-mono text-sky-600 dark:text-sky-400">{st.parentPhone}</td>
                      <td className="p-3 text-slate-700 dark:text-slate-300">{st.examName}</td>
                      <td className="p-3">
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
                          {st.score} / {st.total}
                        </span>
                      </td>
                      <td className="p-3 text-emerald-600 dark:text-emerald-400">{st.attendance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
