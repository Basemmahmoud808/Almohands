'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, ChevronLeft, Calendar, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface CourseItem {
  id: string;
  title: string;
  badge: string;
  badgeColor: string;
  price: string;
  date: string;
  isFree?: boolean;
  image: string;
}

const COURSES_DATA: CourseItem[] = [
  {
    id: 'c-sec1',
    title: 'كورس الجبر والمثلثات والهندسة التحليلية — 1 ثانوي',
    badge: '1 ثانوي عام',
    badgeColor: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-500/20 dark:text-cyan-400 border-cyan-300 dark:border-cyan-500/40',
    price: '180 ج.م',
    date: '1 سبتمبر 2026',
    image: '/images/teacher_reda_kheirat.jpg',
  },
  {
    id: 'c-prep3',
    title: 'كورس الرياضيات الشامل وحساب المثلثات — 3 إعدادي',
    badge: 'الشهادة الإعدادية',
    badgeColor: 'bg-amber-100 text-amber-900 dark:bg-amber-500/20 dark:text-amber-400 border-amber-300 dark:border-amber-500/40',
    price: '150 ج.م',
    date: '10 سبتمبر 2026',
    image: '/images/teacher_reda_kheirat.jpg',
  },
  {
    id: 'c-prep2',
    title: 'كورس الجبر والإحصاء والهندسة — 2 إعدادي',
    badge: '2 إعدادي',
    badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-400 border-purple-300 dark:border-purple-500/40',
    price: '120 ج.م',
    date: '15 سبتمبر 2026',
    image: '/images/teacher_reda_kheirat.jpg',
  },
  {
    id: 'c-prep1',
    title: 'كورس أساسيات الجبر والهندسة — 1 إعدادي',
    badge: '1 إعدادي',
    badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/40',
    price: '100 ج.م',
    date: 'متاح الآن',
    isFree: true,
    image: '/images/teacher_reda_kheirat.jpg',
  },
];

export function CoursesCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? COURSES_DATA.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === COURSES_DATA.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-8">
      {/* Navigation Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 dir-ltr">
          <button
            type="button"
            onClick={prevSlide}
            aria-label="السابق"
            className="w-11 h-11 rounded-2xl bg-white dark:bg-[#111827] border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center hover:bg-[#235d3a] hover:text-white dark:hover:bg-[#235d3a] shadow-sm transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            aria-label="التالي"
            className="w-11 h-11 rounded-2xl bg-white dark:bg-[#111827] border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center hover:bg-[#235d3a] hover:text-white dark:hover:bg-[#235d3a] shadow-sm transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Carousel Indicators Dots */}
        <div className="flex items-center gap-1.5">
          {COURSES_DATA.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              aria-label={`شريحة ${idx + 1}`}
              className={`h-2.5 rounded-full transition-all ${
                currentIndex === idx
                  ? 'w-8 bg-[#235d3a] dark:bg-[#73c088]'
                  : 'w-2.5 bg-slate-300 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Course Cards Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {COURSES_DATA.slice(currentIndex, currentIndex + 3).concat(
          COURSES_DATA.slice(0, Math.max(0, currentIndex + 3 - COURSES_DATA.length))
        ).map((course, idx) => (
          <motion.div
            key={`${course.id}-${idx}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className={`bg-white dark:bg-[#0b0f19] rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-lg hover:shadow-2xl transition-all space-y-5 flex flex-col justify-between h-full border-b-4 border-b-[#73c088] ${
              course.isFree ? 'ring-2 ring-emerald-500/50' : ''
            }`}
          >
            {/* Card Top Poster & Badge */}
            <div className="space-y-4">
              <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-slate-900">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-top opacity-90 hover:scale-105 transition-transform duration-500 hero-image-mask"
                />
                <span className={`absolute top-3 right-3 text-[11px] font-black px-3 py-1 rounded-full border backdrop-blur-md ${course.badgeColor}`}>
                  {course.badge}
                </span>
              </div>

              <h3 className="font-black text-xl text-slate-900 dark:text-white leading-snug">
                {course.title}
              </h3>
            </div>

            {/* Price & Date Info */}
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#235d3a] dark:text-[#73c088]" />
                  <span>بداية المحتوى: {course.date}</span>
                </div>
                <span className="font-black text-base text-[#15803d] dark:text-[#73c088]">
                  {course.price}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href={`/courses`}
                  className="py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-black text-xs text-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  الدخول للكورس
                </Link>

                <Link
                  href="/payments/subscribe"
                  className="py-2.5 rounded-xl bg-[#235d3a] hover:bg-[#1b4a2e] text-white font-black text-xs text-center shadow-md transition-all flex items-center justify-center gap-1 border border-[#73c088]/40"
                >
                  <span>اشترك الآن</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
