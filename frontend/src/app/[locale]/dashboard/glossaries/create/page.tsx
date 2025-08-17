'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Save, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api-client'
import { DashboardHeader } from '@/components/ui/dashboard-header'
import { useTranslation } from '@/i18n/hooks/useTranslation'

interface CreateGlossaryForm {
  description: string
  workspace_id: string
}

interface Workspace {
  id: string
  workspace_name: string
  team_id?: string
  status: string
  created_at: string
  updated_at: string
}

interface Glossary {
  id: string
  workspace_id: string
  description: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function CreateGlossaryPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { t, locale } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [glossaries, setGlossaries] = useState<Glossary[]>([])
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>('')
  const [formData, setFormData] = useState<CreateGlossaryForm>({
    description: '',
    workspace_id: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const availableWorkspaces = await apiClient.get<Workspace[]>('/glossaries/workspaces/available')
      
      setWorkspaces(availableWorkspaces)
      
      if (availableWorkspaces.length > 0) {
        setSelectedWorkspaceId(availableWorkspaces[0].id)
        setFormData(prev => ({ ...prev, workspace_id: availableWorkspaces[0].id }))
      }
    } catch (err: any) {
      setError(err.response?.data?.message || t('glossaries.failedToFetchAvailableWorkspaces'))
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleWorkspaceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const workspaceId = e.target.value
    setSelectedWorkspaceId(workspaceId)
    setFormData(prev => ({ ...prev, workspace_id: workspaceId }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      await apiClient.post('/glossaries', formData)
      router.push(`/${locale}/dashboard/glossaries`)
    } catch (err: any) {
      setError(err.response?.data?.message || t('glossaries.failedToCreateGlossary'))
    } finally {
      setIsLoading(false)
    }
  }

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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <Link href={`/${locale}/dashboard/glossaries`} className="mr-4">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('glossaries.backToGlossaries')}
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('glossaries.createGlossary')}</h1>
              <p className="text-gray-600">{t('glossaries.addNewGlossary')}</p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {workspaces.length === 0 ? (
              <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{t('glossaries.createSlackAppFirst')}</span>
                </div>
                <div className="mt-3">
                  <Link href={`/${locale}/dashboard/slack-app/create`}>
                    <Button variant="outline" size="sm" className="text-amber-700 border-amber-300 hover:bg-amber-100">
                      {t('workspaces.connectSlackApp')}
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <label htmlFor="workspace_id" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('navigation.workspaces')} *
                  </label>
                  <select
                    id="workspace_id"
                    name="workspace_id"
                    value={selectedWorkspaceId}
                    onChange={handleWorkspaceChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">{t('glossaries.selectSlackApp')}</option>
                    {workspaces.map((workspace) => (
                        <option key={workspace.id} value={workspace.id}>
                          {workspace.workspace_name}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('glossaries.glossaryName')} *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t('glossaries.enterGlossaryName')}
                  />
                </div>

                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                  <Link href={`/${locale}/dashboard/glossaries`}>
                    <Button variant="outline" type="button">
                      {t('common.cancel')}
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isLoading ? t('glossaries.creating') : t('glossaries.createGlossary')}</span>
                  </Button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  )
} 