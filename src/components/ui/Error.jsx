import React from "react"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const Error = ({ 
  message = "Something went wrong", 
  onRetry, 
  className 
}) => {
  return (
    <div className={cn("min-h-screen flex items-center justify-center bg-background p-4", className)}>
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-gradient-to-br from-error to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <ApperIcon name="AlertTriangle" className="h-10 w-10 text-white" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Oops! Something went wrong
        </h2>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          {message}
        </p>
        
        <div className="space-y-4">
          {onRetry && (
            <Button 
              onClick={onRetry}
              className="w-full sm:w-auto"
            >
              <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
          
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto sm:ml-3"
          >
            <ApperIcon name="RotateCcw" className="h-4 w-4 mr-2" />
            Reload Page
          </Button>
        </div>
        
        <div className="mt-8 p-4 bg-gray-50 rounded-xl">
          <p className="text-sm text-gray-500 mb-2">
            <ApperIcon name="Info" className="h-4 w-4 inline mr-1" />
            Need help?
          </p>
          <p className="text-xs text-gray-400 leading-relaxed">
            If this problem persists, try refreshing the page or checking your internet connection.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Error