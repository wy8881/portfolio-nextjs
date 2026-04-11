import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/navbar/Navbar";
import { Footer } from "@/components/layout/Footer";
import SeasonToggle from "@/components/ui/SeasonToggle";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Yi's Portfolio",
  description: "Full-stack developer specializing in React and Spring Boot",
  keywords: ["portfolio", "developer", "react", "nextjs", "spring boot"],
  icons: {
    icon: '/images/icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var season = localStorage.getItem('season') || 'summer';
                document.documentElement.setAttribute('data-season', season);
              })();
            `,
          }}
        />
      </head>
    <header className="fixed z-50 top-0 left-0 right-0 bg-nav-bg/50 backdrop-blur-xl border-b border-stone-200/30 h-16 md:h-20 lg:h-24">
      <Navbar />
    </header>
      <body
        className={`${inter.variable} antialiased`}
      >
          <main>
            {children}
          </main>
          <Footer />
          <SeasonToggle />
      </body>
    </html>
  );
}
