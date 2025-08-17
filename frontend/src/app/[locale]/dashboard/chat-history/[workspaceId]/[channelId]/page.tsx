'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, ArrowLeft, Hash, User, Calendar, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { apiClient } from '@/lib/api-client'
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

export default function ChannelChatHistoryPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { t, locale } = useTranslation()
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([])
  const [workspace, setWorkspace] = useState<Workspace | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')

  const workspaceId = params.workspaceId as string
  const channelId = params.channelId as string

  useEffect(() => {
    if (workspaceId && channelId) {
      fetchData()
    }
  }, [workspaceId, channelId, searchQuery])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Fetch workspace info
      const workspaceData = await apiClient.get<Workspace>(`/workspaces/${workspaceId}`)
      setWorkspace(workspaceData)

      // Fetch chat history for specific channel
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      params.append('limit', '100')
      params.append('offset', '0')

      const historyData = await apiClient.get<ChatHistory[]>(
        `/chat-history/workspace/${workspaceId}/channel/${channelId}?${params.toString()}`
      )
      setChatHistory(historyData)
    } catch (err: any) {
      setError(err.response?.data?.message || t('chatHistory.failedToFetchChatHistory'))
    } finally {
      setIsLoading(false)
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
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">{t('chatHistory.pleaseLoginToView')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href={`/${locale}/dashboard/chat-history`}>
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t('chatHistory.backToChatHistory')}
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{t('chatHistory.channelHistory')}</h1>
                <p className="text-gray-600">
                  {workspace && (
                    <>
                      {workspace.workspace_name} • #{channelId}
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              {t('chatHistory.searchMessages')}
            </CardTitle>
            <CardDescription>
              {t('chatHistory.searchWithinChannelHistory')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder={t('chatHistory.searchInOriginalOrTranslated')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{t('chatHistory.totalMessages')}</p>
                  <p className="text-2xl font-bold text-gray-900">{chatHistory.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-lg">
                  <User className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{t('chatHistory.uniqueUsers')}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Set(chatHistory.map(chat => chat.user_id)).size}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Hash className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{t('chatHistory.channel')}</p>
                  <p className="text-2xl font-bold text-gray-900">#{channelId}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat History List */}
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">{t('chatHistory.loadingChatHistory')}</p>
          </div>
        ) : chatHistory.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t('chatHistory.noMessagesFound')}</h3>
              <p className="text-gray-600">
                {searchQuery 
                  ? t('chatHistory.noMessagesMatchSearchCriteria')
                  : t('chatHistory.noMessagesTranslatedInChannel')
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {chatHistory.map((chat) => (
              <Card key={chat.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{chat.user_name}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(chat.created_at)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {chat.source_language && getLanguageBadge(chat.source_language)}
                      {chat.target_language && getLanguageBadge(chat.target_language)}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* Original Message */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">{t('chatHistory.originalMessage')}</h4>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <TextWithLinks 
                          text={chat.original_text} 
                          className="text-gray-900"
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
                            className="text-blue-900"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Message Metadata */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span>{t('chatHistory.messageId')}: {chat.message_id}</span>
                        {chat.thread_ts && <span>{t('chatHistory.thread')}: {chat.thread_ts}</span>}
                        {chat.message_type && <span>{t('chatHistory.type')}: {chat.message_type}</span>}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 