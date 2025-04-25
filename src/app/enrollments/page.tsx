"use client"

import { useState } from "react"
import { useEnrollments, useClients, usePrograms } from "@/store"
import { PageContainer } from "@/components/layout/page-container"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { Input } from "@/components/ui/input"

export default function EnrollmentsPage() {
  const { enrollments } = useEnrollments()
  const { clients } = useClients()
  const { programs } = usePrograms()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  // Helper function to get client name by ID
  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId)
    return client ? `${client.firstName} ${client.lastName}` : "Unknown Client"
  }
  
  // Helper function to get program name by ID
  const getProgramName = (programId: string) => {
    const program = programs.find(p => p.id === programId)
    return program ? program.name : "Unknown Program"
  }
  
  // Filter enrollments based on search term and status
  const filteredEnrollments = enrollments.filter(enrollment => {
    const client = clients.find(c => c.id === enrollment.clientId)
    const program = programs.find(p => p.id === enrollment.programId)
    
    const matchesSearch = 
      client && (
        `${client.firstName} ${client.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program?.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    
    const matchesStatus = filterStatus === "all" || enrollment.status === filterStatus
    
    return matchesSearch && matchesStatus
  })
  
  // Group enrollments by program
  const enrollmentsByProgram = programs.map(program => {
    const programEnrollments = filteredEnrollments.filter(e => e.programId === program.id)
    
    return {
      program,
      enrollments: programEnrollments,
      activeCount: programEnrollments.filter(e => e.status === "active").length,
      totalCount: programEnrollments.length
    }
  }).filter(group => group.totalCount > 0)

  return (
    <PageContainer>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Program Enrollments</h1>
        <Link href="/enrollments/new">
          <Button>Enroll Client in Program</Button>
        </Link>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="w-full sm:w-1/2">
          <Input
            type="search"
            placeholder="Search by client name or program..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex gap-2">
          <Button 
            variant={filterStatus === "all" ? "default" : "outline"} 
            onClick={() => setFilterStatus("all")}
            size="sm"
          >
            All
          </Button>
          <Button 
            variant={filterStatus === "active" ? "default" : "outline"} 
            onClick={() => setFilterStatus("active")}
            size="sm"
          >
            Active
          </Button>
          <Button 
            variant={filterStatus === "completed" ? "default" : "outline"} 
            onClick={() => setFilterStatus("completed")}
            size="sm"
          >
            Completed
          </Button>
          <Button 
            variant={filterStatus === "withdrawn" ? "default" : "outline"} 
            onClick={() => setFilterStatus("withdrawn")}
            size="sm"
          >
            Withdrawn
          </Button>
        </div>
      </div>
      
      {/* Enrollment by Program List */}
      {enrollmentsByProgram.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg font-medium">No enrollments found</p>
          {searchTerm || filterStatus !== "all" ? (
            <p className="text-foreground/70">Try adjusting your filters</p>
          ) : (
            <div>
              <p className="text-foreground/70 mb-4">Enroll a client in a program to get started</p>
              <Link href="/enrollments/new">
                <Button>Enroll Client</Button>
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {enrollmentsByProgram.map(({ program, enrollments, activeCount, totalCount }) => (
            <div key={program.id} className="border rounded-lg overflow-hidden">
              <div className="bg-secondary p-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <h2 className="text-xl font-bold">{program.name}</h2>
                    <p className="text-sm text-foreground/70">
                      {activeCount} active / {totalCount} total enrollments
                    </p>
                  </div>
                  <Link href={`/programs/${program.id}`}>
                    <Button variant="outline" size="sm">View Program Details</Button>
                  </Link>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-secondary/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">
                        Client Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">
                        Enrollment Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">
                        Notes
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-background divide-y divide-border">
                    {enrollments.map((enrollment) => (
                      <tr key={enrollment.id} className="hover:bg-secondary/20">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link href={`/clients/${enrollment.clientId}`} className="text-primary hover:underline">
                            {getClientName(enrollment.clientId)}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {formatDate(enrollment.enrollmentDate, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            enrollment.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : enrollment.status === 'completed'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-foreground/70 truncate max-w-[200px]">
                            {enrollment.notes || "—"}
                          </p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            <Link href={`/enrollments/${enrollment.id}/edit`}>
                              <Button variant="ghost" size="sm">
                                Update
                              </Button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageContainer>
  )
} 