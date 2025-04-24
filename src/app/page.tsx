"use client"

import { useClients, usePrograms, useEnrollments } from "@/store"
import { PageContainer } from "@/components/layout/page-container"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { SignedIn, SignedOut, SignInButton, SignUpButton, useAuth } from "@clerk/nextjs"
import Image from "next/image"
import { useEffect } from "react"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export default function LandingPage() {
  const router = useRouter()
  const { clients } = useClients()
  const { programs } = usePrograms()
  const { enrollments } = useEnrollments()
  const { isSignedIn } = useAuth()

  // Get active enrollments count
  const activeEnrollments = enrollments.filter(e => e.status === 'active').length

  // Get stats for summary cards
  const stats = [
    { name: "Total Clients", value: clients.length },
    { name: "Health Programs", value: programs.length },
    { name: "Active Enrollments", value: activeEnrollments },
  ]

  // Get recent clients (last 5)
  const recentClients = [...clients]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  // Redirect authenticated users to the dashboard
  useEffect(() => {
    if (isSignedIn) {
      router.push("/dashboard")
    }
  }, [isSignedIn, router])

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold text-primary">Health Info System</div>
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            <SignedOut>
              <div className="hidden sm:flex space-x-2">
                <SignInButton mode="modal">
                  <Button variant="ghost" size="sm">Sign in</Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button>Sign up</Button>
                </SignUpButton>
              </div>
            </SignedOut>
            <SignedIn>
              <Button asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </SignedIn>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-12 md:py-24 flex flex-col-reverse md:flex-row items-center">
        <div className="md:w-1/2 mt-10 md:mt-0 md:pr-10">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Streamline Your <span className="text-primary">Health Information</span> Management
          </h1>
          <p className="text-foreground/70 text-lg mb-8">
            A comprehensive system for healthcare providers to manage clients, 
            health programs, and enrollments all in one secure platform.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <SignedOut>
              <SignUpButton mode="modal">
                <Button size="lg" className="px-8">Get Started</Button>
              </SignUpButton>
              <SignInButton mode="modal">
                <Button variant="outline" size="lg" className="px-8">Sign In</Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Button size="lg" className="px-8" asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </SignedIn>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <div className="relative w-full max-w-lg h-[400px] rounded-2xl overflow-hidden shadow-xl">
            {/* Use a placeholder image (you can replace with your own) */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-80"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white text-center px-6">
                <div className="mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2">Secure Health Records</h3>
                <p>Manage patient information and program enrollments with confidence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16 bg-background">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-secondary/30 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Client Management</h3>
            <p className="text-foreground/70">
              Easily register and manage client information including contact details and medical history.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-secondary/30 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Program Tracking</h3>
            <p className="text-foreground/70">
              Create and manage health programs with detailed descriptions and enrollment tracking.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-secondary/30 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Enrollment Management</h3>
            <p className="text-foreground/70">
              Streamline the process of enrolling clients in health programs with status tracking.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Ready to streamline your health information management?</h2>
          <p className="text-foreground/70 text-lg mb-8">
            Join healthcare providers who trust our platform to manage their client information and health programs securely.
          </p>
          <SignedOut>
            <SignUpButton mode="modal">
              <Button size="lg" className="px-10">Get Started Today</Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Button size="lg" className="px-10" asChild>
              <Link href="/dashboard">Access Your Dashboard</Link>
            </Button>
          </SignedIn>
        </div>
      </section>

      {/* Footer - Show theme toggle again at bottom */}
      <footer className="bg-secondary/30 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="text-2xl font-bold text-primary">Health Info System</div>
              <p className="text-foreground/70 mt-2">Secure health information management</p>
            </div>
            <div className="flex flex-col items-center md:items-end space-y-4">
              <ThemeToggle />
              <div className="flex flex-col md:flex-row md:space-x-8">
                <div className="mb-4 md:mb-0">
                  <h3 className="font-semibold mb-2">Platform</h3>
                  <ul className="space-y-2">
                    <li><Link href="#" className="text-foreground/70 hover:text-primary">Features</Link></li>
                    <li><Link href="#" className="text-foreground/70 hover:text-primary">Pricing</Link></li>
                    <li><Link href="#" className="text-foreground/70 hover:text-primary">FAQ</Link></li>
                  </ul>
                </div>
                <div className="mb-4 md:mb-0">
                  <h3 className="font-semibold mb-2">Company</h3>
                  <ul className="space-y-2">
                    <li><Link href="#" className="text-foreground/70 hover:text-primary">About</Link></li>
                    <li><Link href="#" className="text-foreground/70 hover:text-primary">Contact</Link></li>
                    <li><Link href="#" className="text-foreground/70 hover:text-primary">Privacy</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-border mt-10 pt-6 text-center">
            <p className="text-foreground/70">&copy; {new Date().getFullYear()} Health Information System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
