'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Video, 
  Users, 
  Globe,
  ArrowRight,
  Plus,
  Search,
  Copy,
  QrCode
} from 'lucide-react';
import Link from 'next/link';

export default function ConferenceLandingPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations('conferences');
  const [roomCode, setRoomCode] = useState('');
  const [participantName, setParticipantName] = useState('');

  const handleJoinConference = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomCode.trim() && participantName.trim()) {
      router.push(`/${locale}/conference/${roomCode.trim().toUpperCase()}?name=${encodeURIComponent(participantName.trim())}`);
    }
  };

  const handleCreateConference = () => {
    router.push(`/${locale}/dashboard/conferences`);
  };

  const handleCopyRoomCode = () => {
    if (roomCode.trim()) {
      navigator.clipboard.writeText(roomCode.trim().toUpperCase());
    }
  };

  const handleShowQR = () => {
    if (roomCode.trim()) {
      // TODO: Show QR code
      console.log('Show QR for:', roomCode);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Video className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Live Voice Translator</h2>
              </div>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link href={`/${locale}/dashboard`}>
                <Button variant="outline" size="sm">
                  Dashboard
                </Button>
              </Link>
              <Link href={`/${locale}/dashboard/conferences`}>
                <Button size="sm" className="bg-red-600 hover:bg-red-700">
                  <Plus className="w-4 h-4 mr-2" />
                  {t('createConference')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Live Voice Translation
            <span className="block text-red-600">Conferences</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Break language barriers with real-time voice translation. 
            Create conference rooms, invite participants, and communicate seamlessly across languages.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-red-600 hover:bg-red-700 h-14 px-8 text-lg"
              onClick={handleCreateConference}
            >
              <Plus className="w-6 h-6 mr-2" />
              {t('createConference')}
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="h-14 px-8 text-lg border-red-200 text-red-700 hover:bg-red-50"
              onClick={() => document.getElementById('join-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Search className="w-6 h-6 mr-2" />
              {t('joinConference')}
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Video className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-xl mb-2">No Registration Required</CardTitle>
            <CardDescription>
              Participants can join immediately using room codes or shared links. 
              Just enter your name and start communicating.
            </CardDescription>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-xl mb-2">Real-time Translation</CardTitle>
            <CardDescription>
              Host speech is automatically translated for all participants. 
              Support for multiple languages including Vietnamese, English, and Japanese.
            </CardDescription>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-xl mb-2">Easy Sharing</CardTitle>
            <CardDescription>
              Share conference links, room codes, or QR codes. 
              Participants can join from any device with just a web browser.
            </CardDescription>
          </Card>
        </div>

        {/* Join Conference Section */}
        <div id="join-section" className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('joinConference')}</h2>
            <p className="text-gray-600">
              Enter the room code and your name to join an existing conference
            </p>
          </div>

          <form onSubmit={handleJoinConference} className="max-w-md mx-auto space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">{t('roomCode')}</label>
              <div className="flex space-x-2">
                <Input
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
                  onClick={handleCopyRoomCode}
                  className="px-3"
                  disabled={!roomCode.trim()}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleShowQR}
                  className="px-3"
                  disabled={!roomCode.trim()}
                >
                  <QrCode className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">{t('enterYourName')}</label>
              <Input
                value={participantName}
                onChange={(e) => setParticipantName(e.target.value)}
                placeholder="Enter your name"
                required
                className="text-center text-lg"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 h-12 text-lg"
              disabled={!roomCode.trim() || !participantName.trim()}
            >
              {t('joinConference')}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Don't have a room code?{' '}
              <Button
                variant="link"
                className="text-red-600 hover:text-red-700 p-0 h-auto"
                onClick={handleCreateConference}
              >
                Create a new conference
              </Button>
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-red-600 font-bold text-lg">1</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Create Room</h4>
              <p className="text-sm text-gray-600">Host creates a conference room with a unique 6-digit code</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-red-600 font-bold text-lg">2</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Share Code</h4>
              <p className="text-sm text-gray-600">Share the room code, link, or QR code with participants</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-red-600 font-bold text-lg">3</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Join Meeting</h4>
              <p className="text-sm text-gray-600">Participants enter name and join without registration</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-red-600 font-bold text-lg">4</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Translate & Communicate</h4>
              <p className="text-sm text-gray-600">Real-time voice translation enables seamless communication</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <Video className="w-5 h-5 text-red-600" />
            </div>
            <span className="text-xl font-bold">Live Voice Translator</span>
          </div>
          <p className="text-gray-400">
            Breaking language barriers, one conversation at a time
          </p>
        </div>
      </div>
    </div>
  );
}
