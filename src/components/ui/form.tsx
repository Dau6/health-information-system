"use client"

import * as React from "react"
import {
  useForm as useHookForm,
  UseFormProps,
  SubmitHandler,
  UseFormReturn,
  FieldValues,
  useFormContext,
  FormProvider,
} from "react-hook-form"
import { cn } from "@/lib/utils"

const Form = <TFormValues extends FieldValues = FieldValues>({
  children,
  className,
  onSubmit,
  formMethods,
}: {
  children: React.ReactNode
  className?: string
  onSubmit?: SubmitHandler<TFormValues>
  formMethods: UseFormReturn<TFormValues>
}) => {
  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={onSubmit ? formMethods.handleSubmit(onSubmit) : undefined}
        className={cn("space-y-6", className)}
      >
        {children}
      </form>
    </FormProvider>
  )
}

const FormField = <TFormValues extends FieldValues = FieldValues>({
  children,
  name,
}: {
  children: React.ReactNode
  name: string
}) => {
  const formContext = useFormContext<TFormValues>()
  
  if (!formContext) {
    throw new Error("FormField must be used within a Form")
  }
  
  return (
    <div className="space-y-2">
      {children}
      
      {formContext.formState.errors[name] && (
        <p className="text-sm text-red-600">
          {formContext.formState.errors[name]?.message as string}
        </p>
      )}
    </div>
  )
}

const FormLabel = ({
  children,
  className,
  required,
}: {
  children: React.ReactNode
  className?: string
  required?: boolean
}) => {
  return (
    <label className={cn("block text-sm font-medium", className)}>
      {children}
      {required && <span className="ml-1 text-red-600">*</span>}
    </label>
  )
}

function useForm<TFormValues extends FieldValues = FieldValues>(
  props?: UseFormProps<TFormValues>
): UseFormReturn<TFormValues> {
  return useHookForm<TFormValues>(props)
}

export { Form, FormField, FormLabel, useForm } 