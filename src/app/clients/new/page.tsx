"use client"

import { useState } from "react"
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
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  address: z.string().min(1, "Address is required"),
  medicalHistory: z.string().optional().or(z.literal("")),
})

type ClientFormData = z.infer<typeof clientSchema>

export default function NewClientPage() {
  const router = useRouter()
  const { addClient } = useClients()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const formMethods = useForm<ClientFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "male",
      contactNumber: "",
      email: "",
      address: "",
      medicalHistory: "",
    },
  })
  
  const { register, formState: { errors } } = formMethods
  
  const handleSubmit = async (data: ClientFormData) => {
    setIsSubmitting(true)
    
    try {
      // Create the new client
      const newClient = addClient({
        ...data,
        email: data.email || undefined,
        medicalHistory: data.medicalHistory || undefined,
      })
      
      // Show success toast
      toast({
        title: "Client registered",
        description: `${newClient.firstName} ${newClient.lastName} has been successfully registered`,
      })
      
      // Navigate to the client page
      router.push(`/clients/${newClient.id}`)
    } catch (error) {
      console.error("Error creating client:", error)
      
      // Show error toast
      toast({
        title: "Error",
        description: "Failed to register client. Please try again.",
        variant: "destructive",
      })
      
      setIsSubmitting(false)
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
        <h1 className="text-3xl font-bold">Register New Client</h1>
        <p className="text-foreground/70 mt-1">
          Enter the details of the new client to register them in the system.
        </p>
      </div>
      
      <div className="bg-secondary/50 p-6 md:p-8 rounded-lg">
        <Form formMethods={formMethods} onSubmit={handleSubmit}>
          {/* Personal Information */}
          <div className="grid gap-6 mb-8">
            <h2 className="text-xl font-semibold">Personal Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField name="firstName">
                <FormLabel required>First Name</FormLabel>
                <Input 
                  {...register("firstName")} 
                  placeholder="Enter first name" 
                />
              </FormField>
              
              <FormField name="lastName">
                <FormLabel required>Last Name</FormLabel>
                <Input 
                  {...register("lastName")} 
                  placeholder="Enter last name" 
                />
              </FormField>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField name="dateOfBirth">
                <FormLabel required>Date of Birth</FormLabel>
                <Input 
                  type="date" 
                  {...register("dateOfBirth")} 
                />
              </FormField>
              
              <FormField name="gender">
                <FormLabel required>Gender</FormLabel>
                <select 
                  {...register("gender")} 
                  className="input"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </FormField>
            </div>
          </div>
          
          {/* Contact Information */}
          <div className="grid gap-6 mb-8">
            <h2 className="text-xl font-semibold">Contact Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField name="contactNumber">
                <FormLabel required>Contact Number</FormLabel>
                <Input 
                  {...register("contactNumber")} 
                  placeholder="Enter contact number" 
                />
              </FormField>
              
              <FormField name="email">
                <FormLabel>Email Address</FormLabel>
                <Input 
                  type="email" 
                  {...register("email")} 
                  placeholder="Enter email address (optional)" 
                />
              </FormField>
            </div>
            
            <FormField name="address">
              <FormLabel required>Address</FormLabel>
              <Input 
                {...register("address")} 
                placeholder="Enter full address" 
              />
            </FormField>
          </div>
          
          {/* Medical Information */}
          <div className="grid gap-6 mb-8">
            <h2 className="text-xl font-semibold">Medical Information</h2>
            
            <FormField name="medicalHistory">
              <FormLabel>Medical History</FormLabel>
              <textarea 
                {...register("medicalHistory")} 
                placeholder="Enter relevant medical history (optional)" 
                className="input min-h-[100px]"
              />
            </FormField>
          </div>
          
          <div className="flex justify-end gap-4 mt-8">
            <Link href="/clients">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Registering..." : "Register Client"}
            </Button>
          </div>
        </Form>
      </div>
    </PageContainer>
  )
} 