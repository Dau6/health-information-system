"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useClients, usePrograms, useEnrollments } from "@/store"
import { PageContainer } from "@/components/layout/page-container"
import { Button } from "@/components/ui/button"
import { Form, FormField, FormLabel, useForm } from "@/components/ui/form"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"
import { z } from "zod"

// Form validation schema
const enrollmentSchema = z.object({
  clientId: z.string().min(1, "Client is required"),
  programId: z.string().min(1, "Program is required"),
  notes: z.string().optional(),
})

type EnrollmentFormData = z.infer<typeof enrollmentSchema>

export default function NewEnrollmentPage() {
  const router = useRouter()
  const { clients } = useClients()
  const { programs } = usePrograms()
  const { enrollClient } = useEnrollments()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const formMethods = useForm<EnrollmentFormData>({
    defaultValues: {
      clientId: "",
      programId: "",
      notes: "",
    },
  })
  
  const { register, formState: { errors }, watch } = formMethods
  
  // Get form values
  const selectedClientId = watch("clientId")
  const selectedProgramId = watch("programId")
  
  // Get selected client and program
  const selectedClient = clients.find(client => client.id === selectedClientId)
  const selectedProgram = programs.find(program => program.id === selectedProgramId)
  
  const handleSubmit = async (data: EnrollmentFormData) => {
    setIsSubmitting(true)
    
    try {
      // Create the new enrollment
      const enrollment = enrollClient(data.clientId, data.programId, data.notes)
      
      if (!enrollment) {
        throw new Error("Failed to enroll client")
      }
      
      // Show success toast
      toast({
        title: "Client enrolled",
        description: `${selectedClient?.firstName} ${selectedClient?.lastName} has been successfully enrolled in ${selectedProgram?.name}`,
      })
      
      // Navigate to the client page
      router.push(`/clients/${data.clientId}`)
    } catch (error) {
      console.error("Error enrolling client:", error)
      
      // Show error toast
      toast({
        title: "Error",
        description: "Failed to enroll client. Please try again.",
        variant: "destructive",
      })
      
      setIsSubmitting(false)
    }
  }
  
  return (
    <PageContainer>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              ← Back to Dashboard
            </Button>
          </Link>
        </div>
        <h1 className="text-3xl font-bold">Enroll Client in Program</h1>
        <p className="text-foreground/70 mt-1">
          Select a client and a health program to create an enrollment.
        </p>
      </div>
      
      <div className="bg-secondary/50 p-6 md:p-8 rounded-lg max-w-2xl">
        <Form formMethods={formMethods} onSubmit={handleSubmit}>
          <div className="grid gap-6 mb-8">
            {/* Client Selection */}
            <FormField name="clientId">
              <FormLabel required>Select Client</FormLabel>
              <select
                {...register("clientId")}
                className="input"
              >
                <option value="">Select a client</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.lastName}, {client.firstName}
                  </option>
                ))}
              </select>
            </FormField>
            
            {/* Program Selection */}
            <FormField name="programId">
              <FormLabel required>Select Program</FormLabel>
              <select
                {...register("programId")}
                className="input"
              >
                <option value="">Select a program</option>
                {programs.map(program => (
                  <option key={program.id} value={program.id}>
                    {program.name}
                  </option>
                ))}
              </select>
            </FormField>
            
            {/* Notes */}
            <FormField name="notes">
              <FormLabel>Enrollment Notes</FormLabel>
              <textarea
                {...register("notes")}
                placeholder="Add any notes or details about this enrollment (optional)"
                className="input min-h-[100px]"
              />
            </FormField>
          </div>
          
          {/* Preview */}
          {selectedClientId && selectedProgramId && (
            <div className="mb-8 p-4 border rounded-lg bg-background">
              <h3 className="text-md font-semibold mb-3">Enrollment Preview</h3>
              <p>
                You are enrolling <strong>{selectedClient?.firstName} {selectedClient?.lastName}</strong> in{" "}
                <strong>{selectedProgram?.name}</strong>.
              </p>
            </div>
          )}
          
          <div className="flex justify-end gap-4">
            <Link href="/">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button 
              type="submit" 
              disabled={isSubmitting || !selectedClientId || !selectedProgramId}
            >
              {isSubmitting ? "Enrolling..." : "Enroll Client"}
            </Button>
          </div>
        </Form>
      </div>
    </PageContainer>
  )
} 