"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  DashboardIcon, 
  PersonIcon, 
  GlobeIcon, 
  ClipboardIcon,
  HamburgerMenuIcon,
} from "@radix-ui/react-icons"
import { useState } from "react"
import { Button } from "@/components/ui/button"

// Define navigation items
const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: DashboardIcon,
  },
  {
    name: "Clients",
    href: "/clients",
    icon: PersonIcon,
  },
  {
    name: "Programs",
    href: "/programs",
    icon: GlobeIcon,
  },
  {
    name: "Enrollments",
    href: "/enrollments",
    icon: ClipboardIcon,
  },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  
  return (
    <div className={cn(
      "flex flex-col border-r border-border bg-background transition-all duration-300",
      collapsed ? "w-[70px]" : "w-[250px]",
      className
    )}>
      {/* Sidebar Header with collapse button */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        {!collapsed && (
          <span className="font-bold text-primary truncate">Health Info System</span>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)} 
          className={cn("ml-auto", collapsed ? "mx-auto" : "")}
        >
          <HamburgerMenuIcon className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Navigation Links */}
      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <li key={item.href}>
                <Link 
                  href={item.href} 
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-secondary text-foreground"
                      : "text-foreground/70 hover:bg-secondary/50 hover:text-foreground",
                    collapsed ? "justify-center" : ""
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && <span className="ml-3">{item.name}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      
      {/* Sidebar Footer */}
      <div className="p-4 border-t border-border">
        {!collapsed && (
          <div className="text-xs text-foreground/50">
            Version 0.1.0
          </div>
        )}
      </div>
    </div>
  )
} 