'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'
import { apiClient } from '@/lib/api-client'
import { useTranslation } from '@/i18n/hooks/useTranslation'

interface AddTermDialogProps {
  glossaryId: string
  onTermAdded: () => void
}

export function AddTermDialog({ glossaryId, onTermAdded }: AddTermDialogProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    source_term: '',
    target_term: '',
    target_lang: 'auto'
  })
  const shouldCloseRef = useRef(false)
  const [pendingClose, setPendingClose] = useState(false)

  // Custom handler to control dialog closing
  const handleOpenChange = useCallback((newOpen: boolean) => {
    console.log('Dialog onOpenChange called:', { newOpen, isLoading, shouldCloseRef: shouldCloseRef.current, pendingClose })
    // Only allow closing if not loading and not adding next term
    if (!isLoading || shouldCloseRef.current || pendingClose) {
      setOpen(newOpen)
      shouldCloseRef.current = false // Reset after closing
      setPendingClose(false)
    } else {
      console.log('Preventing dialog close because isLoading:', isLoading)
    }
  }, [isLoading, pendingClose])

  // Effect to handle pending close
  useEffect(() => {
    if (pendingClose && !isLoading) {
      console.log('Executing pending close')
      setOpen(false)
      setPendingClose(false)
    }
  }, [pendingClose, isLoading])

  const addTerm = async (shouldClose = false) => {
    console.log('addTerm called with shouldClose:', shouldClose)
    setIsLoading(true)

    try {
      console.log('Adding term with data:', {
        glossary_id: glossaryId,
        source: formData.source_term,
        translation: formData.target_term,
        target_lang: formData.target_lang
      })

      const response = await apiClient.post('/glossaries/terms', {
        glossary_id: glossaryId,
        source: formData.source_term,
        translation: formData.target_term,
        target_lang: formData.target_lang
      })

      console.log('Term added successfully:', response)

      // Reset form
      setFormData({
        source_term: '',
        target_term: '',
        target_lang: 'auto'
      })

      // Notify parent
      onTermAdded()

      // Close dialog only if shouldClose is true
      if (shouldClose) {
        console.log('Closing dialog because shouldClose is true')
        shouldCloseRef.current = true
        setPendingClose(true)
      } else {
        console.log('Keeping dialog open because shouldClose is false')
      }
    } catch (error: any) {
      console.error('Failed to add term:', error)
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      })
    } finally {
      console.log('Setting isLoading to false')
      setIsLoading(false)
    }
  }

  const handleSubmit = async () => {
    console.log('Complete button clicked')
    await addTerm(true) // Close dialog after adding
  }

  const handleAddNextTerm = async (e: React.MouseEvent) => {
    console.log('Add Next Term clicked')
    e.preventDefault()
    e.stopPropagation()
    await addTerm(false) // Don't close dialog
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>{t('glossaries.add')}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('glossaries.addNewTerm')}</DialogTitle>
          <DialogDescription>
            {t('glossaries.addNewTermDescription')}
          </DialogDescription>
        </DialogHeader>
                 <div className="space-y-4">
           <div className="space-y-2">
             <label className="text-sm font-medium">{t('glossaries.sourceTerm')}</label>
             <Input
               value={formData.source_term}
               onChange={(e) => handleInputChange('source_term', e.target.value)}
               placeholder={t('glossaries.enterSourceTerm')}
               required
             />
           </div>
           
           <div className="space-y-2">
             <label className="text-sm font-medium">{t('glossaries.translation')}</label>
             <Textarea
               value={formData.target_term}
               onChange={(e) => handleInputChange('target_term', e.target.value)}
               placeholder={t('glossaries.enterTranslationOptional')}
               rows={3}
             />
           </div>
           
           <div className="space-y-2">
             <label className="text-sm font-medium">{t('glossaries.targetLanguage')}</label>
             <Select
               value={formData.target_lang}
               onValueChange={(value) => handleInputChange('target_lang', value)}
             >
               <SelectTrigger>
                 <SelectValue />
               </SelectTrigger>
                              <SelectContent>
                    <SelectItem value="auto">{t('glossaries.auto')}</SelectItem>
                    <SelectItem value="vi">{t('glossaries.vietnamese')}</SelectItem>
                    <SelectItem value="ja">{t('glossaries.japanese')}</SelectItem>
                  </SelectContent>
             </Select>
           </div>
           
                       <DialogFooter className="flex space-x-2">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isLoading}
                >
                  {t('common.cancel')}
                </Button>
              </DialogClose>
                             <Button 
                type="button" 
                variant="secondary"
                onClick={handleAddNextTerm}
                disabled={true}
              >
                {t('glossaries.addNextTerm')}
              </Button>
              <Button 
                type="button" 
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? t('glossaries.adding') : t('glossaries.complete')}
              </Button>
            </DialogFooter>
         </div>
      </DialogContent>
    </Dialog>
  )
} 