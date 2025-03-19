```tsx file="components/ui/calendar.tsx" isFixed isFixed isFixed isFixed isFixed isFixed isFixed isFixed isFixed isFixed isFixed isFixed isFixed isFixed isFixed isFixed isFixed isFixed isFixed isFixed isFixed isFixed isFixed isFixed isFixed isFixed isFixed isFixed isFixed isFixed isFixed isFixed isFixed isFixed isFixed isFixed isFixed isFixed isFixed isFixed isFixed isFixed isFixed
"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export type CalendarProps = {
  className?: string
  classNames?: Record<string, string>
  showOutsideDays?: boolean
  [key: string]: any
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <div className={cn("p-3", className)}>
      <div className="flex justify-center pt-1 relative items-center">
        <div className="space-x-1 flex items-center">
          <Button
            variant="outline"
            className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-7">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
          <div key={i} className="text-center text-sm text-muted-foreground">
            {day}
          </div>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-1">
        {Array.from({ length: 35 }).map((_, i) => (
          <Button
            key={i}
            variant="ghost"
            className="h-9 w-9 p-0 font-normal aria-selected:opacity-100"
          >
            {i + 1}
          </Button>
        ))}
      </div>
    </div>
  )
}
Calendar.displayName = "Calendar"

export { Calendar }

