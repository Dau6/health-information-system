"use client"

import { useState } from "react"
import { usePrograms } from "@/store"
import { PageContainer } from "@/components/layout/page-container"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { formatDate } from "@/lib/utils"

export default function ProgramsPage() {
  const { programs } = usePrograms()
  
  return (
    <PageContainer>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Health Programs</h1>
        <Link href="/programs/new">
          <Button>Create New Program</Button>
        </Link>
      </div>

      {/* Programs List */}
      {programs.length === 0 ? (
        <div className="text-center py-12">
          <div>
            <p className="text-lg font-medium">No health programs available</p>
            <p className="text-foreground/70 mb-4">Create your first health program to get started</p>
            <Link href="/programs/new">
              <Button>Create New Program</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program) => (
            <div
              key={program.id}
              className="border rounded-lg overflow-hidden"
            >
              <div className="p-5 bg-secondary">
                <h2 className="font-bold text-lg">{program.name}</h2>
              </div>
              <div className="p-6">
                <p className="text-foreground/70 text-sm mb-4">
                  {program.description}
                </p>
                <div className="text-sm text-foreground/70 mb-4">
                  Created: {formatDate(program.createdAt, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                <div className="flex gap-2">
                  <Link href={`/programs/${program.id}`} className="flex-1">
                    <Button variant="outline" className="w-full" size="sm">
                      View Details
                    </Button>
                  </Link>
                  <Link href={`/programs/${program.id}/edit`} className="flex-1">
                    <Button variant="ghost" className="w-full" size="sm">
                      Edit
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageContainer>
  )
} 