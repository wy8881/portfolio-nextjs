import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import Navbar from "@/components/layout/navbar/Navbar";
import { Footer } from "@/components/layout/Footer";

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
      <body
        className={`${inter.variable} antialiased`}
      >
        <ThemeProvider 
          attribute="class" 
          defaultTheme="light" 
          enableSystem={false}>
          <Navbar />
          <main className="my-22 md:my-28 lg:my-34 px-10 md:px-12 lg:px-28" min-h-screen="true">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
