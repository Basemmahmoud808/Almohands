'use client';

import { SignIn } from '@clerk/nextjs';
import Link from 'next/link';
import { GradientBackground } from '@/components/ui/gradient-background';
import { Sparkles, ArrowLeft, GraduationCap, ShieldCheck } from 'lucide-react';
import { FadeInUp } from '@/components/MotionContainer';

export default function SignInPage() {
  return (
    <div className="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-12">
      <GradientBackground
        containerClassName="w-full min-h-[85vh] flex items-center justify-center py-12"
        speed="slow"
        intensity="vibrant"
        interactive
      >
        <div className="w-full max-w-md mx-auto px-4 relative z-10 space-y-6">
          
          {/* Header Brand Badge */}
          <FadeInUp delay={0.1}>
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#235d3a]/10 dark:bg-[#235d3a]/50 border border-[#73c088]/40 text-[#15803d] dark:text-[#73c088] text-xs font-black shadow-lg backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-[#15803d] dark:text-[#73c088] animate-pulse" />
                <span>منصة المهندس — أ. رضا خيرت</span>
                <span className="bg-[#73c088]/20 text-[#15803d] dark:text-[#73c088] px-2.5 py-0.5 rounded-md font-mono text-[11px] border border-[#73c088]/30">∫ f(x)</span>
              </div>

              <h1 className="text-3xl font-black text-slate-900 dark:text-white">
                تسجيل الدخول للمنصة
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                أدخل بيانات حسابك للاستمرار ومتابعة دروسك وإنجازك
              </p>
            </div>
          </FadeInUp>

          {/* Clerk SignIn with Custom Theme Styling */}
          <FadeInUp delay={0.25}>
            <div className="flex justify-center">
              <SignIn
                appearance={{
                  elements: {
                    rootBox: "w-full flex justify-center",
                    card: "w-full bg-white/95 dark:bg-[#0b0f19]/90 border border-slate-200 dark:border-slate-800/80 shadow-2xl rounded-3xl backdrop-blur-2xl p-6 sm:p-8 space-y-4",
                    headerTitle: "text-slate-900 dark:text-white font-black text-xl font-sans text-right",
                    headerSubtitle: "text-slate-600 dark:text-slate-400 font-bold text-xs text-right",
                    formButtonPrimary: "bg-[#235d3a] hover:bg-[#1b4a2e] text-white font-black text-xs rounded-2xl py-3.5 border border-[#73c088]/40 shadow-xl transition-all w-full",
                    formFieldInput: "bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-2xl p-3 text-xs font-bold focus:border-[#73c088] focus:outline-hidden",
                    formFieldLabel: "text-slate-800 dark:text-slate-200 font-black text-xs text-right block mb-1",
                    footerActionLink: "text-[#15803d] dark:text-[#73c088] font-black hover:underline text-xs",
                    identityPreviewText: "text-slate-800 dark:text-slate-200 font-bold text-xs",
                    formHeaderTitle: "text-slate-900 dark:text-white font-black text-lg text-right",
                    formHeaderSubtitle: "text-slate-600 dark:text-slate-400 font-medium text-xs text-right",
                    dividerLine: "bg-slate-200 dark:bg-slate-800",
                    dividerText: "text-slate-400 font-bold text-[11px]",
                    socialButtonsBlockButton: "rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-900",
                  },
                }}
              />
            </div>
          </FadeInUp>

          {/* Quick Redirect Link to Custom Student Registration */}
          <FadeInUp delay={0.35}>
            <div className="text-center pt-2">
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                معندكش حساب حتى الآن؟{' '}
                <Link
                  href="/sign-up"
                  className="font-black text-[#15803d] dark:text-[#73c088] hover:underline inline-flex items-center gap-1"
                >
                  <span>سجّل حساب طالب جديد هنا</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </Link>
              </p>
            </div>
          </FadeInUp>

        </div>
      </GradientBackground>
    </div>
  );
}
