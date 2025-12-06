import type { Metadata } from "next";
import { Staatliches, Caveat, Fredoka, Truculenta } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import Navbar from "@/components/layout/Navbar";

const graduate = Staatliches({
  variable: "--font-graduate",
  subsets: ["latin"],
  weight: "400",
});

const crafty = Caveat({
  variable: "--font-crafty",
  subsets: ["latin"],
  weight: "400",
});

const bubblegum = Fredoka({
  variable: "--font-bubblegum",
  subsets: ["latin"],
  weight: "400",
});

const truculenta = Truculenta({
  variable: "--font-truculenta",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Yi Wang's Portfolio",
  description: "Full-stack developer specializing in React and Spring Boot",
  keywords: ["portfolio", "developer", "react", "nextjs", "spring boot"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${graduate.variable} ${crafty.variable} ${bubblegum.variable} ${truculenta.variable} antialiased`}
      >
        <ThemeProvider 
          attribute="class" 
          defaultTheme="light" 
          enableSystem={false}>
          <Navbar />
          <main className="pt-20" min-h-screen="true">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
