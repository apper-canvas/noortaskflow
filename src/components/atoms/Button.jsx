import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Button = forwardRef(({ className, variant = "default", size = "md", children, ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
  
  const variants = {
    default: "bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95",
    outline: "border-2 border-primary text-primary bg-white hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-white hover:shadow-lg",
    ghost: "text-gray-600 hover:text-primary hover:bg-primary/10",
    danger: "bg-gradient-to-r from-error to-red-600 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
  }
  
  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-11 px-6 text-sm",
    lg: "h-12 px-8 text-base"
  }

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = "Button"

export default Button