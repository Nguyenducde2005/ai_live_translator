import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Trash2, Database, MessageSquare, BookOpen, Users } from 'lucide-react'

interface DeleteWorkspaceDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  workspaceName: string
  isLoading?: boolean
  stats?: {
    chatHistoryCount?: number
    glossariesCount?: number
    glossaryTermsCount?: number
  }
}

export function DeleteWorkspaceDialog({
  isOpen,
  onClose,
  onConfirm,
  workspaceName,
  isLoading = false,
  stats
}: DeleteWorkspaceDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <div className="bg-red-100 p-2 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
                         <div>
               <DialogTitle className="text-xl font-semibold text-gray-900">
                 Delete Slack app
               </DialogTitle>
               <DialogDescription className="text-gray-600">
                 This action cannot be undone
               </DialogDescription>
             </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Warning Message */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Trash2 className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                                 <h4 className="font-medium text-red-800 mb-1">
                   Warning: Data will be permanently deleted
                 </h4>
                 <p className="text-sm text-red-700">
                  Slack app <strong>"{workspaceName}"</strong> and all related data will be completely deleted and cannot be recovered.
                 </p>
              </div>
            </div>
          </div>

          {/* Data that will be deleted */}
          <div className="space-y-3">
                               <h4 className="font-medium text-gray-900">Data that will be deleted:</h4>
            
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <div className="flex-1">
                                     <div className="font-medium text-gray-900">Chat History</div>
                   <div className="text-sm text-gray-600">
                     {stats?.chatHistoryCount ? `${stats.chatHistoryCount} messages` : 'All translated messages'}
                   </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <BookOpen className="w-5 h-5 text-green-600" />
                <div className="flex-1">
                                     <div className="font-medium text-gray-900">Glossaries & Terms</div>
                   <div className="text-sm text-gray-600">
                     {stats?.glossariesCount ? `${stats.glossariesCount} glossaries` : 'All glossaries'} 
                     {stats?.glossaryTermsCount && ` • ${stats.glossaryTermsCount} terms`}
                   </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Database className="w-5 h-5 text-purple-600" />
                <div className="flex-1">
                                     <div className="font-medium text-gray-900">Slack app Configuration</div>
                   <div className="text-sm text-gray-600">
                     Tokens, API keys, and Slack settings
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* Final warning */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                                 <h4 className="font-medium text-amber-800 mb-1">
                   Final Action
                 </h4>
                 <p className="text-sm text-amber-700">
                   After confirmation, all data will be deleted immediately and cannot be recovered.
                 </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
                         Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                 Deleting...
              </>
            ) : (
              <>
                                 <Trash2 className="w-4 h-4 mr-2" />
                 Delete Slack app
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 