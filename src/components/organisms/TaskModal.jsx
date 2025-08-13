import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Label from "@/components/atoms/Label"
import Select from "@/components/atoms/Select"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const TaskModal = ({ isOpen, onClose, onSave, task, lists }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    listId: "1"
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || "",
        priority: task.priority,
        dueDate: task.dueDate ? format(new Date(task.dueDate), "yyyy-MM-dd") : "",
        listId: task.listId
      })
    } else {
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        dueDate: "",
        listId: "1"
      })
    }
    setErrors({})
  }, [task, isOpen])

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }
    
    if (formData.dueDate) {
      const selectedDate = new Date(formData.dueDate)
      if (selectedDate < new Date().setHours(0, 0, 0, 0)) {
        newErrors.dueDate = "Due date cannot be in the past"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    const taskData = {
      ...formData,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : null
    }

    onSave(taskData)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">
                  {task ? "Edit Task" : "Create New Task"}
                </h2>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" className="h-5 w-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <Label htmlFor="title">Task Title</Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Enter task title..."
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className={cn(errors.title && "border-error focus:ring-error")}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-error">{errors.title}</p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  rows={3}
                  placeholder="Add a description..."
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="flex w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm ring-offset-background placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    id="priority"
                    value={formData.priority}
                    onChange={(e) => handleChange("priority", e.target.value)}
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="list">List</Label>
                  <Select
                    id="list"
                    value={formData.listId}
                    onChange={(e) => handleChange("listId", e.target.value)}
                  >
                    {lists.map((list) => (
                      <option key={list.Id} value={list.Id.toString()}>
                        {list.name}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleChange("dueDate", e.target.value)}
                  className={cn(errors.dueDate && "border-error focus:ring-error")}
                  min={format(new Date(), "yyyy-MM-dd")}
                />
                {errors.dueDate && (
                  <p className="mt-1 text-sm text-error">{errors.dueDate}</p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  <ApperIcon name="Save" className="h-4 w-4 mr-2" />
                  {task ? "Update Task" : "Create Task"}
                </Button>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default TaskModal