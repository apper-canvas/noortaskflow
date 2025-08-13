import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const Checkbox = forwardRef(({ className, checked, onChange, ...props }, ref) => {
  return (
    <div className="relative">
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={onChange}
        ref={ref}
        {...props}
      />
      <div
        className={cn(
          "h-5 w-5 rounded border-2 border-gray-300 bg-white cursor-pointer transition-all duration-200 flex items-center justify-center",
          checked && "bg-gradient-to-r from-primary to-secondary border-primary animate-bounce-in",
          className
        )}
        onClick={() => onChange && onChange({ target: { checked: !checked } })}
      >
        {checked && (
          <ApperIcon 
            name="Check" 
            className="h-3 w-3 text-white animate-celebration"
          />
        )}
      </div>
    </div>
  )
})

Checkbox.displayName = "Checkbox"

export default Checkbox