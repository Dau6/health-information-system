"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { usePrograms } from "@/store"
import { PageContainer } from "@/components/layout/page-container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormField, FormLabel, useForm } from "@/components/ui/form"
import Link from "next/link"
import { z } from "zod"
import { toast } from "@/hooks/use-toast"

// Form validation schema
const programSchema = z.object({
  name: z.string().min(1, "Program name is required"),
  description: z.string().min(1, "Program description is required"),
})

type ProgramFormData = z.infer<typeof programSchema>

interface ProgramEditPageProps {
  params: {
    id: string
  }
}

export default function ProgramEditPage({ params }: ProgramEditPageProps) {
  const router = useRouter()
  const programId = params.id
  const { getProgramById, updateProgram, deleteProgram } = usePrograms()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get program data
  const program = getProgramById(programId)

  // Set up form with program data
  const formMethods = useForm<ProgramFormData>({
    defaultValues: program ? {
      name: program.name,
      description: program.description,
    } : undefined,
  })

  // Redirect if program not found
  useEffect(() => {
    if (!program) {
      toast({
        title: "Error",
        description: "Program not found",
        variant: "destructive",
      })
      router.push("/programs")
    }
  }, [program, router])

  const handleSubmit = async (data: ProgramFormData) => {
    setIsSubmitting(true)

    try {
      // Update the program
      const updatedProgram = updateProgram(programId, data)

      if (updatedProgram) {
        // Show success toast
        toast({
          title: "Program updated",
          description: `${updatedProgram.name} has been successfully updated`,
        })

        // Navigate to the program details page
        router.push(`/programs/${updatedProgram.id}`)
      }
    } catch (error) {
      console.error("Error updating program:", error)

      // Show error toast
      toast({
        title: "Error",
        description: "Failed to update program. Please try again.",
        variant: "destructive",
      })

      setIsSubmitting(false)
    }
  }

  const handleDeleteProgram = async () => {
    if (confirm("Are you sure you want to delete this program? This will also remove all client enrollments.")) {
      setIsDeleting(true)

      try {
        // Delete the program
        const success = deleteProgram(programId)

        if (success) {
          // Show success toast
          toast({
            title: "Program deleted",
            description: "Health program has been permanently deleted",
          })

          // Navigate to programs list
          router.push("/programs")
        }
      } catch (error) {
        console.error("Error deleting program:", error)

        // Show error toast
        toast({
          title: "Error",
          description: "Failed to delete program. Please try again.",
          variant: "destructive",
        })

        setIsDeleting(false)
      }
    }
  }

  if (!program) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center h-40">
          <div className="text-foreground/70">Loading...</div>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Link href={`/programs/${programId}`}>
            <Button variant="ghost" size="sm">
              ← Back to Program Details
            </Button>
          </Link>
        </div>
        <h1 className="text-3xl font-bold">Edit Health Program</h1>
        <p className="text-foreground/70 mt-1">
          Update health program details and description.
        </p>
      </div>

      <div className="bg-secondary/30 p-6 md:p-8 rounded-lg max-w-2xl mx-auto">
        <Form formMethods={formMethods} onSubmit={handleSubmit}>
          <div className="grid gap-6 mb-8">
            <FormField name="name">
              <FormLabel required>Program Name</FormLabel>
              <Input 
                {...formMethods.register("name")} 
                placeholder="Enter program name" 
              />
            </FormField>
            
            <FormField name="description">
              <FormLabel required>Description</FormLabel>
              <textarea 
                {...formMethods.register("description")} 
                placeholder="Enter program description" 
                className="input min-h-[150px]"
              />
            </FormField>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteProgram}
              disabled={isDeleting || isSubmitting}
            >
              {isDeleting ? "Deleting..." : "Delete Program"}
            </Button>
            <div className="flex gap-2">
              <Link href={`/programs/${programId}`}>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </PageContainer>
  )
} 