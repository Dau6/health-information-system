"use client"

import * as React from "react"
import { MoonIcon, SunIcon, DesktopIcon } from "@radix-ui/react-icons"
import { useTheme } from "@/store/theme"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  
  // Apply the theme on the document element when it changes or on component mount
  useEffect(() => {
    const root = window.document.documentElement
    
    // Remove all previous theme classes
    root.classList.remove("light", "dark")
    
    // Apply the current theme
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }
  }, [theme])
  
  // Set up media query listener to change theme when system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    
    const handleChange = () => {
      if (theme === "system") {
        const root = window.document.documentElement
        root.classList.remove("light", "dark")
        root.classList.add(mediaQuery.matches ? "dark" : "light")
      }
    }
    
    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [theme])
  
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("light")}
        className={theme === "light" ? "bg-secondary" : ""}
        title="Light mode"
      >
        <SunIcon className="h-5 w-5" />
        <span className="sr-only">Light mode</span>
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("dark")}
        className={theme === "dark" ? "bg-secondary" : ""}
        title="Dark mode"
      >
        <MoonIcon className="h-5 w-5" />
        <span className="sr-only">Dark mode</span>
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("system")}
        className={theme === "system" ? "bg-secondary" : ""}
        title="System theme"
      >
        <DesktopIcon className="h-5 w-5" />
        <span className="sr-only">System theme</span>
      </Button>
    </div>
  )
} 