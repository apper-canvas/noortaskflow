import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import TaskCard from "@/components/molecules/TaskCard"
import Empty from "@/components/ui/Empty"
import { cn } from "@/utils/cn"

const TasksList = ({ 
  tasks, 
  onToggleComplete, 
  onEditTask, 
  onDeleteTask,
  className 
}) => {
  const [draggedTask, setDraggedTask] = useState(null)

  const handleDragStart = (e, task) => {
    setDraggedTask(task)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragEnd = () => {
    setDraggedTask(null)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDraggedTask(null)
  }

  if (tasks.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <Empty
          icon="CheckSquare"
          title="No tasks found"
          description="Create your first task to get started with productivity!"
          actionLabel="Add Task"
        />
      </div>
    )
  }

  return (
    <div 
      className={cn("space-y-3", className)}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <AnimatePresence mode="popLayout">
        {tasks.map((task, index) => (
          <motion.div
            key={task.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ 
              duration: 0.2,
              delay: index * 0.05 
            }}
            layout
            draggable
            onDragStart={(e) => handleDragStart(e, task)}
            onDragEnd={handleDragEnd}
            className="cursor-move"
          >
            <TaskCard
              task={task}
              onToggleComplete={onToggleComplete}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              isDragging={draggedTask?.Id === task.Id}
              className="hover:shadow-md"
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default TasksList