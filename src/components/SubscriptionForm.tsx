'use client';

import { useState } from 'react';
import { submitPaymentRequest, redeemAccessCode } from '@/actions/payments';
import { Course } from '@/types/database';
import { CreditCard, Key, CheckCircle, AlertTriangle, Loader2, Phone, QrCode } from 'lucide-react';

interface Props {
  courses: Course[];
  initialCourseId?: string;
}

export function SubscriptionForm({ courses, initialCourseId }: Props) {
  const [activeTab, setActiveTab] = useState<'code' | 'wallet'>('code');

  // Code state
  const [accessCodeInput, setAccessCodeInput] = useState('');
  
  // Wallet state
  const [selectedCourseId, setSelectedCourseId] = useState(initialCourseId || courses[0]?.id || '');
  const [paymentMethod, setPaymentMethod] = useState<'vodafone_cash' | 'instapay' | 'bank_transfer'>('vodafone_cash');
  const [senderPhone, setSenderPhone] = useState('');
  const [transactionRef, setTransactionRef] = useState('');
  const [receiptUrl, setReceiptUrl] = useState('');

  // Status state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRedeemCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessCodeInput.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      await redeemAccessCode({ code: accessCodeInput.trim() });
      setSuccessMessage('تم شحن الكود وتفعيل اشتراك الكورس بنجاح! 🎉');
      setAccessCodeInput('');
    } catch (err: any) {
      setErrorMessage(err.message || 'فشل تفعيل كود الشحن');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWalletSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId || !transactionRef.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      await submitPaymentRequest({
        course_id: selectedCourseId,
        payment_method: paymentMethod,
        sender_phone: senderPhone,
        transaction_ref: transactionRef.trim(),
        receipt_image_url: receiptUrl.trim() || undefined,
      });
      setSuccessMessage('تم إرسال تفاصيل التحويل بنجاح! سيتم مراجعة الطلب وتفعيل الكورس خلال دقائق. 🚀');
      setTransactionRef('');
      setSenderPhone('');
    } catch (err: any) {
      setErrorMessage(err.message || 'فشل إرسال طلب التحويل');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-8 max-w-2xl mx-auto">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">تفعيل الاشتراك في الكورسات</h2>
        <p className="text-xs text-slate-500">اختر طريقة الدفع المناسبة لك لشحن كود أو إرسال تفاصيل تحويل المحفظة.</p>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('code')}
          className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'code'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Key className="w-4 h-4" />
          شحن كود الاشتراك
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('wallet')}
          className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'wallet'
              ? 'bg-blue-900 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          تحويل محفظة / إنستا باي
        </button>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 font-bold text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 font-bold text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Tab 1: Access Code */}
      {activeTab === 'code' && (
        <form onSubmit={handleRedeemCode} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              كود الاشتراك / الشحن
            </label>
            <input
              type="text"
              placeholder="مثال: ELMOHANDES-X89A21"
              value={accessCodeInput}
              onChange={(e) => setAccessCodeInput(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white font-mono font-bold text-sm tracking-wider uppercase focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !accessCodeInput.trim()}
            className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                جاري تفعيل الكود...
              </>
            ) : (
              'تفعيل الكود'
            )}
          </button>
        </form>
      )}

      {/* Tab 2: Direct Wallet Transfer */}
      {activeTab === 'wallet' && (
        <form onSubmit={handleWalletSubmit} className="space-y-5">
          
          {/* Payment Details Box */}
          <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
            <h4 className="font-bold text-amber-400">بيانات التحويل المباشر:</h4>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>فودافون كاش: <strong>01000000000</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <QrCode className="w-4 h-4 text-blue-400" />
              <span>معرف إنستا باي: <strong>reda_kheirat@instapay</strong></span>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              اختر الكورس المراد تفعيله
            </label>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white font-bold text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-900"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title} — ({c.price_egp} ج.م)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                طريقة التحويل
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white font-bold text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-900"
              >
                <option value="vodafone_cash">فودافون كاش</option>
                <option value="instapay">إنستا باي (InstaPay)</option>
                <option value="bank_transfer">تحويل بنكي</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                رقم المحفظة / الهاتف المحول منه
              </label>
              <input
                type="text"
                placeholder="010XXXXXXXX"
                value={senderPhone}
                onChange={(e) => setSenderPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white font-bold text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-900"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              رقم العملية / المرجعي (Transaction Ref)
            </label>
            <input
              type="text"
              placeholder="مثال: 9876543210"
              value={transactionRef}
              onChange={(e) => setTransactionRef(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white font-mono font-bold text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-900"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !transactionRef.trim()}
            className="w-full py-3.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                جاري إرسال الطلب...
              </>
            ) : (
              'إرسال طلب التفعيل'
            )}
          </button>
        </form>
      )}

    </div>
  );
}
