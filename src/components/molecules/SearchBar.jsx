import React from "react"
import ApperIcon from "@/components/ApperIcon"
import Input from "@/components/atoms/Input"
import { cn } from "@/utils/cn"

const SearchBar = ({ value, onChange, placeholder = "Search tasks...", className, ...props }) => {
  return (
    <div className={cn("relative", className)}>
      <ApperIcon 
        name="Search" 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500"
      />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="pl-10 bg-white/80 backdrop-blur-sm border-gray-200 focus:bg-white"
        {...props}
      />
      {value && (
        <button
          onClick={() => onChange({ target: { value: "" } })}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ApperIcon name="X" className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

export default SearchBar