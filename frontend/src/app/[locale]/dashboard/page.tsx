'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { User, BookOpen, Building2, Activity, Users, Shield, MessageSquare, Settings, Plus, Video } from 'lucide-react'
import Link from 'next/link'
import { apiClient } from '@/lib/api-client'
import { isAdmin } from '@/lib/constants/roles'
import { DashboardHeader } from '@/components/ui/dashboard-header'
import { useTranslation } from '@/i18n/hooks/useTranslation'

interface Workspace {
  id: string
  workspace_name: string
  status: string
  user_id?: string
}

interface Glossary {
  id: string
  name: string
  terms: GlossaryTerm[]
  user_id?: string
}

interface GlossaryTerm {
  id: string
  source_term: string
  target_term: string
  glossary_id: string
}

interface User {
  id: string
  name: string
  email: string
  role: string
}

export default function DashboardPage() {
  const { user, logout, isLoading } = useAuth()
  const { t, locale } = useTranslation()
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [glossaries, setGlossaries] = useState<Glossary[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [totalTerms, setTotalTerms] = useState(0)
  const [isLoadingData, setIsLoadingData] = useState(true)

  useEffect(() => {
    // Only fetch data when user is loaded and not loading
    if (!isLoading && user) {
      fetchData()
    }
  }, [isLoading, user])

  const fetchData = async () => {
    try {
      setIsLoadingData(true)
      
      let glossariesData: Glossary[] = []
      
      if (user?.role && isAdmin(user.role)) {
        // Admin can see all data
        try {
          const [workspacesData, adminGlossariesData, usersData] = await Promise.all([
            apiClient.get<Workspace[]>('/workspaces'),
            apiClient.get<Glossary[]>('/glossaries'),
            apiClient.get<User[]>('/users')
          ])
          
          setWorkspaces(workspacesData)
          setGlossaries(adminGlossariesData)
          setUsers(usersData) // Show all users
          glossariesData = adminGlossariesData
        } catch (error: any) {
          console.error('Error fetching admin data:', error)
          console.error('Error details:', error.response?.data)
        }
      } else {
        // Regular user can only see their own data
        const [workspacesData, userGlossariesData] = await Promise.all([
          apiClient.get<Workspace[]>('/workspaces'),
          apiClient.get<Glossary[]>('/glossaries')
        ])
        setWorkspaces(workspacesData)
        setGlossaries(userGlossariesData)
        glossariesData = userGlossariesData
      }
      
      // Calculate total terms from the fetched data
      const total = glossariesData.reduce((sum: number, glossary: Glossary) => sum + (glossary.terms?.length || 0), 0)
      setTotalTerms(total)
    } catch (err: any) {
      console.error('Failed to fetch dashboard data:', err)
      console.error('Error response:', err.response?.data)
    } finally {
      setIsLoadingData(false)
    }
  }

  if (isLoading) {
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
      <DashboardHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('header.welcomeBack', { name: user?.name || 'User' })}
          </h1>
          <p className="text-gray-600">{t('dashboard.overview')}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {user?.role && isAdmin(user.role) ? t('dashboard.totalWorkspaces') : t('navigation.workspaces')}
                </p>
                <p className="text-2xl font-bold text-gray-900">{isLoadingData ? '...' : workspaces.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {user?.role && isAdmin(user.role) ? t('dashboard.totalGlossaries') : t('navigation.glossaries')}
                </p>
                <p className="text-2xl font-bold text-gray-900">{isLoadingData ? '...' : glossaries.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-amber-100 p-3 rounded-lg">
                <BookOpen className="w-6 h-6 text-amber-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{t('glossaries.terms')}</p>
                <p className="text-2xl font-bold text-gray-900">{isLoadingData ? '...' : totalTerms}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full">
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 p-3 rounded-full">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">{user?.name}</h3>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Link href={`/${locale}/dashboard/slack-app`}>
                  <div className="flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors">
                    <Building2 className="w-5 h-5 text-blue-600 mr-3" />
                    <span className="text-gray-700">{t('navigation.workspaces')}</span>
                  </div>
                </Link>
                
                <Link href={`/${locale}/dashboard/glossaries`}>
                  <div className="flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors">
                    <BookOpen className="w-5 h-5 text-purple-600 mr-3" />
                    <span className="text-gray-700">{t('navigation.glossaries')}</span>
                  </div>
                </Link>
                
                <Link href={`/${locale}/dashboard/chat-history`}>
                  <div className="flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors">
                    <MessageSquare className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-gray-700">{t('navigation.chatHistory')}</span>
                  </div>
                </Link>
                
                <Link href={`/${locale}/dashboard/conferences`}>
                  <div className="flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors">
                    <Video className="w-5 h-5 text-red-600 mr-3" />
                    <span className="text-gray-700">Conferences</span>
                  </div>
                </Link>
                
                <Link href={`/${locale}/dashboard/settings`}>
                  <div className="flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors">
                    <Settings className="w-5 h-5 text-gray-600 mr-3" />
                    <span className="text-gray-700">{t('navigation.settings')}</span>
                  </div>
                </Link>

                {user?.role && isAdmin(user.role) && (
                  <Link href={`/${locale}/dashboard/users`}>
                    <div className="flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors">
                      <Users className="w-5 h-5 text-green-600 mr-3" />
                      <span className="text-gray-700">{t('navigation.users')}</span>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">{t('dashboard.quickActions')}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link href={`/${locale}/dashboard/slack-app/create`}>
                  <div className="p-6 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer h-full">
                    <div className="flex items-start">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <Plus className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="ml-4 flex-1">
                        <h4 className="font-semibold text-gray-900 text-lg mb-2">{t('workspaces.connectSlackApp')}</h4>
                        <p className="text-sm text-gray-600 mb-3">{t('workspaces.manageSlackApps')}</p>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          {t('workspaces.connectFirstSlackApp')}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>

                <Link href={`/${locale}/dashboard/glossaries/create`}>
                  <div className="p-6 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors cursor-pointer h-full">
                    <div className="flex items-start">
                      <div className="bg-purple-100 p-3 rounded-lg">
                        <Plus className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="ml-4 flex-1">
                        <h4 className="font-semibold text-gray-900 text-lg mb-2">{t('glossaries.createGlossary')}</h4>
                        <p className="text-sm text-gray-600 mb-3">{t('glossaries.glossaryDetails')}</p>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          {t('glossaries.glossaryDetails')}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>

                <Link href={`/${locale}/dashboard/conferences`}>
                  <div className="p-6 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors cursor-pointer h-full">
                    <div className="flex items-start">
                      <div className="bg-red-100 p-3 rounded-lg">
                        <Video className="w-6 h-6 text-red-600" />
                      </div>
                      <div className="ml-4 flex-1">
                        <h4 className="font-semibold text-gray-900 text-lg mb-2">Create Conference</h4>
                        <p className="text-sm text-gray-600 mb-3">Start a new live voice translation conference</p>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          Create conference rooms with real-time translation support
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>

                {user?.role && isAdmin(user.role) && (
                  <Link href={`/${locale}/dashboard/users/create`}>
                    <div className="p-6 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors cursor-pointer h-full">
                      <div className="flex items-start">
                        <div className="bg-green-100 p-3 rounded-lg">
                          <Plus className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4 flex-1">
                          <h4 className="font-semibold text-gray-900 text-lg mb-2">{t('users.createUser')}</h4>
                          <p className="text-sm text-gray-600 mb-3">{t('users.userDetails')}</p>
                          <p className="text-xs text-gray-500 leading-relaxed">
                            {t('users.userPermissions')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 