import listsData from "@/services/mockData/lists.json"
import tasksData from "@/services/mockData/tasks.json"

// Simulate network delay
const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))

class ListService {
  constructor() {
    this.lists = [...listsData]
    this.tasks = [...tasksData]
  }

  async getAll() {
    await delay()
    
    // Calculate task counts for each list
    return this.lists.map(list => {
      const taskCount = this.tasks.filter(task => 
        task.listId === list.Id.toString() && task.status === "pending"
      ).length
      
      return {
        ...list,
        taskCount
      }
    })
  }

  async getById(id) {
    await delay()
    const list = this.lists.find(l => l.Id === parseInt(id))
    if (!list) throw new Error("List not found")
    
    const taskCount = this.tasks.filter(task => 
      task.listId === id.toString() && task.status === "pending"
    ).length
    
    return { ...list, taskCount }
  }

  async create(listData) {
    await delay()
    
    const maxId = Math.max(...this.lists.map(l => l.Id), 0)
    const newList = {
      Id: maxId + 1,
      name: listData.name,
      color: listData.color,
      icon: listData.icon,
      order: this.lists.length,
      taskCount: 0
    }

    this.lists.push(newList)
    return { ...newList }
  }

  async update(id, data) {
    await delay()
    
    const index = this.lists.findIndex(l => l.Id === parseInt(id))
    if (index === -1) throw new Error("List not found")

    const updatedList = {
      ...this.lists[index],
      ...data,
      Id: parseInt(id)
    }

    this.lists[index] = updatedList
    
    const taskCount = this.tasks.filter(task => 
      task.listId === id.toString() && task.status === "pending"
    ).length
    
    return { ...updatedList, taskCount }
  }

  async delete(id) {
    await delay()
    
    const index = this.lists.findIndex(l => l.Id === parseInt(id))
    if (index === -1) throw new Error("List not found")

    this.lists.splice(index, 1)
    return true
  }
}

export const listService = new ListService()