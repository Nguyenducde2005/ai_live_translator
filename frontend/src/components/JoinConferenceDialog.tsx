'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
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
  const [roomCode, setRoomCode] = useState('');
  const [participantName, setParticipantName] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomCode.trim() || !participantName.trim()) return;

    setIsValidating(true);
    
    // Simulate validation delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onJoinConference(roomCode.trim().toUpperCase(), participantName.trim());
    setIsValidating(false);
    onClose();
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
                placeholder="Enter 6-digit code"
                maxLength={6}
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
