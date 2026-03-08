import type { Metadata } from "next";
import { Geist, Geist_Mono, Zen_Kaku_Gothic_New } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const zenKakuGothicNew = Zen_Kaku_Gothic_New({
  variable: "--font-zen-kaku-gothic-new",
  weight: ["400", "700", "900"],
  preload: false,
});

export const metadata: Metadata = {
  title: "Buchi Portfolio",
  description: "Frontend Engineer / UI Designer Portfolio",
};

export function generateStaticParams() {
  return routing.locales.map((locale: string) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} className={`locale-${locale}`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${zenKakuGothicNew.variable} ${zenKakuGothicNew.className}`}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
