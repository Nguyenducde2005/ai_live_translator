'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { conferenceService, ConferenceCreate, ConferenceType } from '@/services/conferenceService';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useLocale } from 'next-intl';
import { Separator } from '@/components/ui/separator';

interface CreateConferenceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'instant' | 'scheduled';
}

const languages = [
  { code: 'en', name: 'English' },
  { code: 'vi', name: 'Tiếng Việt' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'zh', name: '中文' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'es', name: 'Español' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
  { code: 'ru', name: 'Русский' },
  { code: 'ar', name: 'العربية' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'th', name: 'ไทย' },
];

export default function CreateConferenceDialog({
  isOpen,
  onClose,
  type
}: CreateConferenceDialogProps) {
  const t = useTranslations('conferences');
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const locale = useLocale();
  
  const [formData, setFormData] = useState<ConferenceCreate>({
    title: '',
    description: '',
    type: ConferenceType.SCHEDULED,
    max_participants: 50,
    language_from: 'en',
    language_to: 'vi',
    scheduled_at: undefined
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [conflictOpen, setConflictOpen] = useState(false);
  const [conflictInfo, setConflictInfo] = useState<{ title?: string; code?: string } | null>(null);
  const [conflictLoading, setConflictLoading] = useState(false);

  const resolveLiveConference = async () => {
    const list = await conferenceService.getMyConferences(0, 50);
    return list.find(c => c.status === 'STARTED' || c.status === 'PAUSED');
  };

  const handleInputChange = (field: keyof ConferenceCreate, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Conference title is required');
      return;
    }

    // Require authentication (HOST) to create conference
    if (!isAuthenticated) {
      toast.error('Please sign in as Host to create a conference');
      router.push(`/${locale}/auth/sign-in?redirect=/${locale}/conference`);
      return;
    }

    // Pre-check: if creating INSTANT and there is an active conference, show conflict dialog instead of calling API
    if (type === 'instant') {
      const live = await resolveLiveConference();
      if (live) {
        setConflictInfo({ title: live.title, code: live.conference_code });
        setConflictOpen(true);
        return;
      }
    }

    setIsLoading(true);
    try {
      // Set conference type based on dialog type
      const conferenceData = {
        ...formData,
        type: type === 'instant' ? ConferenceType.INSTANT : ConferenceType.SCHEDULED
      };
      
      // Authenticated create conference
      const conference = await conferenceService.createConference(conferenceData);
      
      if (type === 'instant') {
        toast.success(`Instant conference "${conference.title}" created successfully! Redirecting to conference room...`);
        // Chuyển đến conference room ngay lập tức
        router.push(`/${locale}/live-conference/${conference.conference_code}?name=Host`);
      } else {
        toast.success(`Conference "${conference.title}" scheduled successfully! You can start it later from your dashboard.`);
        // Chuyển đến dashboard để quản lý
        router.push(`/${locale}/dashboard/conferences`);
      }
      
      onClose();
    } catch (error: any) {
      console.error('Error creating conference:', error);
      
      // Handle specific error cases professionally
      const status = error.response?.status;
      const errorDetail: string | undefined = error.response?.data?.detail;

      if (status === 400) {
        if (typeof errorDetail === 'string' && errorDetail.includes('already has a live conference')) {
          // If creating INSTANT, show conflict popup to choose action
          if (type === 'instant') {
            const titleMatch = errorDetail.match(/live conference: (.+?) \(/);
            const codeMatch = errorDetail.match(/([a-zA-Z]{3}-[a-zA-Z]{4}-[a-zA-Z]{3})/);
            setConflictInfo({ title: titleMatch?.[1], code: codeMatch?.[1] });
            setConflictOpen(true);
          } else {
            // For scheduled creation, backend should allow; but just in case
            toast.error('You already have an active conference running. Please try scheduling instead.');
          }
        } else if (errorDetail === 'Inactive user') {
          toast.error('Your account is inactive. Please sign in again or contact support.');
          router.push(`/${locale}/auth/sign-in?redirect=/${locale}/conference`);
        } else {
          toast.error(`Validation error: ${errorDetail || 'Invalid request'}`);
        }
      } else if (status === 401) {
        toast.error('Your session has expired. Please sign in again.');
        router.push(`/${locale}/auth/sign-in?redirect=/${locale}/conference`);
      } else {
        toast.error(errorDetail || 'Failed to create conference. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  const handleEndAndCreateInstant = async () => {
    setConflictLoading(true);
    try {
      const live = await resolveLiveConference();
      if (!live) {
        toast.error('Cannot find your active conference. Please refresh and try again.');
        setConflictOpen(false);
        return;
      }
      await conferenceService.endConference(live.id);
      const newConference = await conferenceService.createConference({
        ...formData,
        type: ConferenceType.INSTANT,
      });
      toast.success(`Conference "${newConference.title}" created. Redirecting...`);
      router.push(`/${locale}/live-conference/${newConference.conference_code}?name=Host`);
      setConflictOpen(false);
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to end current conference and create new.');
    } finally {
      setConflictLoading(false);
    }
  };

  const handleCreateScheduledInstead = async () => {
    setConflictLoading(true);
    try {
      const scheduled = await conferenceService.createConference({
        ...formData,
        type: ConferenceType.SCHEDULED,
      });
      toast.success(`Conference "${scheduled.title}" scheduled successfully.`);
      router.push(`/${locale}/dashboard/conferences`);
      setConflictOpen(false);
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to create scheduled conference.');
    } finally {
      setConflictLoading(false);
    }
  };

  return (
    <>
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {type === 'instant' ? 'Start Instant Conference' : 'Schedule Conference'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Conference Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter conference title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter conference description (optional)"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="language_from">From Language</Label>
              <Select
                value={formData.language_from}
                onValueChange={(value) => handleInputChange('language_from', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="language_to">To Language</Label>
              <Select
                value={formData.language_to}
                onValueChange={(value) => handleInputChange('language_to', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="max_participants">Max Participants</Label>
            <Select
              value={formData.max_participants?.toString()}
              onValueChange={(value) => handleInputChange('max_participants', parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {type === 'scheduled' && (
            <div className="space-y-2">
              <Label htmlFor="scheduled_at">Scheduled Time (Optional)</Label>
              <Input
                id="scheduled_at"
                type="datetime-local"
                value={formData.scheduled_at || ''}
                onChange={(e) => handleInputChange('scheduled_at', e.target.value)}
                placeholder="Select scheduled time"
              />
            </div>
          )}
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? 'Creating...' : type === 'instant' ? 'Start Now' : 'Schedule'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>

    {/* Conflict Dialog: already has a live conference */}
    <Dialog open={conflictOpen} onOpenChange={setConflictOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>You already have a live conference</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Current live: <span className="font-semibold text-gray-900">{conflictInfo?.title || 'Your live conference'}</span>
            {conflictInfo?.code ? ` (${conflictInfo?.code})` : ''}
          </p>
          <Separator />
          <p className="text-sm text-gray-700">Choose an action:</p>
          <div className="flex flex-col gap-2">
            <Button
              onClick={handleEndAndCreateInstant}
              disabled={conflictLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {conflictLoading ? 'Processing...' : 'End current and start new now'}
            </Button>
            <Button
              variant="outline"
              onClick={handleCreateScheduledInstead}
              disabled={conflictLoading}
            >
              {conflictLoading ? 'Processing...' : 'Create as Scheduled instead'}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setConflictOpen(false)}
              disabled={conflictLoading}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}
