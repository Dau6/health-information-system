"use client"

import { useState } from "react"
import { useClients } from "@/store"
import { PageContainer } from "@/components/layout/page-container"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { formatDate } from "@/lib/utils"

export default function ClientsPage() {
  const { clients, searchClients } = useClients()
  const [searchTerm, setSearchTerm] = useState("")
  
  // Filter clients based on search term
  const filteredClients = searchTerm 
    ? searchClients(searchTerm)
    : [...clients].sort((a, b) => 
        a.lastName.localeCompare(b.lastName) || 
        a.firstName.localeCompare(b.firstName)
      )

  return (
    <PageContainer>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Clients</h1>
        <Link href="/clients/new">
          <Button>Register New Client</Button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Input
            type="search"
            placeholder="Search clients by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-foreground/70 hover:text-foreground"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Clients List */}
      {filteredClients.length === 0 ? (
        <div className="text-center py-12">
          {searchTerm ? (
            <div>
              <p className="text-lg font-medium">No clients found</p>
              <p className="text-foreground/70">Try a different search term</p>
            </div>
          ) : (
            <div>
              <p className="text-lg font-medium">No clients registered yet</p>
              <p className="text-foreground/70 mb-4">Register your first client to get started</p>
              <Link href="/clients/new">
                <Button>Register New Client</Button>
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-background border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-secondary">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">
                    Contact Information
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">
                    Date Registered
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-background divide-y divide-border">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-secondary/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium">
                            {client.lastName}, {client.firstName}
                          </div>
                          <div className="text-sm text-foreground/70">
                            {formatDate(client.dateOfBirth, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">{client.contactNumber}</div>
                      {client.email && (
                        <div className="text-sm text-foreground/70">{client.email}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        {formatDate(client.createdAt, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <Link href={`/clients/${client.id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                        <Link href={`/clients/${client.id}/edit`}>
                          <Button variant="ghost" size="sm">
                            Edit
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
      )}
    </PageContainer>
  )
} 