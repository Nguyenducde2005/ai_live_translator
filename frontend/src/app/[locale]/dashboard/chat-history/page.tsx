'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, MessageSquare, User, Hash } from 'lucide-react'
import Link from 'next/link'
import { apiClient } from '@/lib/api-client'
import { isAdmin } from '@/lib/constants/roles'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { TextWithLinks } from '@/components/ui/text-with-links'
import { useTranslation } from '@/i18n/hooks/useTranslation'

interface ChatHistory {
  id: string
  workspace_id: string
  channel_id: string
  channel_name: string
  user_id: string
  user_name: string
  message_id: string
  original_text: string
  translated_text?: string
  source_language?: string
  target_language?: string
  message_type?: string
  thread_ts?: string
  created_at: string
}

interface Workspace {
  id: string
  workspace_name: string
  team_id?: string
  status: string
  created_at: string
  updated_at: string
}

interface Channel {
  id: string
  name: string
  is_private: boolean
  is_channel: boolean
  is_group: boolean
  message_count?: number
}

export default function ChatHistoryPage() {
  const { user } = useAuth()
  const { t, locale } = useTranslation()
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([])
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [channels, setChannels] = useState<Channel[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Filter states
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>('')
  const [selectedChannel, setSelectedChannel] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()

  useEffect(() => {
    console.log('Component mounted, fetching workspaces...')
    fetchWorkspaces()
  }, [])

  useEffect(() => {
    if (selectedWorkspace) {
      console.log('Selected workspace changed, fetching channels...')
      fetchChannels(selectedWorkspace)
    }
  }, [selectedWorkspace])

  useEffect(() => {
    if (selectedWorkspace && selectedChannel && selectedChannel !== 'all') {
      console.log('Selected channel changed, fetching chat history...')
      fetchChatHistory()
    }
  }, [selectedWorkspace, selectedChannel, searchQuery, startDate, endDate])

  const fetchWorkspaces = async () => {
    try {
      console.log('Fetching workspaces...')
      console.log('User:', user)
      const data = await apiClient.get<Workspace[]>('/workspaces')
      console.log('Workspaces response:', data)
      setWorkspaces(data)
      if (data.length > 0) {
        console.log('Setting selected workspace:', data[0].id)
        setSelectedWorkspace(data[0].id)
        // Channels will be fetched automatically via useEffect
      }
    } catch (err: any) {
      console.error('Failed to fetch workspaces:', err)
      console.error('Error status:', err.response?.status)
      console.error('Error message:', err.message)
      setError(err.response?.data?.message || t('chatHistory.failedToFetchWorkspaces'))
    }
  }

  const fetchChatHistory = async () => {
    if (!selectedWorkspace) return

    try {
      setIsLoading(true)
      setError(null)

                   // Build query parameters
      const params = new URLSearchParams()
      if (selectedChannel && selectedChannel !== 'all') params.append('channel_id', selectedChannel)
      if (searchQuery) params.append('search', searchQuery)
      if (startDate) params.append('start_date', startDate.toISOString().split('T')[0])
      if (endDate) {
        // Set end date to end of day (23:59:59.999)
        const endOfDay = new Date(endDate)
        endOfDay.setHours(23, 59, 59, 999)
        params.append('end_date', endOfDay.toISOString())
      }
      params.append('limit', '50')
      params.append('offset', '0')

      const data = await apiClient.get<ChatHistory[]>(`/chat-history/workspace/${selectedWorkspace}?${params.toString()}`)
      setChatHistory(data)
    } catch (err: any) {
      setError(err.response?.data?.message || t('chatHistory.failedToFetchChatHistory'))
    } finally {
      setIsLoading(false)
    }
  }

  const fetchChannels = async (workspaceId: string) => {
    try {
      console.log('=== FETCHING CHANNELS ===')
      console.log('Workspace ID:', workspaceId)
      console.log('API URL:', `/workspaces/${workspaceId}/channels`)
      console.log('User token exists:', !!user)
      
      const channels = await apiClient.get<Channel[]>(`/workspaces/${workspaceId}/channels`)
      console.log('Channels response:', channels)
      console.log('Channels count:', channels.length)
      setChannels(channels)
      
      // Auto-select first channel if available
      if (channels.length > 0) {
        console.log('Auto-selecting first channel:', channels[0].id)
        setSelectedChannel(channels[0].id)
      }
    } catch (err: any) {
      console.error('=== CHANNELS FETCH ERROR ===')
      console.error('Failed to fetch channels:', err)
      console.error('Error details:', err.response?.data)
      console.error('Error status:', err.response?.status)
      console.error('Error message:', err.message)
      setChannels([])
    }
  }

  const handleWorkspaceChange = (workspaceId: string) => {
    console.log('Workspace changed to:', workspaceId)
    setSelectedWorkspace(workspaceId)
    setSelectedChannel('')
    setChannels([])
    if (workspaceId) {
      console.log('Calling fetchChannels for workspace:', workspaceId)
      fetchChannels(workspaceId)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getLanguageBadge = (lang?: string) => {
    if (!lang) return null
    
    const langMap: { [key: string]: { label: string; color: string } } = {
      'vi': { label: t('glossaries.vietnamese'), color: 'bg-green-100 text-green-800' },
      'ja': { label: t('glossaries.japanese'), color: 'bg-blue-100 text-blue-800' },
      'en': { label: t('glossaries.english'), color: 'bg-purple-100 text-purple-800' },
      'ko': { label: t('glossaries.korean'), color: 'bg-orange-100 text-orange-800' },
      'zh': { label: t('glossaries.chinese'), color: 'bg-red-100 text-red-800' }
    }

    const langInfo = langMap[lang] || { label: lang, color: 'bg-gray-100 text-gray-800' }
    
    return (
      <Badge className={langInfo.color}>
        {langInfo.label}
      </Badge>
    )
  }

  if (!user) {
    console.log('No user found, redirecting to login')
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">{t('chatHistory.pleaseLoginToView')}</p>
        </div>
      </div>
    )
  }

  console.log('User authenticated:', user)

    return (
    <div className="flex h-screen bg-gray-50">
             {/* Left Sidebar */}
       <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
                 {/* Header with Back button */}
         <div className="p-4 border-b border-gray-200">
           {/* Breadcrumb */}
           <Breadcrumb items={[{ label: t('navigation.chatHistory') }]} />
           
           <div className="mb-4">
             <h1 className="text-lg font-semibold text-gray-900">{t('chatHistory.title')}</h1>
           </div>
           
           {/* Slack App Dropdown */}
           <div className="mb-4">
             <label className="block text-xs font-medium text-gray-700 mb-1">
               {t('chatHistory.slackApp')}
             </label>
             <Select value={selectedWorkspace} onValueChange={handleWorkspaceChange}>
               <SelectTrigger className="h-8 text-sm bg-white border-gray-300 text-gray-900">
                 <SelectValue placeholder={t('chatHistory.selectSlackApp')} />
               </SelectTrigger>
               <SelectContent>
                 {workspaces.map((workspace) => (
                   <SelectItem key={workspace.id} value={workspace.id}>
                     {workspace.workspace_name}
                   </SelectItem>
                 ))}
               </SelectContent>
             </Select>
           </div>
         </div>

                 {/* Channels List */}
         <div className="flex-1 overflow-y-auto">
           <div className="p-4">
             <div className="flex items-center justify-between mb-3">
               <h2 className="text-sm font-semibold text-gray-700">{t('chatHistory.channels')}</h2>
               <span className="text-xs text-gray-500">{channels.length}</span>
             </div>
             
             <div className="space-y-1">
               {channels.map((channel) => (
                 <button
                   key={channel.id}
                   onClick={() => setSelectedChannel(channel.id)}
                   className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                     selectedChannel === channel.id
                       ? 'bg-blue-100 text-blue-700 font-medium'
                       : 'text-gray-700 hover:bg-gray-100'
                   }`}
                 >
                   <div className="flex items-center justify-between">
                     <span>#{channel.name}</span>
                     <span className="text-xs text-gray-500">{channel.message_count}</span>
                   </div>
                 </button>
               ))}
             </div>
           </div>
         </div>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Channel Header */}
        {selectedChannel && selectedChannel !== 'all' && (
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  #{channels.find(c => c.id === selectedChannel)?.name || 'Channel'}
                </h2>
                <p className="text-sm text-gray-500">
                  {chatHistory.length} messages
                </p>
              </div>
              
                             {/* Search and Date Filter */}
               <div className="flex items-center space-x-4">
                 <div className="relative">
                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                   <Input
                     placeholder={t('chatHistory.searchMessages')}
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="pl-10 w-64 h-9"
                   />
                 </div>
                 
                 <div className="flex items-center space-x-2">
                   <Input
                     type="date"
                     value={startDate ? startDate.toISOString().split('T')[0] : ''}
                     onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : undefined)}
                     className="w-36 h-9 text-sm"
                   />
                   <span className="text-gray-400">{t('chatHistory.to')}</span>
                   <Input
                     type="date"
                     value={endDate ? endDate.toISOString().split('T')[0] : ''}
                     onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : undefined)}
                     className="w-36 h-9 text-sm"
                   />
                 </div>
                 
                                   {/* Clear Filters Button */}
                  {(searchQuery || startDate || endDate) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchQuery('')
                        setStartDate(undefined)
                        setEndDate(undefined)
                      }}
                      className="h-9 px-3 text-sm text-red-600 border-red-300 hover:bg-red-600 hover:text-white hover:border-red-600"
                    >
                      {t('chatHistory.clearFilters')}
                    </Button>
                  )}
               </div>
            </div>
          </div>
        )}

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {!selectedChannel || selectedChannel === 'all' ? (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t('chatHistory.selectChannel')}</h3>
              <p className="text-gray-600">{t('chatHistory.chooseChannelFromSidebar')}</p>
            </div>
          ) : isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">{t('chatHistory.loadingMessages')}</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          ) : chatHistory.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t('chatHistory.noMessagesFound')}</h3>
              <p className="text-gray-600">{t('chatHistory.noMessagesMatchFilters')}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {chatHistory.map((chat) => (
                <div key={chat.id} className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-gray-900">{chat.user_name}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-500">{formatDate(chat.created_at)}</span>
                        <div className="flex items-center space-x-2 ml-auto">
                          {chat.source_language && getLanguageBadge(chat.source_language)}
                          {chat.target_language && getLanguageBadge(chat.target_language)}
                        </div>
                      </div>

                      <div className="space-y-3">
                        {/* Original Message */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-1">{t('chatHistory.original')}</h4>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <TextWithLinks 
                              text={chat.original_text} 
                              className="text-gray-900 whitespace-pre-wrap break-words"
                            />
                          </div>
                        </div>

                        {/* Translated Message */}
                        {chat.translated_text && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-1">{t('chatHistory.translation')}</h4>
                            <div className="bg-blue-50 p-3 rounded-lg">
                              <TextWithLinks 
                                text={chat.translated_text} 
                                className="text-blue-900 whitespace-pre-wrap break-words"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Message Metadata */}
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>{t('chatHistory.id')}: {chat.message_id}</span>
                          {chat.thread_ts && <span>{t('chatHistory.thread')}: {chat.thread_ts}</span>}
                          {chat.message_type && <span>{t('chatHistory.type')}: {chat.message_type}</span>}
                        </div>
                      </div>
                    </div>
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