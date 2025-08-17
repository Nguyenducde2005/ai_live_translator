'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
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
  Calendar,
  Clock,
  Copy,
  QrCode,
  Share2
} from 'lucide-react';
import QRCodeGenerator from './QRCodeGenerator';

interface CreateConferenceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateConference: (conferenceData: ConferenceData) => void;
  locale?: string;
}

interface ConferenceData {
  name: string;
  description: string;
  maxParticipants: number;
  isPublic: boolean;
}

export default function CreateConferenceDialog({
  isOpen,
  onClose,
  onCreateConference,
  locale = 'en'
}: CreateConferenceDialogProps) {
  const t = useTranslations('conferences');
  const [formData, setFormData] = useState<ConferenceData>({
    name: '',
    description: '',
    maxParticipants: 10,
    isPublic: true
  });

  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = generateRoomCode();
    setGeneratedCode(code);
    setShowSuccess(true);
    onCreateConference(formData);
  };

  const generateRoomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/${locale}/conference/${generatedCode}`;
    navigator.clipboard.writeText(link);
  };

  const handleShowQR = () => {
    setShowQRCode(true);
  };

  const handleClose = () => {
    setShowSuccess(false);
    setGeneratedCode('');
    setFormData({
      name: '',
      description: '',
      maxParticipants: 10,
      isPublic: true
    });
    onClose();
  };

  if (showSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-green-600">
              {t('conferenceCreated')}
            </DialogTitle>
            <DialogDescription className="text-center">
              {t('conferenceCreatedDescription')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Card className="p-4 bg-gray-50">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">{formData.name}</h3>
                <Badge variant="secondary" className="text-2xl font-mono bg-red-600 text-white px-4 py-2">
                  {generatedCode}
                </Badge>
                <p className="text-sm text-gray-600 mt-2">
                  {t('roomCode')}
                </p>
              </div>
            </Card>

            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                onClick={handleCopyCode}
                className="flex flex-col items-center p-3 h-auto"
              >
                <Copy className="w-4 h-4 mb-1" />
                <span className="text-xs">{t('copyCode')}</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={handleCopyLink}
                className="flex flex-col items-center p-3 h-auto"
              >
                <Share2 className="w-4 h-4 mb-1" />
                <span className="text-xs">{t('copyLink')}</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={handleShowQR}
                className="flex flex-col items-center p-3 h-auto"
              >
                <QrCode className="w-4 h-4 mb-1" />
                <span className="text-xs">{t('showQR')}</span>
              </Button>
            </div>

            <div className="text-center text-sm text-gray-600">
              <p>Participants can join using the room code or by clicking the shared link.</p>
              <p className="mt-1">No registration required!</p>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleClose} className="w-full bg-red-600 hover:bg-red-700">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="w-5 h-5 text-red-600" />
            {t('createConference')}
          </DialogTitle>
          <DialogDescription>
            Set up a new conference room for live voice translation.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('roomName')}</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter conference name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the conference"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxParticipants">Maximum Participants</Label>
            <Input
              id="maxParticipants"
              type="number"
              min="2"
              max="50"
              value={formData.maxParticipants}
              onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isPublic"
              checked={formData.isPublic}
              onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
              className="rounded border-gray-300"
            />
            <Label htmlFor="isPublic">Public conference (anyone with link can join)</Label>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-start space-x-2">
              <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-blue-600 text-xs">ℹ</span>
              </div>
              <div className="text-sm text-blue-800">
                <p className="font-medium">No Registration Required</p>
                <p className="text-blue-700">
                  Participants can join directly using the room code or shared link. 
                  They'll only need to enter their name when joining.
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
            disabled={!formData.name.trim()}
            className="bg-red-600 hover:bg-red-700"
          >
            {t('createConference')}
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* QR Code Generator */}
      <QRCodeGenerator
        roomCode={generatedCode}
        roomName={formData.name}
        isOpen={showQRCode}
        onClose={() => setShowQRCode(false)}
        locale={locale}
      />
    </Dialog>
  );
}
