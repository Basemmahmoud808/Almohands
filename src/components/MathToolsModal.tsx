'use client';

import { useState } from 'react';
import { Calculator, BookOpen, X, Sparkles, Sigma, FunctionSquare, Compass, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function MathToolsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'calc' | 'formulas'>('calc');
  const [calcInput, setCalcInput] = useState('');
  const [calcResult, setCalcResult] = useState<string | null>(null);

  const handleBtnClick = (val: string) => {
    if (val === 'C') {
      setCalcInput('');
      setCalcResult(null);
    } else if (val === '=') {
      try {
        // Safe evaluation of standard math expressions
        const sanitized = calcInput
          .replace(/sin/g, 'Math.sin')
          .replace(/cos/g, 'Math.cos')
          .replace(/tan/g, 'Math.tan')
          .replace(/π/g, 'Math.PI')
          .replace(/√\(([^)]+)\)/g, 'Math.sqrt($1)')
          .replace(/×/g, '*')
          .replace(/÷/g, '/');
        
        // eslint-disable-next-line no-eval
        const res = Function(`"use strict"; return (${sanitized})`)();
        setCalcResult(Number(res).toFixed(4));
      } catch {
        setCalcResult('خطأ في التعبير');
      }
    } else {
      setCalcInput((prev) => prev + val);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-40 px-4 py-3 rounded-2xl bg-[#235d3a] hover:bg-[#1b4a2e] text-white font-black text-xs shadow-2xl flex items-center gap-2 border border-[#73c088]/40 transition-all transform hover:scale-105"
      >
        <Calculator className="w-5 h-5 text-[#73c088] animate-bounce" />
        <span className="hidden sm:inline">الحاسبة وشيت القوانين 🧮</span>
      </button>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-2xl bg-white dark:bg-[#0b0f19] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              {/* Modal Header */}
              <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#235d3a] text-[#73c088] flex items-center justify-center font-bold">
                    ∫
                  </div>
                  <div>
                    <h3 className="font-black text-base">أدوات المهندس الرياضية</h3>
                    <p className="text-[11px] text-slate-400">حاسبة علمية + ملخص قوانين الثانوية العامة</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-2 gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('calc')}
                  className={`flex-1 py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all ${
                    activeTab === 'calc'
                      ? 'bg-white dark:bg-[#235d3a] text-slate-900 dark:text-white shadow-md'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Calculator className="w-4 h-4" />
                  <span>الحاسبة العلمية</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('formulas')}
                  className={`flex-1 py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all ${
                    activeTab === 'formulas'
                      ? 'bg-white dark:bg-[#235d3a] text-slate-900 dark:text-white shadow-md'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>دليل القوانين السريعة</span>
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                {activeTab === 'calc' ? (
                  <div className="space-y-4 max-w-md mx-auto">
                    {/* Calculator Display */}
                    <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 text-left font-mono space-y-1">
                      <div className="text-xs text-slate-400 min-h-[1.25rem] overflow-x-auto">
                        {calcInput || '0'}
                      </div>
                      <div className="text-2xl font-black text-[#73c088] min-h-[2rem]">
                        {calcResult !== null ? `= ${calcResult}` : ''}
                      </div>
                    </div>

                    {/* Button Pad */}
                    <div className="grid grid-cols-4 gap-2 text-sm font-bold">
                      {['C', '(', ')', '÷', 'sin', 'cos', 'tan', '×', '7', '8', '9', '-', '4', '5', '6', '+', '1', '2', '3', '=', '0', '.', 'π', '√('].map((btn) => (
                        <button
                          key={btn}
                          type="button"
                          onClick={() => handleBtnClick(btn)}
                          className={`py-3 rounded-xl transition-colors shadow-xs ${
                            btn === '='
                              ? 'bg-[#73c088] text-slate-950 font-black col-span-1'
                              : btn === 'C'
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : ['÷', '×', '-', '+', 'sin', 'cos', 'tan'].includes(btn)
                              ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                        >
                          {btn}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 text-right">
                    {/* Differentiation Formulas */}
                    <div className="space-y-3 p-4 rounded-2xl bg-blue-50/60 dark:bg-slate-900 border border-blue-100 dark:border-slate-800">
                      <h4 className="font-black text-sm text-blue-900 dark:text-blue-400 flex items-center gap-2">
                        <FunctionSquare className="w-4 h-4" />
                        <span>قواعد الاشتقاق الأساسية (التفاضل)</span>
                      </h4>
                      <ul className="text-xs space-y-2 text-slate-700 dark:text-slate-300 font-mono">
                        <li>d/dx [جا(س)] = جتا(س)</li>
                        <li>d/dx [جتا(س)] = -جا(س)</li>
                        <li>d/dx [ظا(س)] = قا²(س)</li>
                        <li>d/dx [س^ن] = ن * س^(ن-1)</li>
                      </ul>
                    </div>

                    {/* Integration Formulas */}
                    <div className="space-y-3 p-4 rounded-2xl bg-amber-50/60 dark:bg-slate-900 border border-amber-100 dark:border-slate-800">
                      <h4 className="font-black text-sm text-amber-700 dark:text-amber-400 flex items-center gap-2">
                        <Sigma className="w-4 h-4" />
                        <span>قواعد التكامل الشائعة</span>
                      </h4>
                      <ul className="text-xs space-y-2 text-slate-700 dark:text-slate-300 font-mono">
                        <li>∫ جتا(س) dx = جا(س) + ث</li>
                        <li>∫ جا(س) dx = -جتا(س) + ث</li>
                        <li>∫ قا²(س) dx = ظا(س) + ث</li>
                        <li>∫ (أ س + ب)^ن dx = ((أ س + ب)^(ن+1)) / (أ * (ن+1)) + ث</li>
                      </ul>
                    </div>

                    {/* Geometry & Mechanics */}
                    <div className="space-y-3 p-4 rounded-2xl bg-emerald-50/60 dark:bg-slate-900 border border-emerald-100 dark:border-slate-800">
                      <h4 className="font-black text-sm text-emerald-800 dark:text-[#73c088] flex items-center gap-2">
                        <Compass className="w-4 h-4" />
                        <span>الهندسة الفراغية والاستاتيكا</span>
                      </h4>
                      <ul className="text-xs space-y-2 text-slate-700 dark:text-slate-300 font-mono">
                        <li>معادلة الكرة: (س - د)² + (ص - هـ)² + (ع - و)² = نق²</li>
                        <li>حاصل الضرب القياسي: أ · ب = |أ| * |ب| * جتا(θ)</li>
                        <li>محصلة القوى المتوازية: ح = ق1 + ق2</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
