import React from "react"
import { NavLink } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const ListSidebarItem = ({ list, isActive, className }) => {
  return (
    <NavLink
      to={`/tasks/${list.Id}`}
      className={({ isActive: linkActive }) => cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group",
        linkActive || isActive 
          ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20" 
          : "text-gray-700 hover:bg-gray-100 hover:text-primary",
        className
      )}
    >
      <div 
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ backgroundColor: list.color }}
      />
      
      <ApperIcon 
        name={list.icon} 
        className="h-4 w-4 flex-shrink-0"
      />
      
      <span className="font-medium truncate">{list.name}</span>
      
      {list.taskCount > 0 && (
        <span className={cn(
          "ml-auto text-xs px-2 py-0.5 rounded-full transition-colors",
          isActive 
            ? "bg-primary text-white" 
            : "bg-gray-200 text-gray-600 group-hover:bg-primary group-hover:text-white"
        )}>
          {list.taskCount}
        </span>
      )}
    </NavLink>
  )
}

export default ListSidebarItem