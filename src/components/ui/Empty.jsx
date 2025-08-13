import React from "react"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const Empty = ({ 
  icon = "FileText",
  title = "No items found",
  description = "Get started by creating your first item.",
  actionLabel = "Create New",
  onAction,
  className 
}) => {
  return (
    <div className={cn("text-center py-12 px-4", className)}>
      <div className="max-w-md mx-auto">
        <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary/20">
          <ApperIcon name={icon} className="h-12 w-12 text-primary" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          {title}
        </h3>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          {description}
        </p>
        
        {onAction && (
          <Button onClick={onAction} className="mx-auto">
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            {actionLabel}
          </Button>
        )}
        
        <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <ApperIcon name="Zap" className="h-4 w-4" />
            <span>Fast & Simple</span>
          </div>
          <div className="flex items-center gap-1">
            <ApperIcon name="Sparkles" className="h-4 w-4" />
            <span>Stay Organized</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Empty