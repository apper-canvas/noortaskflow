import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { taskService } from "@/services/api/taskService";
import { listService } from "@/services/api/listService";
import ApperIcon from "@/components/ApperIcon";
import TaskModal from "@/components/organisms/TaskModal";
import TasksList from "@/components/organisms/TasksList";
import FilterBar from "@/components/molecules/FilterBar";
import SearchBar from "@/components/molecules/SearchBar";
import ProgressIndicator from "@/components/molecules/ProgressIndicator";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import tasksData from "@/services/mockData/tasks.json";
import listsData from "@/services/mockData/lists.json";
import { cn } from "@/utils/cn";

const TasksPage = () => {
  const { listId } = useParams()
  
  const [tasks, setTasks] = useState([])
  const [lists, setLists] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
const [selectedTasks, setSelectedTasks] = useState([])
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [bulkEditMode, setBulkEditMode] = useState(null)
  const [bulkDueDate, setBulkDueDate] = useState("")
  const [bulkPriority, setBulkPriority] = useState("")
  const [isBulkLoading, setIsBulkLoading] = useState(false)
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      const [tasksData, listsData] = await Promise.all([
        taskService.getAll(),
        listService.getAll()
      ])
      setTasks(tasksData)
      setLists(listsData)
    } catch (err) {
      setError("Failed to load data. Please try again.")
      console.error("Error loading data:", err)
    } finally {
      setLoading(false)
    }
  }

  const filteredTasks = useMemo(() => {
    let filtered = tasks

    // Filter by list
    if (listId !== "all") {
      filtered = filtered.filter(task => task.listId === listId)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query)
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(task => task.status === statusFilter)
    }

    // Filter by priority
    if (priorityFilter !== "all") {
      filtered = filtered.filter(task => task.priority === priorityFilter)
    }

    // Sort by completion status, then by priority, then by due date
    return filtered.sort((a, b) => {
      if (a.status !== b.status) {
        return a.status === "completed" ? 1 : -1
      }
      
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      if (a.priority !== b.priority) {
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      }
      
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate) - new Date(b.dueDate)
      }
      if (a.dueDate && !b.dueDate) return -1
      if (!a.dueDate && b.dueDate) return 1
      
      return new Date(b.createdAt) - new Date(a.createdAt)
    })
  }, [tasks, listId, searchQuery, statusFilter, priorityFilter])

  const currentList = lists.find(list => list.Id.toString() === listId)
  const listName = listId === "all" ? "All Tasks" : currentList?.name || "Tasks"

  const completedCount = filteredTasks.filter(task => task.status === "completed").length
  const totalCount = filteredTasks.length

  const handleToggleComplete = async (taskId) => {
    try {
      const task = tasks.find(t => t.Id === taskId)
      if (!task) return

      const updatedTask = {
        ...task,
        status: task.status === "completed" ? "pending" : "completed",
        completedAt: task.status === "completed" ? null : new Date()
      }

      await taskService.update(taskId, updatedTask)
      setTasks(prev => prev.map(t => t.Id === taskId ? updatedTask : t))
      
      toast.success(
        updatedTask.status === "completed" 
          ? "🎉 Task completed!" 
          : "Task marked as pending"
      )
    } catch (err) {
      toast.error("Failed to update task")
      console.error("Error updating task:", err)
    }
  }

  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await taskService.create(taskData)
      setTasks(prev => [newTask, ...prev])
      toast.success("✨ Task created successfully!")
    } catch (err) {
      toast.error("Failed to create task")
      console.error("Error creating task:", err)
    }
  }

  const handleUpdateTask = async (taskData) => {
    try {
      const updatedTask = await taskService.update(editingTask.Id, taskData)
      setTasks(prev => prev.map(t => t.Id === editingTask.Id ? updatedTask : t))
      toast.success("Task updated successfully!")
    } catch (err) {
      toast.error("Failed to update task")
      console.error("Error updating task:", err)
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return

    try {
      await taskService.delete(taskId)
      setTasks(prev => prev.filter(t => t.Id !== taskId))
      toast.success("Task deleted successfully")
    } catch (err) {
      toast.error("Failed to delete task")
      console.error("Error deleting task:", err)
    }
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingTask(null)
  }

  const handleSaveTask = async (taskData) => {
    if (editingTask) {
      await handleUpdateTask(taskData)
    } else {
      await handleCreateTask(taskData)
    }
  }
const clearFilters = () => {
    setSearchQuery("")
    setStatusFilter("all")
    setPriorityFilter("all")
  }

  const handleTaskSelectionChange = (taskId) => {
    setSelectedTasks(prev => {
      const newSelection = prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
      
      setShowBulkActions(newSelection.length > 0)
      return newSelection
    })
  }

  const clearSelection = () => {
    setSelectedTasks([])
    setShowBulkActions(false)
    setBulkEditMode(null)
    setBulkDueDate("")
    setBulkPriority("")
  }

  const handleBulkComplete = async () => {
    if (selectedTasks.length === 0) return

    setIsBulkLoading(true)
    try {
      await taskService.bulkComplete(selectedTasks)
      await loadData()
      toast.success(`Marked ${selectedTasks.length} task${selectedTasks.length > 1 ? 's' : ''} as complete`)
      clearSelection()
    } catch (error) {
      toast.error("Failed to complete tasks")
      console.error("Bulk complete error:", error)
    } finally {
      setIsBulkLoading(false)
    }
  }

  const handleBulkEdit = (type) => {
    setBulkEditMode(type)
    if (type === 'dueDate') {
      setBulkDueDate("")
    } else if (type === 'priority') {
      setBulkPriority("")
    }
  }

  const saveBulkEdit = async () => {
    if (selectedTasks.length === 0) return

    setIsBulkLoading(true)
    try {
      const updateData = {}
      if (bulkEditMode === 'dueDate' && bulkDueDate) {
        updateData.dueDate = bulkDueDate
      } else if (bulkEditMode === 'priority' && bulkPriority) {
        updateData.priority = bulkPriority
      }

      if (Object.keys(updateData).length > 0) {
        await taskService.bulkUpdate(selectedTasks, updateData)
        await loadData()
        toast.success(`Updated ${selectedTasks.length} task${selectedTasks.length > 1 ? 's' : ''}`)
        clearSelection()
      }
    } catch (error) {
      toast.error("Failed to update tasks")
      console.error("Bulk edit error:", error)
    } finally {
      setIsBulkLoading(false)
    }
  }

  const cancelBulkEdit = () => {
    setBulkEditMode(null)
    setBulkDueDate("")
    setBulkPriority("")
  }
  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{listName}</h1>
              <p className="text-sm text-gray-600">
                {totalCount} {totalCount === 1 ? "task" : "tasks"} 
                {completedCount > 0 && `, ${completedCount} completed`}
              </p>
            </div>
            
            <Button onClick={() => setIsModalOpen(true)} className="shrink-0">
              <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>

          {/* Progress Indicator */}
          {totalCount > 0 && (
            <ProgressIndicator
              completed={completedCount}
              total={totalCount}
              label="Progress"
              className="mb-6"
            />
          )}

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <SearchBar
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="w-full sm:w-80"
            />
            
            <FilterBar
              statusFilter={statusFilter}
              priorityFilter={priorityFilter}
              onStatusChange={setStatusFilter}
              onPriorityChange={setPriorityFilter}
              onClearFilters={clearFilters}
              className="w-full sm:w-auto"
            />
          </div>
        </div>
      </div>

      {/* Tasks Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-6">
<TasksList
            tasks={filteredTasks}
            onToggleComplete={handleToggleComplete}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            className="pb-8"
            selectedTasks={selectedTasks}
            onTaskSelectionChange={handleTaskSelectionChange}
            showSelection={showBulkActions || selectedTasks.length > 0}
          />
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTask}
        task={editingTask}
lists={lists}
      />

      {/* Bulk Action Toolbar */}
      {showBulkActions && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 z-50 min-w-[320px] max-w-[90vw]">
          {!bulkEditMode ? (
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">{selectedTasks.length}</span>
                </div>
                <span className="text-sm text-gray-600">
                  {selectedTasks.length} task{selectedTasks.length > 1 ? 's' : ''} selected
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleBulkEdit('dueDate')}
                  disabled={isBulkLoading}
                  className="h-8"
                >
                  <ApperIcon name="Calendar" size={14} />
                  Due Date
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleBulkEdit('priority')}
                  disabled={isBulkLoading}
                  className="h-8"
                >
                  <ApperIcon name="Flag" size={14} />
                  Priority
                </Button>
                
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleBulkComplete}
                  disabled={isBulkLoading}
                  className="h-8"
                >
                  {isBulkLoading ? (
                    <ApperIcon name="Loader2" size={14} className="animate-spin" />
                  ) : (
                    <ApperIcon name="Check" size={14} />
                  )}
                  Complete
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSelection}
                  disabled={isBulkLoading}
                  className="h-8"
                >
                  <ApperIcon name="X" size={14} />
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">
                  Edit {bulkEditMode === 'dueDate' ? 'Due Date' : 'Priority'} for {selectedTasks.length} task{selectedTasks.length > 1 ? 's' : ''}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={cancelBulkEdit}
                  className="h-6 w-6 p-0"
                >
                  <ApperIcon name="X" size={12} />
                </Button>
              </div>
              
              {bulkEditMode === 'dueDate' && (
                <Input
                  type="date"
                  value={bulkDueDate}
                  onChange={(e) => setBulkDueDate(e.target.value)}
                  className="h-9"
                  placeholder="Select due date"
                />
              )}
              
              {bulkEditMode === 'priority' && (
                <Select
                  value={bulkPriority}
                  onChange={(e) => setBulkPriority(e.target.value)}
                  className="h-9"
                >
                  <option value="">Select priority</option>
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </Select>
              )}
              
              <div className="flex items-center justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={cancelBulkEdit}
                  disabled={isBulkLoading}
                  className="h-8"
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={saveBulkEdit}
                  disabled={isBulkLoading || (!bulkDueDate && !bulkPriority)}
                  className="h-8"
                >
                  {isBulkLoading ? (
                    <ApperIcon name="Loader2" size={14} className="animate-spin" />
                  ) : (
                    <ApperIcon name="Check" size={14} />
                  )}
                  Save
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
export default TasksPage