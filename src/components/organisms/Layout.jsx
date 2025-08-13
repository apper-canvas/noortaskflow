import React, { useState, useEffect } from "react"
import { Outlet } from "react-router-dom"
import ListsSidebar from "@/components/organisms/ListsSidebar"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import { listService } from "@/services/api/listService"
import ApperIcon from "@/components/ApperIcon"

const Layout = () => {
  const [lists, setLists] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    loadLists()
  }, [])

  const loadLists = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await listService.getAll()
      setLists(data)
    } catch (err) {
      setError("Failed to load lists. Please try again.")
      console.error("Error loading lists:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error message={error} onRetry={loadLists} />
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <ListsSidebar lists={lists} />
      </div>

      {/* Mobile Sidebar Overlay */}
      <div className={`
        lg:hidden fixed inset-0 z-50 transition-transform duration-300 ease-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        <div className="relative h-full transform transition-transform duration-300 ease-out">
          <ListsSidebar lists={lists} className="h-full shadow-2xl" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ApperIcon name="Menu" className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="CheckSquare" className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                TaskFlow
              </h1>
            </div>
            <div className="w-9" /> {/* Spacer for centering */}
          </div>
        </div>

        {/* Content Area */}
        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout