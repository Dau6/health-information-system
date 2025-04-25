"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useEnrollments, useClients, usePrograms } from "@/store"
import { PageContainer } from "@/components/layout/page-container"
import { Button } from "@/components/ui/button"
import { Form, FormField, FormLabel, useForm } from "@/components/ui/form"
import Link from "next/link"
import { z } from "zod"
import { toast } from "@/hooks/use-toast"
import { formatDate } from "@/lib/utils"

// Form validation schema
const enrollmentUpdateSchema = z.object({
  status: z.enum(["active", "completed", "withdrawn"]),
  notes: z.string().optional(),
})

type EnrollmentFormData = z.infer<typeof enrollmentUpdateSchema>

interface EnrollmentEditPageProps {
  params: {
    id: string
  }
}

export default function EnrollmentEditPage({ params }: EnrollmentEditPageProps) {
  const router = useRouter()
  const enrollmentId = params.id
  const { getEnrollmentById, updateEnrollment, cancelEnrollment } = useEnrollments()
  const { getClientById } = useClients()
  const { getProgramById } = usePrograms()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get enrollment data
  const enrollment = getEnrollmentById(enrollmentId)
  const client = enrollment ? getClientById(enrollment.clientId) : null
  const program = enrollment ? getProgramById(enrollment.programId) : null

  const formMethods = useForm<EnrollmentFormData>({
    defaultValues: {
      status: enrollment?.status || "active",
      notes: enrollment?.notes || "",
    },
  })

  // Redirect if enrollment not found
  useEffect(() => {
    if (!enrollment) {
      toast({
        title: "Error",
        description: "Enrollment not found",
        variant: "destructive",
      })
      router.push("/enrollments")
    }
  }, [enrollment, router])

  const handleSubmit = async (data: EnrollmentFormData) => {
    if (!enrollment) return

    setIsSubmitting(true)

    try {
      // Update the enrollment
      const updatedEnrollment = updateEnrollment(enrollmentId, data)

      if (updatedEnrollment) {
        // Show success toast
        toast({
          title: "Enrollment updated",
          description: "Enrollment has been successfully updated",
        })

        // Navigate to the enrollments page
        router.push("/enrollments")
      }
    } catch (error) {
      console.error("Error updating enrollment:", error)

      // Show error toast
      toast({
        title: "Error",
        description: "Failed to update enrollment. Please try again.",
        variant: "destructive",
      })

      setIsSubmitting(false)
    }
  }

  const handleCancelEnrollment = async () => {
    if (!enrollment) return

    setIsDeleting(true)

    try {
      // Cancel the enrollment
      const success = cancelEnrollment(enrollmentId)

      if (success) {
        // Show success toast
        toast({
          title: "Enrollment withdrawn",
          description: "Client has been withdrawn from the program",
        })

        // Navigate to the enrollments page
        router.push("/enrollments")
      }
    } catch (error) {
      console.error("Error cancelling enrollment:", error)

      // Show error toast
      toast({
        title: "Error",
        description: "Failed to withdraw enrollment. Please try again.",
        variant: "destructive",
      })

      setIsDeleting(false)
    }
  }

  if (!enrollment || !client || !program) {
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
          <Link href="/enrollments">
            <Button variant="ghost" size="sm">
              ← Back to Enrollments
            </Button>
          </Link>
        </div>
        <h1 className="text-3xl font-bold">Update Enrollment</h1>
        <p className="text-foreground/70 mt-1">
          Update the enrollment status or withdraw the client from the program.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Enrollment Details</h2>
          <dl className="space-y-2">
            <div>
              <dt className="text-sm font-medium text-foreground/70">Client</dt>
              <dd className="mt-1">
                <Link href={`/clients/${client.id}`} className="text-primary hover:underline">
                  {client.firstName} {client.lastName}
                </Link>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-foreground/70">Program</dt>
              <dd className="mt-1">
                <Link href={`/programs/${program.id}`} className="text-primary hover:underline">
                  {program.name}
                </Link>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-foreground/70">Enrollment Date</dt>
              <dd className="mt-1">
                {formatDate(enrollment.enrollmentDate, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-foreground/70">Current Status</dt>
              <dd className="mt-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  enrollment.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : enrollment.status === 'completed'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                </span>
              </dd>
            </div>
          </dl>
        </div>

        <div className="bg-secondary/30 p-6 rounded-lg">
          <Form formMethods={formMethods} onSubmit={handleSubmit}>
            <div className="grid gap-6 mb-6">
              <FormField name="status">
                <FormLabel>Enrollment Status</FormLabel>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  <Button
                    type="button"
                    variant={formMethods.watch("status") === "active" ? "default" : "outline"}
                    onClick={() => formMethods.setValue("status", "active")}
                    className="justify-center"
                  >
                    Active
                  </Button>
                  <Button
                    type="button"
                    variant={formMethods.watch("status") === "completed" ? "default" : "outline"}
                    onClick={() => formMethods.setValue("status", "completed")}
                    className="justify-center"
                  >
                    Completed
                  </Button>
                  <Button
                    type="button"
                    variant={formMethods.watch("status") === "withdrawn" ? "default" : "outline"}
                    onClick={() => formMethods.setValue("status", "withdrawn")}
                    className="justify-center"
                  >
                    Withdrawn
                  </Button>
                </div>
              </FormField>

              <FormField name="notes">
                <FormLabel>Notes</FormLabel>
                <textarea
                  {...formMethods.register("notes")}
                  placeholder="Add notes about this enrollment"
                  className="input min-h-[100px]"
                />
              </FormField>
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <Button
                type="button"
                variant="destructive"
                onClick={handleCancelEnrollment}
                disabled={isDeleting || isSubmitting}
              >
                {isDeleting ? "Withdrawing..." : "Withdraw from Program"}
              </Button>
              <div className="flex gap-2">
                <Link href="/enrollments">
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
      </div>
    </PageContainer>
  )
} 