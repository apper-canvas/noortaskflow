import React from "react"
import { format, isToday, isTomorrow, isPast } from "date-fns"
import Checkbox from "@/components/atoms/Checkbox"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const TaskCard = ({ 
task, 
  onToggleComplete, 
  onEdit, 
  onDelete, 
  className,
  isDragging = false,
  isSelected = false,
  onSelectionChange,
  showSelection = false
}) => {
  const formatDueDate = (date) => {
    if (!date) return null
    
    if (isToday(date)) return "Today"
    if (isTomorrow(date)) return "Tomorrow"
    return format(date, "MMM d")
  }

  const getDueDateColor = (date) => {
    if (!date) return "text-gray-500"
    if (isPast(date) && !isToday(date)) return "text-error"
    if (isToday(date)) return "text-warning"
    return "text-gray-500"
  }

  const priorityColors = {
    high: "high",
    medium: "medium", 
    low: "low"
  }

  return (
    <div 
      className={cn(
        "group p-4 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-100 hover:border-gray-200",
        task.status === "completed" && "opacity-75 bg-gray-50",
        isDragging && "dragging shadow-xl scale-105",
        className
      )}
    >
<div className="flex items-start gap-3">
        {showSelection && (
          <Checkbox 
            checked={isSelected}
            onChange={() => onSelectionChange?.(task.Id)}
            className="mt-0.5 flex-shrink-0 border-primary"
          />
        )}
        <Checkbox 
          checked={task.status === "completed"}
          onChange={() => onToggleComplete(task.Id)}
          className="mt-0.5 flex-shrink-0"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className={cn(
              "font-medium text-gray-900 transition-all duration-200",
              task.status === "completed" && "line-through text-gray-500"
            )}>
              {task.title}
            </h3>
            
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={() => onEdit(task)}
                className="p-1 text-gray-400 hover:text-primary transition-colors rounded"
              >
                <ApperIcon name="Edit2" className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(task.Id)}
                className="p-1 text-gray-400 hover:text-error transition-colors rounded"
              >
                <ApperIcon name="Trash2" className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {task.description && (
            <p className={cn(
              "text-sm text-gray-600 mb-3 line-clamp-2",
              task.status === "completed" && "text-gray-400"
            )}>
              {task.description}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant={priorityColors[task.priority]}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </Badge>
            </div>
            
            {task.dueDate && (
              <div className={cn(
                "flex items-center gap-1 text-xs font-medium",
                getDueDateColor(new Date(task.dueDate))
              )}>
                <ApperIcon name="Calendar" className="h-3 w-3" />
                {formatDueDate(new Date(task.dueDate))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskCard