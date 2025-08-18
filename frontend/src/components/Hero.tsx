'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, Users, Copy, ClipboardPaste, ArrowRight, X, Zap, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { conferenceService, ConferenceStatus } from '@/services/conferenceService';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';

export default function Hero() {
  const t = useTranslations();
  const locale = useLocale();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  
  const [showJoinPopup, setShowJoinPopup] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [participantName, setParticipantName] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [joinError, setJoinError] = useState('');

  const tErrors = {
    invalidCode: t('conferences.page.errors.invalidCode'),
    notFound: t('conferences.page.errors.notFound'),
    ended: t('conferences.page.errors.ended'),
    paused: t('conferences.page.errors.paused'),
    cancelled: t('conferences.page.errors.cancelled'),
    notReady: t('conferences.page.errors.notReady'),
    network: t('conferences.page.errors.network'),
  } as const;

  function extractConferenceCode(input: string): string | null {
    if (!input) return null;
    const trimmed = input.trim();
    try {
      const url = new URL(trimmed);
      const m = url.pathname.match(/^\/(vi|en|ja)\/live-conference\/([A-Za-z]{3}-[A-Za-z]{4}-[A-Za-z]{3})$/);
      if (m?.[2]) return m[2].toLowerCase();
      return null;
    } catch {
      const exact = trimmed.match(/^[A-Za-z]{3}-[A-Za-z]{4}-[A-Za-z]{3}$/);
      if (exact?.[0]) return exact[0].toLowerCase();
    }
    return null;
  }

  const handleJoinConference = async () => {
    setJoinError('');
    if (!roomCode.trim() || !participantName.trim()) return;
    const code = extractConferenceCode(roomCode);
    if (!code) {
      setJoinError(tErrors.invalidCode);
      toast.error(tErrors.invalidCode);
      return;
    }

    setIsChecking(true);
    try {
      const conf = await conferenceService.getConferenceByCode(code);
      if (conf.status === ConferenceStatus.ENDED) {
        setJoinError(tErrors.ended);
        toast.error(tErrors.ended);
        return;
      }
      if (conf.status === ConferenceStatus.PENDING || conf.status === ConferenceStatus.STARTED) {
        router.push(`/${locale}/live-conference/${code}?name=${encodeURIComponent(participantName.trim())}`);
        setShowJoinPopup(false);
        return;
      }
      const map: Record<string, string> = { PAUSED: tErrors.paused, CANCELLED: tErrors.cancelled };
      const msg = map[(conf.status as any)] || tErrors.notReady;
      setJoinError(msg);
      toast.error(msg);
    } catch (err: any) {
      const status = err?.response?.status;
      const detail = err?.response?.data?.detail;
      if (status === 404 || detail === 'NOT_FOUND') {
        setJoinError(tErrors.notFound);
        toast.error(tErrors.notFound);
      } else if (status === 400 && (detail === 'ENDED' || detail === 'PAUSED' || detail === 'CANCELLED')) {
        const map: Record<string, string> = { ENDED: tErrors.ended, PAUSED: tErrors.paused, CANCELLED: tErrors.cancelled };
        const msg = map[detail] || tErrors.notReady;
        setJoinError(msg);
        toast.error(msg);
      } else {
        setJoinError(tErrors.network);
        toast.error(tErrors.network);
      }
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <section className="relative pt-20 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
      {/* Background image with dark overlay */}
      <div className="absolute inset-0">
        <img
          src="/static/images/hero-banner.jpg"
          alt="International conference with AI translation"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/40"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 py-16 lg:py-20 flex flex-col items-center justify-center min-h-screen text-center">
        <div className="mb-6 mt-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {t('hero.title')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-4xl leading-relaxed">
            {t('hero.subtitle')}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <Button 
            size="lg" 
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105"
            asChild
          >
            <a href={`/${locale}/conference`}>
              <Mic className="w-5 h-5 mr-2" />
              {t('hero.startLiveTranslation')}
            </a>
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="border-2 border-white/30 text-white hover:text-red-400 bg-black/20 hover:bg-black/40 px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-sm transition-all duration-300"
            onClick={() => setShowJoinPopup(true)}
          >
            <Users className="w-5 h-5 mr-2" />
            {t('hero.joinConference')}
          </Button>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-600/20 rounded-full flex items-center justify-center">
              <Zap className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Real-time AI Translation</h3>
            <p className="text-gray-300">Instant voice translation with advanced AI technology</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-600/20 rounded-full flex items-center justify-center">
              <Globe className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Languages Supported</h3>
            <p className="text-gray-300">Cover major languages for global communication</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-600/20 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Conference Optimized</h3>
            <p className="text-gray-300">Perfect for international meetings and events</p>
          </div>
        </div>
      </div>

      {/* Join Conference Popup */}
      {showJoinPopup && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowJoinPopup(false)}
        >
          <div 
            className="bg-gray-900/95 border border-gray-700/50 rounded-2xl shadow-2xl p-8 w-[560px] max-w-[600px] mx-4 backdrop-blur-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                Join Conference
              </h2>
              <p className="text-gray-300 text-sm">
                Enter the room code and your name to join an existing conference
              </p>
            </div>
            
            <div className="space-y-6">
              {/* Room Code Input */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2 text-left">
                  Room Code
                </label>
                <div className="relative">
                  <Input
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className="w-full pr-20 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                    <button
                      type="button"
                      className="p-1 hover:bg-gray-700/50 rounded transition-colors"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(roomCode);
                          toast.success('Copied');
                        } catch {
                          toast.error('Copy failed');
                        }
                      }}
                    >
                      <Copy className="w-4 h-4 text-gray-400 hover:text-gray-200" />
                    </button>
                    <button
                      type="button"
                      className="p-1 hover:bg-gray-700/50 rounded transition-colors"
                      onClick={async () => {
                        try {
                          const text = await navigator.clipboard.readText();
                          const code = extractConferenceCode(text);
                          setRoomCode(code || text);
                        } catch {
                          toast.error('Paste failed');
                        }
                      }}
                    >
                      <ClipboardPaste className="w-4 h-4 text-gray-400 hover:text-gray-200" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Name Input */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2 text-left">
                  Enter Your Name
                </label>
                <Input
                  value={participantName}
                  onChange={(e) => setParticipantName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500"
                />
              </div>
              {joinError && (
                <p className="text-sm text-red-400">{joinError}</p>
              )}
            </div>
            
            {/* Action Button */}
            <div className="mt-8">
              <Button 
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg font-medium transition-all duration-200"
                onClick={handleJoinConference}
                disabled={!roomCode.trim() || !participantName.trim() || isChecking}
              >
                {isChecking ? 'Checking...' : 'Join Conference'} <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {/* Footer Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                Don't have a room code?{' '}
                <button 
                  className="text-red-400 hover:text-red-300 font-medium hover:underline transition-colors"
                  onClick={() => {
                    setShowJoinPopup(false);
                    router.push(`/${locale}/conference`);
                  }}
                >
                  Create a new conference
                </button>
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowJoinPopup(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-700/50 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-400 hover:text-gray-200" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
