import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  title: {
    default: "Nguyễn Minh Chiến — AI, Programming & Education",
    template: "%s | Nguyễn Minh Chiến",
  },
  description:
    "Sharing practical knowledge about Artificial Intelligence, Programming, Robotics and STEAM Education.",
  keywords: ["AI", "Programming", "Robotics", "Arduino", "STEAM", "Education"],
  authors: [{ name: "Nguyễn Minh Chiến" }],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "Nguyễn Minh Chiến Posts",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
