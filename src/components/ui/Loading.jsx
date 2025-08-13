import React from "react"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const Loading = ({ className, message = "Loading tasks..." }) => {
  return (
    <div className={cn("min-h-screen flex items-center justify-center bg-background", className)}>
      <div className="text-center">
        <div className="relative mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto">
            <ApperIcon name="CheckSquare" className="h-8 w-8 text-white animate-pulse" />
          </div>
          <div className="absolute -inset-2 bg-gradient-to-r from-primary to-secondary rounded-3xl opacity-20 animate-ping" />
        </div>
        
        <h2 className="text-xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
          TaskFlow
        </h2>
        <p className="text-gray-600 mb-6">{message}</p>
        
        {/* Task Cards Skeleton */}
        <div className="max-w-md mx-auto space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse mt-0.5" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: `${70 + i * 10}%` }} />
                  <div className="h-3 bg-gray-100 rounded animate-pulse" style={{ width: `${50 + i * 15}%` }} />
                  <div className="flex items-center gap-2 pt-1">
                    <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse" />
                    <div className="h-4 w-12 bg-gray-100 rounded animate-pulse ml-auto" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Loading