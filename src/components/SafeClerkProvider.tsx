'use client';

import React from 'react';
import { ClerkProvider } from '@clerk/nextjs';

export function SafeClerkProvider({ children }: { children: React.ReactNode }) {
  const pubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const isValidKey = pubKey && pubKey.startsWith('pk_') && !pubKey.includes('...');

  if (!isValidKey) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="bg-amber-500 text-slate-950 px-4 py-2 text-center font-bold text-xs shadow-md z-50 flex items-center justify-center gap-2">
          <span>⚠️ تنبيه البيئة التنسيقية: يرجى كتابة المفتاح الحقيقي من حساب Clerk في ملف <code className="bg-slate-900 text-amber-400 px-1.5 py-0.5 rounded font-mono">.env.local</code> (NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY).</span>
        </div>
        {children}
      </div>
    );
  }

  return <ClerkProvider publishableKey={pubKey}>{children}</ClerkProvider>;
}
