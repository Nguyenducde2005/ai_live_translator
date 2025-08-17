'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, Users, Copy, QrCode, ArrowRight, X, Zap, Globe } from 'lucide-react';
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

  const handleJoinConference = () => {
    if (roomCode.trim() && participantName.trim()) {
      // Format mã phòng theo Google Meet (3 ký tự - 3 ký tự)
      const formattedCode = roomCode.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
      if (formattedCode.length === 6) {
        const finalCode = `${formattedCode.slice(0, 3)}-${formattedCode.slice(3, 6)}`;
        router.push(`/${locale}/live-conference/${finalCode}?name=${encodeURIComponent(participantName.trim())}`);
      } else {
        // Nếu không đủ 6 ký tự, thêm dấu gạch ngang vào giữa
        const paddedCode = formattedCode.padEnd(6, 'A');
        const finalCode = `${paddedCode.slice(0, 3)}-${paddedCode.slice(3, 6)}`;
        router.push(`/${locale}/live-conference/${finalCode}?name=${encodeURIComponent(participantName.trim())}`);
      }
      setShowJoinPopup(false);
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
            className="bg-gray-900/95 border border-gray-700/50 rounded-2xl shadow-2xl p-8 w-96 max-w-md mx-4 backdrop-blur-md"
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
                    <button className="p-1 hover:bg-gray-700/50 rounded transition-colors">
                      <Copy className="w-4 h-4 text-gray-400 hover:text-gray-200" />
                    </button>
                    <button className="p-1 hover:bg-gray-700/50 rounded transition-colors">
                      <QrCode className="w-4 h-4 text-gray-400 hover:text-gray-200" />
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
            </div>
            
            {/* Action Button */}
            <div className="mt-8">
              <Button 
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg font-medium transition-all duration-200"
                onClick={handleJoinConference}
                disabled={!roomCode.trim() || !participantName.trim()}
              >
                Join Conference <ArrowRight className="w-5 h-5 ml-2" />
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
