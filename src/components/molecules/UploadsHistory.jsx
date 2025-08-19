import React, { useState, useEffect } from "react"
import { formatDistanceToNow, format } from "date-fns"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import { cn } from "@/utils/cn"
import { taskService } from "@/services/api/taskService"
import { toast } from "react-toastify"

const UploadsHistory = ({ className }) => {
  const [uploads, setUploads] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedItems, setExpandedItems] = useState(new Set())

  useEffect(() => {
    loadCompletedTasks()
  }, [])

  const loadCompletedTasks = async () => {
    try {
      setLoading(true)
      const allTasks = await taskService.getAll()
      
      // Filter completed tasks and sort by completion date (most recent first)
      const completedTasks = allTasks
        .filter(task => task.status === 'completed' && task.completedAt)
        .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
      
      setUploads(completedTasks)
    } catch (error) {
      console.error('Failed to load completed tasks:', error)
      toast.error('Failed to load upload history')
    } finally {
      setLoading(false)
    }
  }

  const toggleExpanded = (taskId) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId)
    } else {
      newExpanded.add(taskId)
    }
    setExpandedItems(newExpanded)
  }

  const handleRestoreTask = async (taskId) => {
    try {
      await taskService.update(taskId, { 
        status: 'pending', 
        completedAt: null 
      })
      toast.success('Task restored successfully')
      loadCompletedTasks()
    } catch (error) {
      console.error('Failed to restore task:', error)
      toast.error('Failed to restore task')
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to permanently delete this task?')) {
      return
    }

    try {
      await taskService.delete(taskId)
      toast.success('Task deleted successfully')
      loadCompletedTasks()
    } catch (error) {
      console.error('Failed to delete task:', error)
      toast.error('Failed to delete task')
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-500'
      case 'medium': return 'text-yellow-500'
      case 'low': return 'text-green-500'
      default: return 'text-gray-500'
    }
  }

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return 'AlertCircle'
      case 'medium': return 'Clock'
      case 'low': return 'CheckCircle2'
      default: return 'Circle'
    }
  }

  if (loading) {
    return (
      <div className={cn("p-4", className)}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-3"></div>
          <div className="space-y-2">
            <div className="h-10 bg-gray-100 rounded"></div>
            <div className="h-10 bg-gray-100 rounded"></div>
            <div className="h-10 bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (uploads.length === 0) {
    return (
      <div className={cn("p-4", className)}>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Upload History
        </h3>
        <div className="text-center py-6">
          <ApperIcon name="Upload" size={24} className="text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No completed tasks yet</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("p-4", className)}>
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
        Upload History ({uploads.length})
      </h3>
      
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {uploads.map((upload) => (
          <div
            key={upload.Id}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-sm"
          >
            {/* Header */}
            <div 
              className="p-3 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleExpanded(upload.Id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <ApperIcon 
                    name={getPriorityIcon(upload.priority)} 
                    size={14} 
                    className={cn("flex-shrink-0", getPriorityColor(upload.priority))}
                  />
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {upload.title}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(upload.completedAt), { addSuffix: true })}
                  </span>
                  <ApperIcon 
                    name={expandedItems.has(upload.Id) ? "ChevronUp" : "ChevronDown"} 
                    size={14} 
                    className="text-gray-400 flex-shrink-0"
                  />
                </div>
              </div>
            </div>

            {/* Expanded Content */}
            {expandedItems.has(upload.Id) && (
              <div className="border-t border-gray-100 bg-gray-50">
                <div className="p-3 space-y-3">
                  {/* Task Details */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Completed:</span>
                      <span className="text-gray-700">
                        {format(new Date(upload.completedAt), 'MMM dd, yyyy HH:mm')}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Priority:</span>
                      <div className="flex items-center space-x-1">
                        <ApperIcon 
                          name={getPriorityIcon(upload.priority)} 
                          size={12} 
                          className={getPriorityColor(upload.priority)}
                        />
                        <span className={cn("capitalize", getPriorityColor(upload.priority))}>
                          {upload.priority}
                        </span>
                      </div>
                    </div>

                    {upload.dueDate && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Due Date:</span>
                        <span className="text-gray-700">
                          {format(new Date(upload.dueDate), 'MMM dd, yyyy')}
                        </span>
                      </div>
                    )}

                    {upload.description && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {upload.description}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-200">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRestoreTask(upload.Id)}
                      className="text-xs h-7 px-2"
                    >
                      <ApperIcon name="RotateCcw" size={12} className="mr-1" />
                      Restore
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTask(upload.Id)}
                      className="text-xs h-7 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <ApperIcon name="Trash2" size={12} className="mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default UploadsHistory