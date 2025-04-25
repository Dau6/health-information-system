"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { usePrograms } from "@/store"
import { PageContainer } from "@/components/layout/page-container"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

interface ProgramDetailsPageProps {
  params: Promise<{
    id: string
  }>
}

export default function ProgramDetailsPage({ params }: ProgramDetailsPageProps) {
  const router = useRouter()
  const unwrappedParams = React.use(params)
  const { id } = unwrappedParams
  const { getProgramWithClients, deleteProgram } = usePrograms()

  const [isDeleting, setIsDeleting] = useState(false)

  const program = getProgramWithClients(id)

  if (!program) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-2">Program Not Found</h1>
          <p className="text-foreground/70 mb-6">
            The health program you are looking for does not exist or has been removed.
          </p>
          <Link href="/programs">
            <Button>Back to Programs</Button>
          </Link>
        </div>
      </PageContainer>
    )
  }

  // Count active enrollments
  const activeEnrollments = program.enrollments.filter(e => e.status === 'active')

  // Handle Delete Program
  const handleDeleteProgram = async () => {
    if (!window.confirm(`Are you sure you want to delete the ${program.name} program?`)) {
      return
    }
    
    setIsDeleting(true)
    
    try {
      const success = deleteProgram(id)
      
      if (success) {
        toast({
          title: "Program deleted",
          description: `${program.name} has been successfully deleted`,
        })
        
        router.push("/programs")
      } else {
        throw new Error("Failed to delete program")
      }
    } catch (error) {
      console.error("Error deleting program:", error)
      
      toast({
        title: "Error",
        description: "Failed to delete program. Please try again.",
        variant: "destructive",
      })
      
      setIsDeleting(false)
    }
  }

  return (
    <PageContainer>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Link href="/programs">
            <Button variant="ghost" size="sm">
              ← Back to Programs
            </Button>
          </Link>
        </div>
        
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">{program.name}</h1>
          
          <div className="flex gap-2">
            <Link href={`/programs/${id}/edit`}>
              <Button variant="outline">Edit Program</Button>
            </Link>
            <Button 
              variant="destructive" 
              onClick={handleDeleteProgram}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Program"}
            </Button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Program Details */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border overflow-hidden">
            <div className="p-5 bg-secondary">
              <h2 className="text-xl font-semibold">Program Information</h2>
            </div>
            
            <div className="p-6 grid gap-6">
              <div>
                <h3 className="text-md font-semibold mb-3">Description</h3>
                <p className="whitespace-pre-line">{program.description}</p>
              </div>
              
              <div>
                <h3 className="text-md font-semibold mb-3">Program Details</h3>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
                  <div>
                    <dt className="text-sm text-foreground/70">Created</dt>
                    <dd>{formatDate(program.createdAt)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-foreground/70">Last Updated</dt>
                    <dd>{formatDate(program.updatedAt)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-foreground/70">Current Enrollments</dt>
                    <dd>{activeEnrollments.length}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        {/* Enrolled Clients */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border overflow-hidden">
            <div className="p-5 bg-secondary">
              <h2 className="text-xl font-semibold">Enrolled Clients</h2>
            </div>
            
            <div className="p-6">
              {activeEnrollments.length === 0 ? (
                <p className="text-foreground/70 text-sm">
                  No clients currently enrolled in this program.
                </p>
              ) : (
                <ul className="space-y-3">
                  {activeEnrollments.map(enrollment => (
                    <li 
                      key={enrollment.id} 
                      className="p-3 border rounded-md bg-background"
                    >
                      <div className="font-medium">
                        {enrollment.client.firstName} {enrollment.client.lastName}
                      </div>
                      <div className="text-sm text-foreground/70">
                        Enrolled: {formatDate(enrollment.enrollmentDate, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                      <div className="mt-2">
                        <Link href={`/clients/${enrollment.client.id}`}>
                          <Button variant="outline" size="sm">
                            View Client
                          </Button>
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  )
} 