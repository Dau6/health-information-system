"use client";

import { useClients, usePrograms, useEnrollments } from "@/store";
import { PageContainer } from "@/components/layout/page-container";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
  // Get the current user data from Clerk
  const { user, isLoaded, isSignedIn } = useUser();
  const [userName, setUserName] = useState<string>("User");
  
  // Get data from stores
  const { clients } = useClients();
  const { programs } = usePrograms();
  const { enrollments } = useEnrollments();

  // Redirect to home if not signed in
  if (isLoaded && !isSignedIn) {
    redirect("/");
  }

  // Extract user's name (from first name, full name, or email)
  useEffect(() => {
    if (user) {
      if (user.firstName) {
        // Use first name if available
        setUserName(user.firstName);
      } else if (user.fullName) {
        // Use first part of full name if available
        setUserName(user.fullName.split(' ')[0]);
      } else if (user.emailAddresses && user.emailAddresses.length > 0) {
        // Extract name from email (part before @)
        const email = user.emailAddresses[0].emailAddress;
        const nameFromEmail = email.split('@')[0];
        
        // Capitalize and clean up the name (remove numbers, underscores, etc.)
        const cleanName = nameFromEmail
          .replace(/[0-9_\-.]/g, ' ')  // Replace numbers and special chars with spaces
          .trim()
          .split(' ')[0];              // Get first part
          
        // Capitalize first letter
        const formattedName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
        setUserName(formattedName);
      }
    }
  }, [user]);

  // Get active enrollments count
  const activeEnrollments = enrollments.filter(e => e.status === 'active').length;

  // Get stats for summary cards
  const stats = [
    { name: "Total Clients", value: clients.length },
    { name: "Health Programs", value: programs.length },
    { name: "Active Enrollments", value: activeEnrollments },
  ];

  // Get recent clients (last 5)
  const recentClients = [...clients]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Show loading state while user data is loading
  if (!isLoaded) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center h-40">
          <div className="text-foreground/70">Loading...</div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome, {userName}!</h1>
        <p className="text-foreground/70">
          Manage clients, health programs, and enrollments in one place
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-secondary rounded-lg p-6 shadow-sm"
          >
            <p className="text-sm text-foreground/70 font-medium">{stat.name}</p>
            <p className="text-3xl font-bold mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link href="/clients/new">
            <Button>Register New Client</Button>
          </Link>
          <Link href="/programs/new">
            <Button variant="outline">Create Health Program</Button>
          </Link>
          <Link href="/enrollments/new">
            <Button variant="secondary">Enroll Client in Program</Button>
          </Link>
        </div>
      </div>

      {/* Recent Clients */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Recent Clients</h2>
          <Link href="/clients">
            <Button variant="ghost" className="text-sm">
              View All
            </Button>
          </Link>
        </div>
        
        {recentClients.length === 0 ? (
          <p className="text-foreground/70">No clients registered yet.</p>
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
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">
                      Date Registered
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-background divide-y divide-border">
                  {recentClients.map((client) => (
                    <tr key={client.id} className="hover:bg-secondary/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium">
                          {client.firstName} {client.lastName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">{client.contactNumber}</div>
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
                        <Link href={`/clients/${client.id}`}>
                          <Button variant="link" className="p-0 h-auto font-normal">
                            View Profile
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Health Programs Overview */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Health Programs</h2>
          <Link href="/programs">
            <Button variant="ghost" className="text-sm">
              View All
            </Button>
          </Link>
        </div>
        
        {programs.length === 0 ? (
          <p className="text-foreground/70">No health programs available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program) => (
              <div
                key={program.id}
                className="border rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="font-bold text-lg mb-2">{program.name}</h3>
                <p className="text-foreground/70 text-sm mb-4 line-clamp-2">
                  {program.description}
                </p>
                <Link href={`/programs/${program.id}`}>
                  <Button variant="outline" className="w-full">View Details</Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
} 