"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { useClients, useEnrollments, usePrograms } from "@/store"
import { PageContainer } from "@/components/layout/page-container"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

interface ClientProfilePageProps {
  params: Promise<{
    id: string
  }>
}

export default function ClientProfilePage({ params }: ClientProfilePageProps) {
  const router = useRouter()
  const unwrappedParams = React.use(params)
  const { id } = unwrappedParams
  const { getClientWithPrograms, deleteClient } = useClients()
  const { programs } = usePrograms()
  const { enrollClient } = useEnrollments()

  const [isDeleting, setIsDeleting] = useState(false)
  const [showEnrollForm, setShowEnrollForm] = useState(false)
  const [selectedProgramId, setSelectedProgramId] = useState("")
  const [enrollmentNotes, setEnrollmentNotes] = useState("")

  const client = getClientWithPrograms(id)

  if (!client) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-2">Client Not Found</h1>
          <p className="text-foreground/70 mb-6">
            The client you are looking for does not exist or has been removed.
          </p>
          <Link href="/clients">
            <Button>Back to Clients</Button>
          </Link>
        </div>
      </PageContainer>
    )
  }

  // Format the client's full name
  const fullName = `${client.firstName} ${client.lastName}`

  // Get programs the client is not enrolled in yet
  const enrolledProgramIds = client.enrollments
    .filter(e => e.status === 'active')
    .map(e => e.program.id)
  
  const availablePrograms = programs.filter(
    program => !enrolledProgramIds.includes(program.id)
  )

  // Handle Delete Client
  const handleDeleteClient = async () => {
    if (!window.confirm(`Are you sure you want to delete ${fullName}?`)) {
      return
    }
    
    setIsDeleting(true)
    
    try {
      const success = deleteClient(id)
      
      if (success) {
        toast({
          title: "Client deleted",
          description: `${fullName} has been successfully deleted`,
        })
        
        router.push("/clients")
      } else {
        throw new Error("Failed to delete client")
      }
    } catch (error) {
      console.error("Error deleting client:", error)
      
      toast({
        title: "Error",
        description: "Failed to delete client. Please try again.",
        variant: "destructive",
      })
      
      setIsDeleting(false)
    }
  }

  // Handle Enroll in Program
  const handleEnrollInProgram = () => {
    if (!selectedProgramId) {
      toast({
        title: "Error",
        description: "Please select a program",
        variant: "destructive",
      })
      return
    }

    try {
      const enrollment = enrollClient(id, selectedProgramId, enrollmentNotes)
      
      if (enrollment) {
        toast({
          title: "Client enrolled",
          description: `${fullName} has been successfully enrolled in the program`,
        })
        
        // Reset form
        setSelectedProgramId("")
        setEnrollmentNotes("")
        setShowEnrollForm(false)
      } else {
        throw new Error("Failed to enroll client")
      }
    } catch (error) {
      console.error("Error enrolling client:", error)
      
      toast({
        title: "Error",
        description: "Failed to enroll client in program. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <PageContainer>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Link href="/clients">
            <Button variant="ghost" size="sm">
              ← Back to Clients
            </Button>
          </Link>
        </div>
        
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">{fullName}</h1>
          
          <div className="flex gap-2">
            <Link href={`/clients/${id}/edit`}>
              <Button variant="outline">Edit Client</Button>
            </Link>
            <Button 
              variant="destructive" 
              onClick={handleDeleteClient}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Client"}
            </Button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Client Details */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border overflow-hidden">
            <div className="p-5 bg-secondary">
              <h2 className="text-xl font-semibold">Client Information</h2>
            </div>
            
            <div className="p-6 grid gap-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-md font-semibold mb-3">Personal Information</h3>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
                  <div>
                    <dt className="text-sm text-foreground/70">Full Name</dt>
                    <dd>{fullName}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-foreground/70">Date of Birth</dt>
                    <dd>{formatDate(client.dateOfBirth)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-foreground/70">Gender</dt>
                    <dd>{client.gender.charAt(0).toUpperCase() + client.gender.slice(1)}</dd>
                  </div>
                </dl>
              </div>
              
              {/* Contact Information */}
              <div>
                <h3 className="text-md font-semibold mb-3">Contact Information</h3>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
                  <div>
                    <dt className="text-sm text-foreground/70">Phone Number</dt>
                    <dd>{client.contactNumber}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-foreground/70">Email</dt>
                    <dd>{client.email || "Not provided"}</dd>
                  </div>
                  <div className="md:col-span-2">
                    <dt className="text-sm text-foreground/70">Address</dt>
                    <dd>{client.address}</dd>
                  </div>
                </dl>
              </div>
              
              {/* Medical Information */}
              <div>
                <h3 className="text-md font-semibold mb-3">Medical Information</h3>
                <dl>
                  <div>
                    <dt className="text-sm text-foreground/70">Medical History</dt>
                    <dd className="whitespace-pre-line">
                      {client.medicalHistory || "No medical history recorded"}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        {/* Program Enrollments */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border overflow-hidden">
            <div className="p-5 bg-secondary flex justify-between items-center">
              <h2 className="text-xl font-semibold">Program Enrollments</h2>
              {!showEnrollForm && availablePrograms.length > 0 && (
                <Button 
                  size="sm" 
                  onClick={() => setShowEnrollForm(true)}
                >
                  Enroll
                </Button>
              )}
            </div>
            
            <div className="p-6">
              {/* Enrollment Form */}
              {showEnrollForm && (
                <div className="mb-6 p-4 bg-secondary/50 rounded-lg">
                  <h3 className="text-md font-semibold mb-3">Enroll in Program</h3>
                  
                  <div className="grid gap-4">
                    <div>
                      <label className="text-sm font-medium block mb-1">
                        Select Program
                      </label>
                      <select 
                        className="input"
                        value={selectedProgramId}
                        onChange={(e) => setSelectedProgramId(e.target.value)}
                      >
                        <option value="">Select a program</option>
                        {availablePrograms.map(program => (
                          <option key={program.id} value={program.id}>
                            {program.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium block mb-1">
                        Notes (Optional)
                      </label>
                      <textarea 
                        className="input min-h-[80px]"
                        value={enrollmentNotes}
                        onChange={(e) => setEnrollmentNotes(e.target.value)}
                        placeholder="Add any enrollment notes..."
                      />
                    </div>
                    
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowEnrollForm(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleEnrollInProgram}
                      >
                        Enroll Client
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Active Enrollments */}
              <div className="mb-4">
                <h3 className="text-md font-semibold mb-3">Active Enrollments</h3>
                
                {client.enrollments.filter(e => e.status === 'active').length === 0 ? (
                  <p className="text-foreground/70 text-sm">
                    Client is not currently enrolled in any programs.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {client.enrollments
                      .filter(e => e.status === 'active')
                      .map(enrollment => (
                        <li 
                          key={enrollment.id} 
                          className="p-3 border rounded-md bg-background"
                        >
                          <div className="font-medium">
                            {enrollment.program.name}
                          </div>
                          <div className="text-sm text-foreground/70">
                            Enrolled: {formatDate(enrollment.enrollmentDate, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                          {enrollment.notes && (
                            <div className="mt-2 text-sm">
                              <span className="font-medium">Notes:</span> {enrollment.notes}
                            </div>
                          )}
                        </li>
                      ))}
                  </ul>
                )}
              </div>
              
              {/* Past Enrollments */}
              {client.enrollments.filter(e => e.status !== 'active').length > 0 && (
                <div>
                  <h3 className="text-md font-semibold mb-3">Past Enrollments</h3>
                  <ul className="space-y-3">
                    {client.enrollments
                      .filter(e => e.status !== 'active')
                      .map(enrollment => (
                        <li 
                          key={enrollment.id} 
                          className="p-3 border rounded-md bg-background/50"
                        >
                          <div className="font-medium">
                            {enrollment.program.name}
                          </div>
                          <div className="text-sm text-foreground/70">
                            Status: {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                          </div>
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  )
} 