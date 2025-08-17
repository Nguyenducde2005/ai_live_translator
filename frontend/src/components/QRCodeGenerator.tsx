"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, Copy, Download } from "lucide-react";
import { useTranslations } from 'next-intl';

interface QRCodeGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  roomCode: string;
  roomName: string;
  locale: string;
}

const QRCodeGenerator = ({ isOpen, onClose, roomCode, roomName, locale }: QRCodeGeneratorProps) => {
  const t = useTranslations();
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [roomUrl, setRoomUrl] = useState<string>('');

  useEffect(() => {
    if (isOpen && roomCode) {
      generateQRCode();
      // Set room URL only on client side
      if (typeof window !== 'undefined') {
        setRoomUrl(`${window.location.origin}/${locale}/conference/${roomCode}`);
      }
    }
  }, [isOpen, roomCode, locale]);

  const generateQRCode = async () => {
    if (!roomCode) return;
    
    setIsGenerating(true);
    try {
      const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/${locale}/conference/${roomCode}`;
      
      // Sử dụng API công khai để tạo QR code
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(url)}`;
      
      // Fetch QR code image
      const response = await fetch(qrApiUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch QR code');
      }
      
      const blob = await response.blob();
      const dataUrl = URL.createObjectURL(blob);
      setQrCodeDataUrl(dataUrl);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
      setQrCodeDataUrl('');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadQR = () => {
    if (qrCodeDataUrl && typeof window !== 'undefined') {
      const link = document.createElement('a');
      link.href = qrCodeDataUrl;
      link.download = `conference-${roomCode}-qr.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleCopyLink = async () => {
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(roomUrl);
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = roomUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-red-600" />
            {t('conferences.qrCode')} for {roomName}
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
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download QR
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeGenerator;
