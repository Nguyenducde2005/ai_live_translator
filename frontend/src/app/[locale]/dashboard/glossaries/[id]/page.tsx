'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Trash2, Upload, Download, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { apiClient } from '@/lib/api-client'
import { AddTermDialog } from '@/components/AddTermDialog'
import { DashboardHeader } from '@/components/ui/dashboard-header'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { useTranslation } from '@/i18n/hooks/useTranslation'

interface GlossaryTerm {
  id: string
  source: string
  translation: string
  target_lang: string
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
  description: string
  workspace_id: string
  workspace: Workspace
  terms: GlossaryTerm[]
}

export default function GlossaryDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { t, locale } = useTranslation()
  const [glossary, setGlossary] = useState<Glossary | null>(null)
  const [originalGlossary, setOriginalGlossary] = useState<Glossary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)

  const showNotification = (message: string, type: 'success' | 'error' | 'warning' = 'warning') => {
    // Create notification element
    const notification = document.createElement('div')
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transform transition-all duration-300 translate-x-full ${
      type === 'error' ? 'bg-red-500 text-white' :
      type === 'success' ? 'bg-green-500 text-white' :
      type === 'warning' ? 'bg-yellow-500 text-white' :
      'bg-blue-500 text-white'
    }`
    notification.innerHTML = `
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <span class="font-medium">${message}</span>
        </div>
        <button class="ml-4 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    `
    
    document.body.appendChild(notification)
    
    // Animate in
    setTimeout(() => {
      notification.classList.remove('translate-x-full')
    }, 100)
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.classList.add('translate-x-full')
        setTimeout(() => {
          if (notification.parentElement) {
            notification.remove()
          }
        }, 300)
      }
    }, 5000)
  }

  useEffect(() => {
    fetchGlossary()
  }, [params.id])

  const fetchGlossary = async () => {
    try {
      setIsLoading(true)
      const data = await apiClient.get<Glossary>(`/glossaries/${params.id}`)
      setGlossary(data)
      setOriginalGlossary(data) // Store original data for rollback
    } catch (error) {
      console.error('Failed to fetch glossary:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteGlossary = async () => {
    if (!glossary) return
    
    // Show confirmation dialog
    const confirmed = window.confirm(
      t('glossaries.deleteGlossaryConfirm', {
        name: glossary.description,
        count: glossary.terms.length
      })
    )
    
    if (!confirmed) return
    
    try {
      await apiClient.delete(`/glossaries/${glossary.id}`)
      showNotification(t('glossaries.glossaryDeletedSuccessfully'), 'success')
      router.push(`/${locale}/dashboard/glossaries`)
    } catch (error) {
      console.error('Failed to delete glossary:', error)
      showNotification(t('glossaries.errorDeletingGlossary'), 'error')
    }
  }

  const handleImport = () => {
    // Create a file input element
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = '.csv'
    fileInput.style.display = 'none'
    
    fileInput.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0]
      if (!file) return
      
      try {
        const text = await file.text()
        const lines = text.split('\n')
        
        // Validate header format
        const headerLine = lines[0]?.trim()
        if (!headerLine || headerLine !== 'source,target,tgt_lng') {
          showNotification('Invalid file format. Please use the correct CSV template.', 'error')
          return
        }
        
        // Skip header line and empty lines, then validate data format
        const dataLines = lines.slice(1).filter(line => line.trim() !== '')
        
        const validTerms: Array<{
          source_term: string
          target_term: string
          target_lang: string
        }> = []
        
        dataLines.forEach((line) => {
          // Parse CSV line, handling quoted values
          const values = line.match(/(".*?"|[^,]+)/g) || []
          
          // Check if line has exactly 3 columns
          if (values.length !== 3) {
            return // Skip invalid lines silently
          }
          
          const source = values[0]?.replace(/^"|"$/g, '').replace(/""/g, '"') || ''
          const target = values[1]?.replace(/^"|"$/g, '').replace(/""/g, '"') || ''
          const tgtLng = values[2]?.replace(/^"|"$/g, '').replace(/""/g, '"') || ''
          
          // Validate source term is not empty
          if (source.trim() === '') {
            return // Skip empty source terms silently
          }
          
          // Convert target_lang to lowercase and validate
          const normalizedTgtLng = tgtLng.toLowerCase()
          if (!['vi', 'auto', 'ja'].includes(normalizedTgtLng)) {
            return // Skip invalid target_lang silently
          }
          
          validTerms.push({
            source_term: source.trim(),
            target_term: target.trim(),
            target_lang: normalizedTgtLng
          })
        })
        
        if (validTerms.length === 0) {
          showNotification('No valid terms found to import.', 'error')
          return
        }
        
        // Import new terms first
        try {
          await apiClient.post(`/glossaries/${params.id}/terms/bulk`, validTerms)
        } catch (error) {
          console.error('Failed to import new terms:', error)
          showNotification('Failed to import new terms.', 'error')
          return
        }
        
        // Only delete existing terms after successful import
        if (glossary && glossary.terms.length > 0) {
          try {
            // Delete all existing terms one by one
            await Promise.all(
              glossary.terms.map(term => 
                apiClient.delete(`/glossaries/terms/${term.id}`)
              )
            )
          } catch (error) {
            console.error('Failed to delete existing terms:', error)
            showNotification('Failed to clear existing terms.', 'error')
            // Note: New terms are already imported, so we don't return here
          }
        }
        
        // Refresh glossary data
        await fetchGlossary()
        
        showNotification(`Successfully imported ${validTerms.length} terms.`, 'success')
      } catch (error) {
        console.error('Import error:', error)
        showNotification(t('glossaries.importError'), 'error')
      }
      
      // Clean up
      document.body.removeChild(fileInput)
    }
    
    // Trigger file selection
    document.body.appendChild(fileInput)
    fileInput.click()
  }

  const handleExport = () => {
    if (!glossary) return
    
    // Create CSV content with header
    const csvHeader = 'source,target,tgt_lng\n'
    const csvRows = glossary.terms.map(term => {
      // Escape quotes and handle newlines in CSV
      const source = term.source.replace(/"/g, '""')
      const target = term.translation.replace(/"/g, '""')
      const tgtLng = term.target_lang
      
      return `"${source}","${target}","${tgtLng}"`
    }).join('\n')
    
    const csvContent = csvHeader + csvRows
    
    // Create and download the file directly without dialog
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${glossary.description.replace(/[^a-zA-Z0-9]/g, '_')}_glossary.csv`
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url) // Clean up the URL object
  }

  const handleAddTerm = async () => {
    if (!glossary) return
    await fetchGlossary()
  }

  const handleUpdateTerm = async (termId: string, field: string, value: string) => {
    if (!glossary) return

    try {
      await apiClient.patch(`/glossaries/terms/${termId}`, {
        [field]: value
      })
      
      setGlossary(prev => prev ? {
        ...prev,
        terms: prev.terms.map(term => 
          term.id === termId ? { ...term, [field]: value } : term
        )
      } : null)
    } catch (error) {
      console.error('Failed to update term:', error)
      showNotification(t('glossaries.errorUpdatingTerm'), 'error')
    }
  }

  const handleInputBlur = async (termId: string, field: string, value: string) => {
    if (!glossary || !originalGlossary) return

    // Validation for empty values only on blur
    if ((field === 'source' || field === 'translation') && value.trim() === '') {
      // Show modern notification
      showNotification(t('glossaries.fieldsCannotBeEmpty'), 'error')
      
      // Revert to original value from the original glossary data
      const originalTerm = originalGlossary.terms.find(t => t.id === termId)
      if (originalTerm) {
        setGlossary(prev => prev ? {
          ...prev,
          terms: prev.terms.map(t => 
            t.id === termId ? { ...t, [field]: originalTerm[field as keyof typeof originalTerm] } : t
          )
        } : null)
      }
      return
    }

    // Update on blur
    await handleUpdateTerm(termId, field, value)
  }

  const handleGlossaryNameBlur = async (value: string) => {
    if (!glossary || !originalGlossary) return

    // Validation for empty glossary name
    if (value.trim() === '') {
      showNotification(t('glossaries.glossaryNameCannotBeEmpty'), 'error')
      
      // Revert to original value
      setGlossary(prev => prev ? {
        ...prev,
        description: originalGlossary.description
      } : null)
      return
    }

    // Only update if the value has actually changed
    if (value.trim() === originalGlossary.description) {
      return // No change, don't call API
    }

    // Update glossary name via PATCH API
    try {
      await apiClient.patch(`/glossaries/${glossary.id}`, {
        description: value.trim()
      })
      
      // Update original data for future rollbacks
      setOriginalGlossary(prev => prev ? {
        ...prev,
        description: value.trim()
      } : null)
      
      showNotification(t('glossaries.glossaryNameUpdatedSuccessfully'), 'success')
    } catch (error) {
      console.error('Failed to update glossary name:', error)
      showNotification(t('glossaries.errorUpdatingGlossaryName'), 'error')
      
      // Revert to original value on error
      setGlossary(prev => prev ? {
        ...prev,
        description: originalGlossary.description
      } : null)
    }
  }

  const handleDeleteTerm = async (termId: string) => {
    if (!glossary) return

    try {
      await apiClient.delete(`/glossaries/terms/${termId}`)
      setGlossary(prev => prev ? {
        ...prev,
        terms: prev.terms.filter(term => term.id !== termId)
      } : null)
    } catch (error) {
      console.error('Failed to delete term:', error)
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

  if (!glossary) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">{t('glossaries.glossaryNotFound')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader showDashboardButton={true} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: t('navigation.glossaries'), href: `/${locale}/dashboard/glossaries` },
            { label: glossary?.description || t('glossaries.title'), href: '#' }
          ]}
        />

        {/* Form Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('glossaries.glossaryName')}
              </label>
              <Input
                value={glossary.description}
                onChange={(e) => setGlossary(prev => prev ? { ...prev, description: e.target.value } : null)}
                onBlur={(e) => handleGlossaryNameBlur(e.target.value)}
                className="w-full border-0 bg-gray-100 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('navigation.workspaces')}
              </label>
              <div className="w-full bg-gray-50 p-2 rounded border border-gray-200 text-gray-700 font-medium flex items-center min-h-[40px]">
                {glossary.workspace?.workspace_name || t('glossaries.unknownWorkspace')}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 mt-6">
            <Button
              variant="outline"
              onClick={handleImport}
              className="flex items-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>{t('glossaries.import')}</span>
            </Button>
            
                         <Button
               variant="outline"
               onClick={handleExport}
               className="flex items-center space-x-2"
             >
               <Download className="w-4 h-4" />
               <span>{t('glossaries.export')}</span>
             </Button>
            
            <AddTermDialog 
              glossaryId={glossary.id} 
              onTermAdded={handleAddTerm}
            />
          </div>
        </div>

        {/* Terms Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              {t('glossaries.terms')} ({glossary.terms.length})
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                   {t('glossaries.source')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('glossaries.translation')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('glossaries.targetLanguage')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('common.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {glossary.terms.map((term) => (
                  <tr key={term.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Input
                        value={term.source}
                        onChange={(e) => {
                          // Update local state immediately for responsive UI
                          setGlossary(prev => prev ? {
                            ...prev,
                            terms: prev.terms.map(t => 
                              t.id === term.id ? { ...t, source: e.target.value } : t
                            )
                          } : null)
                        }}
                        onBlur={(e) => handleInputBlur(term.id, 'source', e.target.value)}
                        placeholder={t('glossaries.enterTerm')}
                        className="border-0 bg-gray-100 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:bg-white"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Input
                        value={term.translation}
                        onChange={(e) => {
                          // Update local state immediately for responsive UI
                          setGlossary(prev => prev ? {
                            ...prev,
                            terms: prev.terms.map(t => 
                              t.id === term.id ? { ...t, translation: e.target.value } : t
                            )
                          } : null)
                        }}
                        onBlur={(e) => handleInputBlur(term.id, 'translation', e.target.value)}
                        placeholder={t('glossaries.inputTranslationOptional')}
                        className="border-0 bg-gray-100 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:bg-white"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Select
                        value={term.target_lang}
                        onValueChange={(value) => handleUpdateTerm(term.id, 'target_lang', value)}
                      >
                        <SelectTrigger className="border-0 bg-gray-100 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:bg-white">
                          <SelectValue />
                        </SelectTrigger>
                                                    <SelectContent>
                              <SelectItem value="auto">{t('glossaries.auto')}</SelectItem>
                              <SelectItem value="vi">{t('glossaries.vietnamese')}</SelectItem>
                              <SelectItem value="ja">{t('glossaries.japanese')}</SelectItem>
                            </SelectContent>
                      </Select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTerm(term.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
} 