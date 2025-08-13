import React from "react"
import { useLocation } from "react-router-dom"
import ListSidebarItem from "@/components/molecules/ListSidebarItem"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const ListsSidebar = ({ lists, className }) => {
  const location = useLocation()
  const currentListId = location.pathname.split("/").pop()

  // Add "All Tasks" virtual list
  const allLists = [
    {
      Id: "all",
      name: "All Tasks",
      icon: "List",
      color: "#5B4FE9",
      taskCount: lists.reduce((sum, list) => sum + list.taskCount, 0)
    },
    ...lists
  ]

  return (
    <div className={cn("w-80 bg-white border-r border-gray-200 flex flex-col", className)}>
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
            <ApperIcon name="CheckSquare" className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              TaskFlow
            </h1>
            <p className="text-sm text-gray-600">Streamlined productivity</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <div className="space-y-1">
          <div className="mb-4">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-3">
              Lists
            </h2>
          </div>
          
          {allLists.map((list) => (
            <ListSidebarItem
              key={list.Id}
              list={list}
              isActive={currentListId === list.Id.toString()}
            />
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="bg-gradient-to-br from-primary/5 to-secondary/5 p-4 rounded-xl">
          <div className="flex items-center gap-2 text-primary mb-2">
            <ApperIcon name="Lightbulb" className="h-4 w-4" />
            <span className="font-medium text-sm">Pro Tip</span>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            Use drag & drop to reorder your tasks and stay organized!
          </p>
        </div>
      </div>
    </div>
  )
}

export default ListsSidebar