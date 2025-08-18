"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  // Theme fixed to light; hide toggle or keep as no-op
  return (
    <Button variant="ghost" size="icon" className="h-9 w-9 opacity-40 cursor-not-allowed" disabled>
      <Sun className="h-4 w-4" />
      <span className="sr-only">Theme toggle disabled</span>
    </Button>
  )
}