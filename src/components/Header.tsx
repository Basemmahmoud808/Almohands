'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton, SignInButton, SignUpButton, Show } from '@clerk/nextjs';
import { ThemeToggle } from '@/components/ThemeToggle';
import { BookOpen, GraduationCap, Award, QrCode, CreditCard, Menu, X } from 'lucide-react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/courses', label: 'الكورسات والدروس', icon: BookOpen, activeColor: 'text-[#73c088]' },
    { href: '/exams', label: 'الامتحانات الإلكترونية', icon: Award, activeColor: 'text-amber-400' },
    { href: '/attendance', label: 'تسجيل الحضور', icon: QrCode, activeColor: 'text-emerald-400' },
    { href: '/payments/subscribe', label: 'تفعيل كورس / اشتراك', icon: CreditCard, activeColor: 'text-cyan-400' },
  ];

  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-slate-200/80 dark:border-slate-800/80 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Right Section: Brand Logo */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#235d3a] via-emerald-800 to-slate-900 text-[#73c088] flex items-center justify-center font-black text-2xl shadow-lg group-hover:scale-105 transition-transform border border-[#73c088]/30">
              ∫
            </div>
            <div>
              <h1 className="font-black text-lg text-slate-900 dark:text-white leading-tight flex items-center gap-1.5">
                <span>المهندس</span>
                <span className="text-[#73c088] font-mono text-xs px-1.5 py-0.5 rounded-md bg-[#235d3a]/20 border border-[#73c088]/30">f(x)</span>
              </h1>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 font-extrabold">
                أ. رضا خيرت — رياضيات
              </p>
            </div>
          </Link>
        </div>

        {/* Center: Navigation Links (Only shown when signed-in) */}
        <Show when="signed-in">
          <nav className="hidden lg:flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/80">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-white dark:bg-[#235d3a] text-slate-900 dark:text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${link.activeColor}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </Show>

        {/* Left Actions: Theme Toggle + Auth Buttons */}
        <div className="flex items-center gap-3">
          
          {/* Theme Toggle Pill directly next to Auth */}
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>

          <Show when="signed-in">
            <Link
              href="/dashboard"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-[#235d3a]/20 text-[#235d3a] dark:text-[#73c088] hover:bg-[#235d3a]/30 font-black text-xs transition-colors border border-[#73c088]/30"
            >
              <GraduationCap className="w-4 h-4 text-[#73c088]" />
              <span>لوحة الطالب</span>
            </Link>
            <UserButton />
          </Show>

          <Show when="signed-out">
            <div className="flex items-center gap-2.5">
              <SignInButton mode="modal">
                <button className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-black text-xs transition-all shadow-xs">
                  تسجيل الدخول
                </button>
              </SignInButton>

              <SignUpButton mode="modal">
                <button className="px-5 py-2 rounded-xl bg-[#235d3a] hover:bg-[#1b4a2e] text-white font-black text-xs shadow-md hover:shadow-[#73c088]/20 transition-all border border-[#73c088]/30">
                  حساب جديد
                </button>
              </SignUpButton>
            </div>
          </Show>

          {/* Mobile Menu Toggle Button (Only shown when signed-in) */}
          <Show when="signed-in">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </Show>
        </div>

      </div>

      {/* Mobile Drawer Menu (Only shown when signed-in) */}
      <Show when="signed-in">
        {mobileMenuOpen && (
          <div className="lg:hidden p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0f19] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-500">مظهر المنصة</span>
              <ThemeToggle />
            </div>

            <div className="space-y-1.5 pt-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`p-3 rounded-xl text-xs font-black flex items-center gap-2.5 transition-colors ${
                      isActive
                        ? 'bg-[#235d3a] text-white'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </Show>
    </header>
  );
}
