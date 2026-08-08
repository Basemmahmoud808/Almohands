import type { Metadata } from 'next';
import { Tajawal, Alexandria } from 'next/font/google';
import { SafeClerkProvider } from '@/components/SafeClerkProvider';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import './globals.css';

const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '700', '800', '900'],
  variable: '--font-tajawal',
});

const alexandria = Alexandria({
  subsets: ['arabic', 'latin'],
  weight: ['400', '600', '700', '800', '900'],
  variable: '--font-alexandria',
});

export const metadata: Metadata = {
  title: 'منصة المهندس — أ. رضا خيرت | مادة الرياضيات',
  description: 'المنصة التعليمية الأولى لشرح مادة الرياضيات للمرحلة الثانوية بأسلوب المهندس رضا خيرت. كورسات، امتحانات إلكترونية وشيتات محلولة.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SafeClerkProvider>
      <html lang="ar" dir="rtl" className={`${tajawal.variable} ${alexandria.variable} h-full antialiased`} suppressHydrationWarning>
        <body className="min-h-full flex flex-col font-sans bg-slate-50 text-slate-900 dark:bg-[#060913] dark:text-slate-100 transition-colors duration-300">
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </ThemeProvider>
        </body>
      </html>
    </SafeClerkProvider>
  );
}
