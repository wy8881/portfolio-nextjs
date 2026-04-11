import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
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
      <body
        className={`${inter.variable} antialiased`}
      >
        <ThemeProvider 
          attribute="class" 
          defaultTheme="light" 
          enableSystem={false}>
          <Navbar />
          <main>
            {children}
          </main>
          <Footer />
          <SeasonToggle />
        </ThemeProvider>
      </body>
    </html>
  );
}
