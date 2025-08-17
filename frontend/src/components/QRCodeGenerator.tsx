'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { QrCode, Download, Copy } from 'lucide-react';

interface QRCodeGeneratorProps {
  roomCode: string;
  roomName: string;
  isOpen: boolean;
  onClose: () => void;
  locale?: string;
}

export default function QRCodeGenerator({
  roomCode,
  roomName,
  isOpen,
  onClose,
  locale = 'en'
}: QRCodeGeneratorProps) {
  const t = useTranslations('conferences');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (isOpen && roomCode) {
      generateQRCode();
    }
  }, [isOpen, roomCode]);

  const generateQRCode = async () => {
    setIsGenerating(true);
    try {
      // Simple QR code generation using a public API
      const roomUrl = `${window.location.origin}/${locale}/conference/${roomCode}`;
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(roomUrl)}`;
      
      // Convert to data URL for download
      const response = await fetch(qrApiUrl);
      const blob = await response.blob();
      const dataUrl = URL.createObjectURL(blob);
      setQrCodeDataUrl(dataUrl);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
      // Fallback to a simple text-based QR representation
      setQrCodeDataUrl('');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadQR = () => {
    if (qrCodeDataUrl) {
      const link = document.createElement('a');
      link.href = qrCodeDataUrl;
      link.download = `conference-${roomCode}-qr.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleCopyLink = () => {
    const roomUrl = `${window.location.origin}/${locale}/conference/${roomCode}`;
    navigator.clipboard.writeText(roomUrl);
  };

  const roomUrl = `${window.location.origin}/${locale}/conference/${roomCode}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-red-600" />
            {t('qrCode')} for {roomName}
          </DialogTitle>
          <DialogDescription>
            Share this QR code with participants to join the conference
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Room Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600">Conference Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Room Code:</span>
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                  {roomCode}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Direct Link:</span>
                <span className="text-sm text-gray-600 truncate max-w-[200px]">
                  {roomUrl}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* QR Code Display */}
          <div className="text-center">
            {isGenerating ? (
              <div className="flex items-center justify-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              </div>
            ) : qrCodeDataUrl ? (
              <div className="space-y-3">
                <img 
                  src={qrCodeDataUrl} 
                  alt={`QR Code for ${roomName}`}
                  className="mx-auto border border-gray-200 rounded-lg"
                />
                <p className="text-sm text-gray-600">
                  Scan this QR code to join the conference
                </p>
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center bg-gray-100 rounded-lg">
                <div className="text-center text-gray-500">
                  <QrCode className="w-16 h-16 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Failed to generate QR code</p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={handleCopyLink}
              className="flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Copy Link
            </Button>
            
            <Button
              onClick={handleDownloadQR}
              disabled={!qrCodeDataUrl}
              className="bg-red-600 hover:bg-red-700 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download QR
            </Button>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-start space-x-2">
              <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-blue-600 text-xs">ℹ</span>
              </div>
              <div className="text-sm text-blue-800">
                <p className="font-medium">How to use:</p>
                <ul className="mt-1 space-y-1 text-blue-700">
                  <li>• Participants scan the QR code with their phone camera</li>
                  <li>• Or share the direct link via email/message</li>
                  <li>• No registration required - just enter name to join</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose} className="w-full bg-red-600 hover:bg-red-700">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
