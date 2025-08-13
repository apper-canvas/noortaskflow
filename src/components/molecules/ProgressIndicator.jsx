import React from "react"
import { cn } from "@/utils/cn"

const ProgressIndicator = ({ completed, total, label = "Today's Progress", className }) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
  const strokeDasharray = 2 * Math.PI * 40 // circumference
  const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100

  return (
    <div className={cn("flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 backdrop-blur-sm border border-white/20", className)}>
      <div className="relative">
        <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-200"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="url(#gradient)"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#5B4FE9" />
              <stop offset="100%" stopColor="#8B7FF0" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {percentage}%
          </span>
        </div>
      </div>
      
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 mb-1">{label}</h3>
        <p className="text-sm text-gray-600">
          {completed} of {total} tasks completed
        </p>
        <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export default ProgressIndicator