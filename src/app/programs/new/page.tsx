"use client"

import { useState } from "react"
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

export default function NewProgramPage() {
  const router = useRouter()
  const { addProgram } = usePrograms()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const formMethods = useForm<ProgramFormData>({
    defaultValues: {
      name: "",
      description: "",
    },
  })
  
  const { register, formState: { errors } } = formMethods
  
  const handleSubmit = async (data: ProgramFormData) => {
    setIsSubmitting(true)
    
    try {
      // Create the new program
      const newProgram = addProgram(data)
      
      // Show success toast
      toast({
        title: "Program created",
        description: `${newProgram.name} has been successfully created`,
      })
      
      // Navigate to the program page
      router.push(`/programs/${newProgram.id}`)
    } catch (error) {
      console.error("Error creating program:", error)
      
      // Show error toast
      toast({
        title: "Error",
        description: "Failed to create program. Please try again.",
        variant: "destructive",
      })
      
      setIsSubmitting(false)
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
        <h1 className="text-3xl font-bold">Create New Health Program</h1>
        <p className="text-foreground/70 mt-1">
          Enter the details of the new health program.
        </p>
      </div>
      
      <div className="bg-secondary/50 p-6 md:p-8 rounded-lg max-w-2xl">
        <Form formMethods={formMethods} onSubmit={handleSubmit}>
          <div className="grid gap-6 mb-8">
            <FormField name="name">
              <FormLabel required>Program Name</FormLabel>
              <Input 
                {...register("name")} 
                placeholder="Enter program name" 
              />
            </FormField>
            
            <FormField name="description">
              <FormLabel required>Description</FormLabel>
              <textarea 
                {...register("description")} 
                placeholder="Enter program description" 
                className="input min-h-[150px]"
              />
            </FormField>
          </div>
          
          <div className="flex justify-end gap-4">
            <Link href="/programs">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Program"}
            </Button>
          </div>
        </Form>
      </div>
    </PageContainer>
  )
} 