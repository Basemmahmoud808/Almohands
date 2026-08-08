import Link from 'next/link';
import Image from 'next/image';
import { FadeInUp, HoverCard } from '@/components/MotionContainer';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { GradientBackground } from '@/components/ui/gradient-background';
import { 
  BookOpen, 
  Video, 
  CheckCircle2, 
  Clock, 
  Award, 
  Layers, 
  RefreshCw, 
  Users, 
  ArrowLeft
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-24 pb-16">
      
      {/* ----------------------------------------------------
         HERO SECTION (With Animated Gradient Background)
         ---------------------------------------------------- */}
      <section className="relative overflow-hidden">
        <GradientBackground
          containerClassName="pt-12 pb-24 border-b border-slate-200/80 dark:border-slate-800/80"
          speed="medium"
          intensity="vibrant"
          interactive
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Left Content (Text, Headline, CTA) */}
              <div className="lg:col-span-7 space-y-6 text-right order-2 lg:order-1">

                <FadeInUp delay={0.2}>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">
                    منصتك الأولى لتعلم وفهم الرياضيات <br />
                    <span className="emerald-gradient-text">
                      بأسلوب بسيط وممتع
                    </span>
                  </h1>
                </FadeInUp>

                <FadeInUp delay={0.3}>
                  <p className="text-slate-700 dark:text-slate-200 text-base sm:text-lg leading-relaxed max-w-2xl font-medium">
                    أهلاً بيك يا بطل في منصة المهندس رضا خيرت! بنقدملك شرح متكامل ومبسط لمناهج أولى وثانية وثالثة إعدادي وأولى ثانوي، عشان تفهم كل فكرة واستنتاج وتدخل الامتحان وأنت واثق من الـ 100%.
                  </p>
                </FadeInUp>

                <FadeInUp delay={0.4}>
                  <div className="pt-2 flex items-center gap-4">
                    <Link href="/courses">
                      <InteractiveHoverButton text="تصفّح الكورسات" className="w-44 h-12 text-sm font-black bg-[#235d3a] hover:bg-[#1b4a2e] text-white border border-[#73c088]/40 shadow-xl" />
                    </Link>

                    <Link href="/payments/subscribe" className="px-6 py-3.5 rounded-2xl bg-slate-200/80 hover:bg-slate-300 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-white font-bold text-xs border border-slate-300 dark:border-white/20 backdrop-blur-md transition-all">
                      تفعيل كورس / اشتراك
                    </Link>
                  </div>
                </FadeInUp>

              </div>

              {/* Right Content — Teacher Portrait Photo (Static & Blended without Movement or Box) */}
              <div className="lg:col-span-5 flex justify-center order-1 lg:order-2">
                <FadeInUp delay={0.25} className="w-full max-w-md relative">
                  
                  {/* Math Symbol Floating Badge */}
                  <div className="absolute top-0 right-2 z-20 w-10 h-10 rounded-2xl bg-[#235d3a] dark:bg-[#235d3a]/80 border border-[#73c088]/40 text-white dark:text-[#73c088] flex items-center justify-center font-black text-xl shadow-xl backdrop-blur-md">
                    ∫
                  </div>

                  <div className="relative w-full aspect-[4/5]">
                    <Image
                      src="/images/teacher_reda_kheirat.png"
                      alt="المهندس رضا خيرت — دروس الرياضيات"
                      fill
                      priority
                      loading="eager"
                      sizes="(max-width: 768px) 100vw, 40vw"
                      className="object-cover object-top hero-photo-seamless select-none pointer-events-none"
                    />
                  </div>

                </FadeInUp>
              </div>

            </div>
          </div>
        </GradientBackground>
      </section>

      {/* ----------------------------------------------------
         SECTION 4: "ليه تشترك معانا؟" (Dynamic Light/Dark Theme Cards)
         ---------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <FadeInUp>
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
              ليه تختار منصة المهندس رضا خيرت؟
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl mx-auto font-medium">
              8 مميزات تضمنلك التفوق والوصول لأعلى الدرجات في مادة الرياضيات بأسهل طريقة.
            </p>
          </div>
        </FadeInUp>

        {/* 4x2 Grid on Desktop, 1 Column on Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <HoverCard>
            <div className="bg-white dark:bg-[#0b0f19] text-slate-900 dark:text-white p-6 rounded-3xl border border-slate-200 dark:border-slate-800 border-b-4 border-b-[#73c088] space-y-4 shadow-sm hover:shadow-xl transition-all h-full flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#235d3a]/10 dark:bg-[#235d3a]/60 text-[#235d3a] dark:text-[#73c088] flex items-center justify-center font-black">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="font-black text-lg text-slate-900 dark:text-white">شرح مبسط لكل درس</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">خطوات تفصيلية واضحة تبدأ معك من الصفر حتى استنتاج أعقد أفكار الامتحانات.</p>
              </div>
              <div className="w-full h-1 bg-[#73c088] rounded-full opacity-90" />
            </div>
          </HoverCard>

          <HoverCard>
            <div className="bg-white dark:bg-[#0b0f19] text-slate-900 dark:text-white p-6 rounded-3xl border border-slate-200 dark:border-slate-800 border-b-4 border-b-[#73c088] space-y-4 shadow-sm hover:shadow-xl transition-all h-full flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black">
                  <Video className="w-6 h-6" />
                </div>
                <h3 className="font-black text-lg text-slate-900 dark:text-white">رسومات توضيحية 3D</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">فيديوهات عالية الجودة لتخيل الهندسة الفراغية والاستاتيكا بوضوح تام.</p>
              </div>
              <div className="w-full h-1 bg-[#73c088] rounded-full opacity-90" />
            </div>
          </HoverCard>

          <HoverCard>
            <div className="bg-white dark:bg-[#0b0f19] text-slate-900 dark:text-white p-6 rounded-3xl border border-slate-200 dark:border-slate-800 border-b-4 border-b-[#73c088] space-y-4 shadow-sm hover:shadow-xl transition-all h-full flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#235d3a]/10 dark:bg-[#235d3a]/60 text-[#235d3a] dark:text-[#73c088] flex items-center justify-center font-black">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-black text-lg text-slate-900 dark:text-white">تمارين تفاعلية</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">شيتات وتطبيقات مباشرة عقب كل فيديو للتأكد من تثبيت الفهم أسبوعياً.</p>
              </div>
              <div className="w-full h-1 bg-[#73c088] rounded-full opacity-90" />
            </div>
          </HoverCard>

          <HoverCard>
            <div className="bg-white dark:bg-[#0b0f19] text-slate-900 dark:text-white p-6 rounded-3xl border border-slate-200 dark:border-slate-800 border-b-4 border-b-[#73c088] space-y-4 shadow-sm hover:shadow-xl transition-all h-full flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-900/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-black">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="font-black text-lg text-slate-900 dark:text-white">مرونة مذاكرة كاملة</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">إمكانية الوصول والمنصة مفتوحة لك في أي وقت ومن أي مكان 24/7.</p>
              </div>
              <div className="w-full h-1 bg-[#73c088] rounded-full opacity-90" />
            </div>
          </HoverCard>

          <HoverCard>
            <div className="bg-white dark:bg-[#0b0f19] text-slate-900 dark:text-white p-6 rounded-3xl border border-slate-200 dark:border-slate-800 border-b-4 border-b-[#73c088] space-y-4 shadow-sm hover:shadow-xl transition-all h-full flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-[#1e293b] text-amber-600 dark:text-amber-400 flex items-center justify-center font-black">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="font-black text-lg text-slate-900 dark:text-white">اختبارات دورية ذكية</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">امتحانات بتصحيح تلقائي وتحديد زمن الإجابة لمنع التشتت والتقييم الحقيقي.</p>
              </div>
              <div className="w-full h-1 bg-[#73c088] rounded-full opacity-90" />
            </div>
          </HoverCard>

          <HoverCard>
            <div className="bg-white dark:bg-[#0b0f19] text-slate-900 dark:text-white p-6 rounded-3xl border border-slate-200 dark:border-slate-800 border-b-4 border-b-[#73c088] space-y-4 shadow-sm hover:shadow-xl transition-all h-full flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-[#1e293b] text-blue-600 dark:text-blue-400 flex items-center justify-center font-black">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="font-black text-lg text-slate-900 dark:text-white">محتوى منظم وشامل</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">تنسيق وتدرج طبيعي لكل المنهج من المفاهيم الأساسية للأفكار المتقدمة.</p>
              </div>
              <div className="w-full h-1 bg-[#73c088] rounded-full opacity-90" />
            </div>
          </HoverCard>

          <HoverCard>
            <div className="bg-white dark:bg-[#0b0f19] text-slate-900 dark:text-white p-6 rounded-3xl border border-slate-200 dark:border-slate-800 border-b-4 border-b-[#73c088] space-y-4 shadow-sm hover:shadow-xl transition-all h-full flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#235d3a]/10 dark:bg-[#235d3a]/60 text-[#235d3a] dark:text-[#73c088] flex items-center justify-center font-black">
                  <RefreshCw className="w-6 h-6" />
                </div>
                <h3 className="font-black text-lg text-slate-900 dark:text-white">تحديث مستمر للمناهج</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">متابعة فورية لأحدث التعديلات والنماذج الاسترشادية من وزارة التربية والتعليم.</p>
              </div>
              <div className="w-full h-1 bg-[#73c088] rounded-full opacity-90" />
            </div>
          </HoverCard>

          <HoverCard>
            <div className="bg-[#0b0f19] text-white p-6 rounded-3xl border border-slate-800 border-b-4 border-b-[#73c088] space-y-4 shadow-sm hover:shadow-xl transition-all h-full flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#235d3a]/60 text-[#73c088] flex items-center justify-center font-black">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="font-black text-lg text-white">مجتمع طلابي للمذاكرة</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">متابعة أسئلتك والرد المستمر من فريق المساعدين لمعالجة أي نقطة تقف معك.</p>
              </div>
              <div className="w-full h-1 bg-[#73c088] rounded-full opacity-90" />
            </div>
          </HoverCard>

        </div>
      </section>

      {/* ----------------------------------------------------
         SECTION 6: MOTIVATIONAL DIVIDER BANNER (Emerald Gradient)
         ---------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <div className="relative rounded-3xl bg-gradient-to-r from-blue-900 via-[#235d3a] to-blue-950 dark:from-[#060913] dark:via-[#235d3a] dark:to-[#060913] border border-[#73c088]/40 p-10 sm:p-16 text-center space-y-6 overflow-hidden shadow-2xl">
            
            {/* Math Watermark Accents */}
            <div className="absolute inset-0 math-grid-bg opacity-30 pointer-events-none" />
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[#73c088]/20 blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                يلا نبدأ رحلتك مع الرياضيات ونحقق 100%!
              </h2>
              <p className="text-slate-200 text-sm sm:text-base font-medium">
                أنشئ حسابك الآن مجاناً وابدأ تجربة المحتوى والامتحانات التفاعلية بنفسك.
              </p>

              <div className="pt-4">
                <Link
                  href="/sign-up"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#73c088] hover:bg-[#5fa873] text-slate-950 font-black text-base shadow-xl transition-all border border-white/20"
                >
                  <span>سجّل حسابك في دقيقة</span>
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              </div>
            </div>

          </div>
        </FadeInUp>
      </section>

    </div>
  );
}
