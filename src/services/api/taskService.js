import tasksData from "@/services/mockData/tasks.json"

// Simulate network delay
const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))

class TaskService {
  constructor() {
    this.tasks = [...tasksData]
  }

  async getAll() {
    await delay()
    return [...this.tasks]
  }

  async getById(id) {
    await delay()
    const task = this.tasks.find(t => t.Id === parseInt(id))
    if (!task) throw new Error("Task not found")
    return { ...task }
  }

  async create(taskData) {
    await delay()
    
    const maxId = Math.max(...this.tasks.map(t => t.Id), 0)
    const newTask = {
      Id: maxId + 1,
      title: taskData.title,
      description: taskData.description || "",
      priority: taskData.priority,
      status: "pending",
      dueDate: taskData.dueDate,
      listId: taskData.listId,
      createdAt: new Date(),
      completedAt: null,
      order: this.tasks.length
    }

    this.tasks.unshift(newTask)
    return { ...newTask }
  }

  async update(id, data) {
    await delay()
    
    const index = this.tasks.findIndex(t => t.Id === parseInt(id))
    if (index === -1) throw new Error("Task not found")

    const updatedTask = {
      ...this.tasks[index],
      ...data,
      Id: parseInt(id)
    }

    this.tasks[index] = updatedTask
    return { ...updatedTask }
  }

  async delete(id) {
    await delay()
    
    const index = this.tasks.findIndex(t => t.Id === parseInt(id))
    if (index === -1) throw new Error("Task not found")

    this.tasks.splice(index, 1)
    return true
}

  async getByListId(listId) {
    await delay()
    return this.tasks.filter(t => t.listId === listId.toString()).map(t => ({ ...t }))
  }

  async bulkUpdate(taskIds, updateData) {
    await delay()
    
    if (!Array.isArray(taskIds) || taskIds.length === 0) {
      throw new Error('Task IDs must be a non-empty array')
    }

    const updatedTasks = []
    for (const taskId of taskIds) {
      const taskIndex = this.tasks.findIndex(t => t.Id === parseInt(taskId))
      if (taskIndex !== -1) {
        this.tasks[taskIndex] = {
          ...this.tasks[taskIndex],
          ...updateData,
          updatedAt: new Date().toISOString()
        }
        updatedTasks.push({ ...this.tasks[taskIndex] })
      }
    }

    return updatedTasks
  }

  async bulkComplete(taskIds) {
    await delay()
    
    if (!Array.isArray(taskIds) || taskIds.length === 0) {
      throw new Error('Task IDs must be a non-empty array')
    }

    const completedTasks = []
    for (const taskId of taskIds) {
      const taskIndex = this.tasks.findIndex(t => t.Id === parseInt(taskId))
      if (taskIndex !== -1) {
        this.tasks[taskIndex] = {
          ...this.tasks[taskIndex],
          status: 'completed',
          updatedAt: new Date().toISOString()
        }
        completedTasks.push({ ...this.tasks[taskIndex] })
      }
    }

    return completedTasks
  }
}

export const taskService = new TaskService()