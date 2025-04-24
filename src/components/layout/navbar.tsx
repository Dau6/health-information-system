"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { SignInButton, SignUpButton, UserButton, SignedIn, SignedOut } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Clients", href: "/clients" },
  { name: "Programs", href: "/programs" },
  { name: "Enrollments", href: "/enrollments" },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="border-b border-border bg-background">
      <div className="flex h-16 max-w-7xl items-center justify-between px-4 mx-auto">
        <div className="flex items-center">
          <Link href={pathname === "/" ? "/" : "/dashboard"} className="flex items-center">
            <span className="text-xl font-bold text-primary">Health Info System</span>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          {/* Navigation links - only shown when signed in */}
          <SignedIn>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "inline-flex items-center px-1 pt-1 text-sm font-medium",
                      isActive 
                        ? "border-b-2 border-primary text-foreground"
                        : "border-transparent text-foreground/70 hover:text-foreground"
                    )}
                  >
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </SignedIn>
          
          <ThemeToggle />
          
          {/* Auth buttons */}
          <SignedIn>
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8"
                }
              }} 
            />
          </SignedIn>
          
          <SignedOut>
            <div className="flex items-center space-x-2">
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm">Sign in</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button>Sign up</Button>
              </SignUpButton>
            </div>
          </SignedOut>
        </div>
      </div>
    </nav>
  )
} 