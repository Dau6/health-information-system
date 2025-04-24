import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ClerkProvider } from '@clerk/nextjs';

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Health Information System",
  description: "A comprehensive health information system for managing clients and health programs",
  keywords: ["Health", "Information", "System", "Management", "Clients", "Programs"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <script dangerouslySetInnerHTML={{ __html: `
            (function() {
              try {
                // Get stored theme or default to system
                const theme = localStorage.getItem('theme-storage') 
                  ? JSON.parse(localStorage.getItem('theme-storage')).state.theme
                  : 'system';
                
                // Apply appropriate class based on theme
                const root = document.documentElement;
                if (theme === "system") {
                  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
                    ? "dark"
                    : "light";
                  root.classList.add(systemTheme);
                } else {
                  root.classList.add(theme);
                }
              } catch (e) {
                // Fallback to light if something goes wrong
                document.documentElement.classList.add('light');
              }
            })();
          ` }} />
        </head>
        <body
          className={`bg-background text-foreground ${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
        >
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
