"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useClients } from "@/store"
import { PageContainer } from "@/components/layout/page-container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormField, FormLabel, useForm } from "@/components/ui/form"
import Link from "next/link"
import { z } from "zod"
import { toast } from "@/hooks/use-toast"

// Form validation schema
const clientSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Gender is required",
  }),
  contactNumber: z.string().min(1, "Contact number is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  address: z.string().min(1, "Address is required"),
  medicalHistory: z.string().optional().or(z.literal("")),
})

type ClientFormData = z.infer<typeof clientSchema>

interface ClientEditPageProps {
  params: {
    id: string
  }
}

export default function ClientEditPage({ params }: ClientEditPageProps) {
  const router = useRouter()
  const clientId = params.id
  const { getClientById, updateClient, deleteClient } = useClients()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get client data
  const client = getClientById(clientId)

  // Set up form with client data
  const formMethods = useForm<ClientFormData>({
    defaultValues: client ? {
      firstName: client.firstName,
      lastName: client.lastName,
      dateOfBirth: client.dateOfBirth,
      gender: client.gender,
      contactNumber: client.contactNumber,
      email: client.email || "",
      address: client.address,
      medicalHistory: client.medicalHistory || "",
    } : undefined,
  })

  // Redirect if client not found
  useEffect(() => {
    if (!client) {
      toast({
        title: "Error",
        description: "Client not found",
        variant: "destructive",
      })
      router.push("/clients")
    }
  }, [client, router])

  const handleSubmit = async (data: ClientFormData) => {
    setIsSubmitting(true)

    try {
      // Update the client
      const updatedClient = updateClient(clientId, data)

      if (updatedClient) {
        // Show success toast
        toast({
          title: "Client updated",
          description: `${updatedClient.firstName} ${updatedClient.lastName}'s information has been updated`,
        })

        // Navigate to the client details page
        router.push(`/clients/${updatedClient.id}`)
      }
    } catch (error) {
      console.error("Error updating client:", error)

      // Show error toast
      toast({
        title: "Error",
        description: "Failed to update client. Please try again.",
        variant: "destructive",
      })

      setIsSubmitting(false)
    }
  }

  const handleDeleteClient = async () => {
    if (confirm("Are you sure you want to delete this client? This action cannot be undone.")) {
      setIsDeleting(true)

      try {
        // Delete the client
        const success = deleteClient(clientId)

        if (success) {
          // Show success toast
          toast({
            title: "Client deleted",
            description: "Client has been permanently deleted",
          })

          // Navigate to clients list
          router.push("/clients")
        }
      } catch (error) {
        console.error("Error deleting client:", error)

        // Show error toast
        toast({
          title: "Error",
          description: "Failed to delete client. Please try again.",
          variant: "destructive",
        })

        setIsDeleting(false)
      }
    }
  }

  if (!client) {
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
          <Link href={`/clients/${clientId}`}>
            <Button variant="ghost" size="sm">
              ← Back to Client Profile
            </Button>
          </Link>
        </div>
        <h1 className="text-3xl font-bold">Edit Client</h1>
        <p className="text-foreground/70 mt-1">
          Update client information and contact details.
        </p>
      </div>

      <div className="bg-secondary/30 p-6 md:p-8 rounded-lg max-w-3xl mx-auto">
        <Form formMethods={formMethods} onSubmit={handleSubmit}>
          <div className="grid gap-6 mb-8">
            <div className="grid md:grid-cols-2 gap-6">
              <FormField name="firstName">
                <FormLabel required>First Name</FormLabel>
                <Input 
                  {...formMethods.register("firstName")} 
                  placeholder="Enter first name" 
                />
              </FormField>
              
              <FormField name="lastName">
                <FormLabel required>Last Name</FormLabel>
                <Input 
                  {...formMethods.register("lastName")} 
                  placeholder="Enter last name" 
                />
              </FormField>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <FormField name="dateOfBirth">
                <FormLabel required>Date of Birth</FormLabel>
                <Input 
                  type="date" 
                  {...formMethods.register("dateOfBirth")} 
                />
              </FormField>
              
              <FormField name="gender">
                <FormLabel required>Gender</FormLabel>
                <select 
                  {...formMethods.register("gender")} 
                  className="input"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </FormField>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <FormField name="contactNumber">
                <FormLabel required>Contact Number</FormLabel>
                <Input 
                  {...formMethods.register("contactNumber")} 
                  placeholder="Enter contact number" 
                />
              </FormField>
              
              <FormField name="email">
                <FormLabel>Email</FormLabel>
                <Input 
                  type="email" 
                  {...formMethods.register("email")} 
                  placeholder="Enter email address" 
                />
              </FormField>
            </div>
            
            <FormField name="address">
              <FormLabel required>Address</FormLabel>
              <Input 
                {...formMethods.register("address")} 
                placeholder="Enter address" 
              />
            </FormField>
            
            <FormField name="medicalHistory">
              <FormLabel>Medical History</FormLabel>
              <textarea 
                {...formMethods.register("medicalHistory")} 
                placeholder="Enter any relevant medical history" 
                className="input min-h-[120px]"
              />
            </FormField>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteClient}
              disabled={isDeleting || isSubmitting}
            >
              {isDeleting ? "Deleting..." : "Delete Client"}
            </Button>
            <div className="flex gap-2">
              <Link href={`/clients/${clientId}`}>
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