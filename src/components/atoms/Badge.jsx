import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Badge = forwardRef(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    high: "bg-gradient-to-r from-error to-red-600 text-white animate-pulse-priority",
    medium: "bg-gradient-to-r from-warning to-yellow-600 text-white",
    low: "bg-gradient-to-r from-info to-blue-600 text-white",
    success: "bg-gradient-to-r from-success to-green-600 text-white"
  }

  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  )
})

Badge.displayName = "Badge"

export default Badge