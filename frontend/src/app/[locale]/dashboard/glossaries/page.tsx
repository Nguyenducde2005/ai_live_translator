'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Plus, BookOpen, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { apiClient } from '@/lib/api-client'
import { Switch } from '@/components/ui/switch'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { DashboardHeader } from '@/components/ui/dashboard-header'
import { useTranslation } from '@/i18n/hooks/useTranslation'

interface Glossary {
  id: string
  description: string
  is_active: boolean
  created_at: string
  updated_at: string
  terms_count?: number
  workspace?: {
    id: string
    workspace_name: string
  }
}

interface Workspace {
  id: string
  workspace_name: string
  team_id?: string
  status: string
  created_at: string
  updated_at: string
}

export default function GlossariesPage() {
  const { user, isLoading: authLoading } = useAuth()
  const { t, locale } = useTranslation()
  const [glossaries, setGlossaries] = useState<Glossary[]>([])
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [glossariesData, workspacesData] = await Promise.all([
        apiClient.get<Glossary[]>('/glossaries'),
        apiClient.get<Workspace[]>('/workspaces')
      ])
      setGlossaries(glossariesData)
      setWorkspaces(workspacesData)
    } catch (err: any) {
      setError(err.response?.data?.message || t('glossaries.failedToFetchData'))
    } finally {
      setIsLoading(false)
    }
  }

  const fetchGlossaries = async () => {
    try {
      setIsLoading(true)
      const data = await apiClient.get<Glossary[]>('/glossaries')
      setGlossaries(data)
    } catch (err: any) {
      setError(err.response?.data?.message || t('glossaries.failedToFetchGlossaries'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleActive = async (glossaryId: string, isActive: boolean) => {
    try {
      await apiClient.patch(`/glossaries/${glossaryId}`, { is_active: isActive })
      fetchData() // Refresh list
    } catch (err: any) {
      setError(err.response?.data?.message || t('glossaries.failedToUpdateGlossaryStatus'))
    }
  }

  const hasWorkspace = workspaces.length > 0
  const canCreateGlossary = hasWorkspace

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader showDashboardButton={true} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Breadcrumb items={[{ label: t('navigation.glossaries') }]} />
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('glossaries.title')}</h1>
              <p className="text-gray-600">{t('glossaries.manageGlossaries')}</p>
            </div>
            {!hasWorkspace ? (
              <div className="text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{t('glossaries.createWorkspaceFirst')}</span>
                </div>
              </div>
            ) : canCreateGlossary ? (
              <Link href={`/${locale}/dashboard/glossaries/create`}>
                <Button className="flex items-center space-x-2 bg-black hover:bg-gray-800 text-white">
                  <Plus className="w-4 h-4" />
                  <span>{t('glossaries.createGlossary')}</span>
                </Button>
              </Link>
            ) : null}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">{t('glossaries.loadingGlossaries')}</p>
            </div>
          ) : glossaries.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t('glossaries.noGlossariesYet')}</h3>
              <p className="text-gray-600 mb-4">
                {!hasWorkspace 
                  ? t('glossaries.createWorkspaceFirst')
                  : t('glossaries.createFirstGlossary')
                }
              </p>
              {!hasWorkspace && (
                <Link href={`/${locale}/dashboard/slack-app/create`}>
                  <Button className="flex items-center space-x-2 bg-black hover:bg-gray-800 text-white">
                    <Plus className="w-4 h-4" />
                    <span>{t('workspaces.connectSlackApp')}</span>
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {glossaries.map((glossary) => (
                <div 
                  key={glossary.id} 
                  className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => window.location.href = `/${locale}/dashboard/glossaries/${glossary.id}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {glossary.description}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {glossary.workspace?.workspace_name || t('glossaries.unknownWorkspace')}
                      </p>
                      <p className="text-sm text-gray-600">
                        {t('glossaries.glossaryDescription')}
                      </p>
                    </div>
                    <Switch
                      checked={glossary.is_active}
                      onCheckedChange={(checked) => {
                        event?.stopPropagation()
                        handleToggleActive(glossary.id, checked)
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="data-[state=checked]:bg-green-600"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 