'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Plus, Settings, Trash2, Play, Pause, Edit, Power } from 'lucide-react'
import Link from 'next/link'
import { apiClient } from '@/lib/api-client'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { DashboardHeader } from '@/components/ui/dashboard-header'
import { DeleteWorkspaceDialog } from '@/components/ui/delete-workspace-dialog'
import { Switch } from '@/components/ui/switch'

interface SlackApp {
  id: string
  workspace_name: string
  team_id?: string
  status: string
  created_at: string
  updated_at: string
}

export default function SlackAppsPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [slackApps, setSlackApps] = useState<SlackApp[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [workspaceToDelete, setWorkspaceToDelete] = useState<SlackApp | null>(null)
  const [workspaceStats, setWorkspaceStats] = useState<any>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchSlackApps()
  }, [])

  const fetchSlackApps = async () => {
    try {
      setIsLoading(true)
      const data = await apiClient.get<SlackApp[]>('/workspaces')
      setSlackApps(data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch Slack apps')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusToggle = async (slackAppId: string, currentStatus: string) => {
    try {
      const endpoint = currentStatus === 'active' ? 'deactivate' : 'activate'
      await apiClient.patch(`/workspaces/${slackAppId}/${endpoint}`)
      fetchSlackApps() // Refresh list
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update Slack app status')
    }
  }

  const handleDeleteClick = async (slackApp: SlackApp) => {
    try {
      // Lấy thống kê workspace
      const stats = await apiClient.get(`/workspaces/${slackApp.id}/stats`)
      setWorkspaceStats(stats)
      setWorkspaceToDelete(slackApp)
      setDeleteDialogOpen(true)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to get workspace stats')
    }
  }

  const handleDeleteConfirm = async () => {
    if (!workspaceToDelete) return
    
    try {
      setIsDeleting(true)
      await apiClient.delete(`/workspaces/${workspaceToDelete.id}`)
      setDeleteDialogOpen(false)
      setWorkspaceToDelete(null)
      setWorkspaceStats(null)
      fetchSlackApps() // Refresh list
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete Slack app')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    setWorkspaceToDelete(null)
    setWorkspaceStats(null)
  }

  const canCreateSlackApp = user?.role === 'admin' || slackApps.length < 3

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader showDashboardButton={true} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Breadcrumb items={[{ label: 'Slack Apps' }]} />
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Slack Apps</h1>
              <p className="text-gray-600">Manage your Slack apps and configurations</p>
            </div>
            {canCreateSlackApp ? (
                             <Link href="/dashboard/workspaces/create">
                 <Button className="bg-purple-700 hover:bg-purple-800 text-white flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                                       <span>Connect Slack App</span>
                </Button>
              </Link>
            ) : (
              <div className="text-sm text-gray-500">
                                 You can only connect up to 3 Slack apps
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading Slack apps...</p>
            </div>
          ) : slackApps.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-gray-400" />
              </div>
                             <h3 className="text-lg font-medium text-gray-900 mb-2">No Slack apps yet</h3>
               <p className="text-gray-600 mb-4">Connect your first Slack app to get started</p>
              {canCreateSlackApp && (
                <Link href="/dashboard/workspaces/create">
                  <Button className="bg-purple-700 hover:bg-purple-800 text-white flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Connect Slack App</span>
                  </Button>
                </Link>
              )}
            </div>
          ) : (
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {slackApps.map((slackApp) => (
                 <div key={slackApp.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200 relative group cursor-pointer hover:shadow-md transition-shadow">
                   {/* Switch ở góc trên bên phải */}
                   <div className="absolute top-4 right-4">
                     <Switch
                       checked={slackApp.status === 'active'}
                       onCheckedChange={() => handleStatusToggle(slackApp.id, slackApp.status)}
                       className="data-[state=checked]:bg-green-600"
                     />
                   </div>
                   
                   {/* Delete button ở góc dưới bên phải */}
                   <div className="absolute bottom-4 right-4">
                     <Button
                       size="sm"
                       variant="ghost"
                       onClick={(e) => {
                         e.stopPropagation()
                         handleDeleteClick(slackApp)
                       }}
                       className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                     >
                       <Trash2 className="w-4 h-4" />
                     </Button>
                   </div>
                   
                   {/* Card content - clickable để edit */}
                   <Link href={`/dashboard/workspaces/${slackApp.id}/edit`} className="block">
                     <div className="flex items-start justify-between mb-4">
                       <div className="flex-1">
                         <h3 className="text-lg font-semibold text-gray-900 mb-1">
                           {slackApp.workspace_name}
                         </h3>
                         <p className="text-sm text-gray-600">
                           Team ID: {slackApp.team_id || 'N/A'}
                         </p>
                       </div>
                     </div>
                     
                     <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                       <span>Created: {new Date(slackApp.created_at).toLocaleDateString()}</span>
                     </div>
                     
                     <div className="flex items-center space-x-2">
                       <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                         slackApp.status === 'active' 
                           ? 'bg-green-100 text-green-800' 
                           : 'bg-gray-100 text-gray-800'
                       }`}>
                         {slackApp.status}
                       </span>
                     </div>
                   </Link>
                 </div>
               ))}
             </div>
          )}
        </div>
      </div>

      {/* Delete Workspace Dialog */}
      <DeleteWorkspaceDialog
        isOpen={deleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        workspaceName={workspaceToDelete?.workspace_name || ''}
        isLoading={isDeleting}
        stats={workspaceStats}
      />
    </div>
  )
} 