'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { 
  Video, 
  Users, 
  ArrowRight,
  Copy,
  QrCode
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { conferenceService, ConferenceStatus } from '@/services/conferenceService';

interface JoinConferenceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onJoinConference: (roomCode: string, participantName: string) => void;
  locale?: string;
}

export default function JoinConferenceDialog({
  isOpen,
  onClose,
  onJoinConference,
  locale = 'en'
}: JoinConferenceDialogProps) {
  const t = useTranslations('conferences');
  const router = useRouter();
  const currentLocale = useLocale() || locale;
  const [roomCode, setRoomCode] = useState('');
  const [participantName, setParticipantName] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [errorText, setErrorText] = useState('');

  function extractConferenceCode(input: string): string | null {
    if (!input) return null;
    const trimmed = input.trim();
    try {
      const url = new URL(trimmed);
      const pathMatch = url.pathname.match(/^\/(vi|en|ja)\/live-conference\/([A-Za-z]{3}-[A-Za-z]{4}-[A-Za-z]{3})$/);
      if (pathMatch?.[2]) return pathMatch[2].toLowerCase();
      return null;
    } catch {
      const exact = trimmed.match(/^[A-Za-z]{3}-[A-Za-z]{4}-[A-Za-z]{3}$/);
      if (exact?.[0]) return exact[0].toLowerCase();
    }
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');
    if (!roomCode.trim() || !participantName.trim()) return;

    const code = extractConferenceCode(roomCode);
    if (!code) {
      const msg = t('page.errors.invalidCode');
      setErrorText(msg);
      toast.error(msg);
      return;
    }

    setIsValidating(true);
    try {
      const conf = await conferenceService.getConferenceByCode(code);
      if (conf.status === ConferenceStatus.ENDED) {
        const msg = t('page.errors.ended');
        setErrorText(msg);
        toast.error(msg);
        return;
      }
      if (conf.status === ConferenceStatus.PENDING || conf.status === ConferenceStatus.STARTED) {
        router.push(`/${currentLocale}/live-conference/${code}?name=${encodeURIComponent(participantName.trim())}`);
        onJoinConference(code, participantName.trim());
        onClose();
      } else {
        const msg = t('page.errors.notReady');
        setErrorText(msg);
        toast.error(msg);
      }
    } catch (err: any) {
      const status = err?.response?.status;
      const detail = err?.response?.data?.detail;
      if (status === 404 || detail === 'NOT_FOUND') {
        const msg = t('page.errors.notFound');
        setErrorText(msg);
        toast.error(msg);
      } else if (status === 400 && (detail === 'ENDED' || detail === 'PAUSED' || detail === 'CANCELLED')) {
        const map: Record<string, string> = {
          ENDED: t('page.errors.ended'),
          PAUSED: t('page.errors.paused'),
          CANCELLED: t('page.errors.cancelled')
        };
        const msg = map[detail] || t('page.errors.notReady');
        setErrorText(msg);
        toast.error(msg);
      } else {
        const msg = t('page.errors.network');
        setErrorText(msg);
        toast.error(msg);
      }
    } finally {
      setIsValidating(false);
    }
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setRoomCode(text.replace(/[^A-Z0-9]/g, '').substring(0, 6).toUpperCase());
    } catch (error) {
      console.log('Failed to read clipboard');
    }
  };

  const handleShowQR = () => {
    // TODO: Implement QR code scanner
    console.log('Show QR scanner');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="w-5 h-5 text-red-600" />
            {t('joinConference')}
          </DialogTitle>
          <DialogDescription>
            Enter the room code and your name to join the conference.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="roomCode">{t('roomCode')}</Label>
            <div className="flex space-x-2">
              <Input
                id="roomCode"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder={t('page.form.enterRoomCode')}
                className="font-mono text-center text-lg tracking-widest"
                required
              />
              <Button
                type="button"
                variant="outline"
                onClick={handlePasteFromClipboard}
                className="px-3"
              >
                Paste
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="participantName">{t('enterYourName')}</Label>
            <Input
              id="participantName"
              value={participantName}
              onChange={(e) => setParticipantName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>
          {errorText && (
            <p className="text-sm text-red-600">{errorText}</p>
          )}

          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-start space-x-2">
              <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-blue-600 text-xs">ℹ</span>
              </div>
              <div className="text-sm text-blue-800">
                <p className="font-medium">No Registration Required</p>
                <p className="text-blue-700">
                  You can join immediately without creating an account. 
                  Just enter your name and start communicating.
                </p>
              </div>
            </div>
          </div>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            onClick={handleSubmit}
            disabled={!roomCode.trim() || !participantName.trim() || isValidating}
            className="bg-red-600 hover:bg-red-700"
          >
            {isValidating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Joining...
              </>
            ) : (
              <>
                {t('joinConference')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
