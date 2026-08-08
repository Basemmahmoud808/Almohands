'use client';

import { useState } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'm1',
    sender: 'bot',
    text: 'أهلاً بك يا بطل! أنا مساعد المهندس رضا خيرت الذكي. اختر أي سؤال أو اكتب استفسارك في مادة الرياضيات وسأشرحه لك بالخطوات.',
    time: 'الآن',
  },
];

const PRESET_QUESTIONS = [
  'كيف أحسب اشتقاق الدوال المثلثية؟',
  'ما هي معادلة الكرة في الهندسة الفراغية؟',
  'ازاي افرق بين الاستاتيكا والديناميكا؟',
  'طريقة الاشتراك والتفعيل بالمنصة؟',
];

export function AiMathAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');

  const handleSend = (userText: string) => {
    if (!userText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      time: 'الآن',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Generate automated smart math responses
    setTimeout(() => {
      let botResponse = 'ممتاز! للحصول على الشرح الكامل والتطبيقات التفاعلية على هذه المسألة، يمكنك مشاهدة الدرس المباشر بقسم الكورسات.';

      if (userText.includes('اشتقاق') || userText.includes('المثلثية')) {
        botResponse = 'قواعد اشتقاق الدوال المثلثية:\n1. d/dx [جا(س)] = جتا(س)\n2. d/dx [جتا(س)] = -جا(س)\n3. d/dx [ظا(س)] = قا²(س)\nتأكد دائماً من ضرب المشتقة في مشتقة الزاوية أولاً!';
      } else if (userText.includes('الكرة') || userText.includes('الفراغية')) {
        botResponse = 'معادلة الكرة في الهندسة الفراغية ثلاثية الأبعاد:\n(س - د)² + (ص - هـ)² + (ع - و)² = نق²\nحيث (د، هـ، و) هو مركز الكرة، و نق هو طول نصف القطر.';
      } else if (userText.includes('الاشتراك') || userText.includes('التفعيل')) {
        botResponse = 'يمكنك تفعيل الاشتراك فوراً عن طريق شحن كود مسبق أو تحويل المبلغ عبر فودافون كاش / إنستا باي من صفحة "تفعيل كورس / اشتراك".';
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: botResponse,
        time: 'الآن',
      };

      setMessages((prev) => [...prev, botMsg]);
    }, 600);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 px-4 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-2xl flex items-center gap-2 border border-blue-400/40 transition-all transform hover:scale-105"
      >
        <Bot className="w-5 h-5 text-amber-300 animate-pulse" />
        <span className="hidden sm:inline">مساعد الرياضيات الذكي 🤖</span>
      </button>

      {/* Chat Dialog */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-full max-w-sm bg-white dark:bg-[#0b0f19] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[520px] max-h-[80vh]">
            
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-blue-900 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-blue-600 text-amber-400 flex items-center justify-center font-black">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black text-sm text-white">مساعد المهندس الذكي</h4>
                  <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>متصل الآن لمساعدتك</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Body */}
            <div className="p-4 overflow-y-auto flex-1 space-y-3 bg-slate-50/50 dark:bg-slate-950/40">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[82%] p-3.5 rounded-2xl text-xs leading-relaxed font-medium whitespace-pre-line shadow-xs ${
                      m.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-white dark:bg-[#111827] text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-bl-none'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Preset Questions */}
            <div className="p-2 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0f19] flex gap-1.5 overflow-x-auto">
              {PRESET_QUESTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => handleSend(q)}
                  className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-[10px] font-extrabold text-slate-700 dark:text-slate-300 shrink-0 border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white dark:bg-[#0b0f19] border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                placeholder="اسأل سؤالك في الرياضيات..."
                className="flex-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => handleSend(input)}
                className="w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}
      </AnimatePresence>
    </>
  );
}
