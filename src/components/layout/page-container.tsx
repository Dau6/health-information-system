"use client"

import { Navbar } from "@/components/layout/navbar"
import { Sidebar } from "@/components/layout/sidebar"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { usePathname } from "next/navigation"

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  hideSidebar?: boolean;
}

export function PageContainer({ children, className, hideSidebar = false }: PageContainerProps) {
  const pathname = usePathname();
  
  // Don't show sidebar on landing page and auth pages
  const shouldShowSidebar = !hideSidebar && 
    !["/", "/sign-in", "/sign-up"].includes(pathname) && 
    !pathname.startsWith("/sign-in/") && 
    !pathname.startsWith("/sign-up/");
    
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <div className="flex flex-1">
        {shouldShowSidebar && <Sidebar className="h-[calc(100vh-4rem)] sticky top-16" />}
        <main className={cn(
          "flex-1 px-4 py-6 mx-auto w-full bg-background",
          shouldShowSidebar ? "max-w-[calc(7xl-250px)]" : "max-w-7xl",
          className
        )}>
          {children}
        </main>
      </div>
      <footer className="border-t py-4 text-center text-sm text-foreground/70 bg-background">
        <div className="mx-auto max-w-7xl px-4">
          <p>© {new Date().getFullYear()} Health Information System</p>
        </div>
      </footer>
    </div>
  )
}
 