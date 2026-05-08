import type { Metadata } from "next";
import "./globals.css";


import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata: Metadata = {
  title: "Going Genius | Next.js Boilerplate",
  description: "A premium Next.js 15+ boilerplate with Prisma ORM and Supabase backend integration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body style={{ margin: 0 }}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

