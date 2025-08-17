'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Video, 
  Users, 
  ArrowRight,
  Copy,
  QrCode,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface JoinConferencePageProps {
  params: {
    roomCode: string;
    locale: string;
  };
}

export default function JoinConferencePage({ params }: JoinConferencePageProps) {
  const router = useRouter();
  const { roomCode, locale } = params;
  const t = useTranslations('conferences');
  const [participantName, setParticipantName] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [conferenceInfo, setConferenceInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Validate room code format
    if (roomCode && roomCode.length !== 6) {
      setError('Invalid room code format. Room codes must be 6 characters long.');
      return;
    }

    // TODO: Fetch conference info from API
    // For now, simulate with mock data
    setConferenceInfo({
      name: 'Sample Conference',
      description: 'A sample conference room',
      hostName: 'Host User',
      maxParticipants: 20,
      currentParticipants: 5,
      isActive: true
    });
  }, [roomCode]);

  const handleJoinConference = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!participantName.trim()) return;

    setIsValidating(true);
    setError(null);
    
    try {
      // TODO: Validate participant name and join conference
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to conference room
      router.push(`/${locale}/conference/${roomCode}/room?name=${encodeURIComponent(participantName.trim())}`);
    } catch (err) {
      setError('Failed to join conference. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleCopyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
  };

  const handleShowQR = () => {
    // TODO: Implement QR code generation
    console.log('Show QR code for:', roomCode);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button
                onClick={() => router.push(`/${locale}`)}
                className="bg-red-600 hover:bg-red-700"
              >
                Go Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!conferenceInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading conference information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Video className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Live Voice Translator</h2>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-sm">
                {t('roomCode')}: {roomCode}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyRoomCode}
              >
                <Copy className="w-4 h-4 mr-2" />
                {t('copyLink')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShowQR}
              >
                <QrCode className="w-4 h-4 mr-2" />
                {t('qrCode')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('joinConference')}
          </h1>
          <p className="text-xl text-gray-600">
            You're about to join: <span className="font-semibold text-red-600">{conferenceInfo.name}</span>
          </p>
        </div>

        {/* Conference Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Video className="w-5 h-5 mr-2 text-red-600" />
              {t('conferenceRoom')} Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium text-gray-700">{t('roomName')}</Label>
                <p className="text-lg font-semibold text-gray-900 mt-1">{conferenceInfo.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">{t('host')}</Label>
                <p className="text-lg font-semibold text-gray-900 mt-1">{conferenceInfo.hostName}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">{t('participants')}</Label>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {conferenceInfo.currentParticipants} / {conferenceInfo.maxParticipants}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Status</Label>
                <Badge 
                  variant={conferenceInfo.isActive ? "default" : "secondary"}
                  className="mt-1"
                >
                  {conferenceInfo.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Join Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              {t('enterYourName')}
            </CardTitle>
            <CardDescription className="text-center">
              Enter your name to join the conference room
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleJoinConference} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="participantName" className="text-sm font-medium text-gray-700">
                  {t('enterYourName')}
                </Label>
                <Input
                  id="participantName"
                  value={participantName}
                  onChange={(e) => setParticipantName(e.target.value)}
                  placeholder="Enter your name"
                  className="text-center text-lg"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 h-12 text-lg"
                disabled={!participantName.trim() || isValidating}
              >
                {isValidating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Joining...
                  </>
                ) : (
                  <>
                    {t('joinConference')}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Button
            variant="link"
            onClick={() => router.push(`/${locale}`)}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
