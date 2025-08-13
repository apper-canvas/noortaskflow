import React from "react"
import Select from "@/components/atoms/Select"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const FilterBar = ({ 
  statusFilter, 
  priorityFilter, 
  onStatusChange, 
  onPriorityChange, 
  onClearFilters,
  className 
}) => {
  const hasActiveFilters = statusFilter !== "all" || priorityFilter !== "all"

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <div className="flex items-center gap-2">
        <Select value={statusFilter} onChange={(e) => onStatusChange(e.target.value)}>
          <option value="all">All Tasks</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </Select>
        
        <Select value={priorityFilter} onChange={(e) => onPriorityChange(e.target.value)}>
          <option value="all">All Priorities</option>
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </Select>
      </div>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={onClearFilters}>
          <ApperIcon name="X" className="h-4 w-4 mr-1" />
          Clear
        </Button>
      )}
    </div>
  )
}

export default FilterBar