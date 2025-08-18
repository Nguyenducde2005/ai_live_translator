'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus,
  Link as LinkIcon,
  Calendar,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import CreateConferenceDialog from '@/components/CreateConferenceDialog';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { conferenceService, ConferenceType } from '@/services/conferenceService';

export default function ConferenceLandingPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('conferences.page');
  const { isAuthenticated } = useAuth();
  const [roomCode, setRoomCode] = useState('');
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [showJoinPopup, setShowJoinPopup] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [participantName, setParticipantName] = useState('');
  const [createDialogType, setCreateDialogType] = useState<'instant' | 'scheduled' | null>(null);
  const [conflictOpen, setConflictOpen] = useState(false);
  const [conflictInfo, setConflictInfo] = useState<{ title?: string; code?: string; id?: string } | null>(null);
  const [conflictLoading, setConflictLoading] = useState(false);

  // Mảng ảnh minh họa
  const images = [
    {
      id: 1,
      title: t('slides.createConference.title'),
      description: t('slides.createConference.description'),
      bgColor: 'from-blue-50 to-blue-100',
      iconColor: 'bg-blue-500',
      iconBg: 'bg-blue-100'
    },
    {
      id: 2,
      title: t('slides.joinConference.title'),
      description: t('slides.joinConference.description'),
      bgColor: 'from-green-50 to-green-100',
      iconColor: 'bg-green-500',
      iconBg: 'bg-green-100'
    },
    {
      id: 3,
      title: t('slides.translation.title'),
      description: t('slides.translation.description'),
      bgColor: 'from-red-50 to-red-100',
      iconColor: 'bg-red-500',
      iconBg: 'bg-red-100'
    }
  ];

  const currentImage = images[currentImageIndex];

  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleJoinConference = () => {
    if (roomCode.trim()) {
      setShowJoinPopup(true);
    }
  };

  const handleCreateConference = async (type: 'instant' | 'scheduled') => {
    if (!isAuthenticated) {
      router.push(`/${locale}/auth/sign-in?redirect=/${locale}/conference`);
      return;
    }

    if (type === 'instant') {
      try {
        // Pre-check for existing live conference
        const list = await conferenceService.getMyConferences(0, 50);
        const live = list.find(c => c.status === 'STARTED' || c.status === 'PAUSED');
        if (live) {
          setConflictInfo({ title: live.title, code: live.conference_code, id: live.id });
          setConflictOpen(true);
          return;
        }
      } catch (e) {
        // If cannot check, fallback to open form; backend will still guard
      }
    }

    setCreateDialogType(type);
    setShowCreatePopup(false);
  };

  const handleConflictEndAndStartNew = async () => {
    if (!conflictInfo?.id) {
      setConflictOpen(false);
      return;
    }
    setConflictLoading(true);
    try {
      await conferenceService.endConference(conflictInfo.id);
      setConflictOpen(false);
      setCreateDialogType('instant');
      setShowCreatePopup(false);
      toast.success('Ended current conference. You can now create a new one.');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to end current conference.');
    } finally {
      setConflictLoading(false);
    }
  };

  const handleConflictCreateScheduled = () => {
    setConflictOpen(false);
    setCreateDialogType('scheduled');
    setShowCreatePopup(false);
  };

  const handleJoinWithName = () => {
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 5000); // Chuyển slide mỗi 5 giây
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header variant="light" />

      {/* Main Content - Đưa xuống dưới header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Section - Hero & Call to Action */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {t('hero.title')}
              </h1>
              <h2 className="text-5xl md:text-6xl font-bold text-red-600 mb-6 leading-tight">
                {t('hero.subtitle')}
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                {t('hero.description')}
              </p>
            </div>
            
            <div className="space-y-4">
              {/* Nút và Input cùng hàng */}
              <div className="flex items-center space-x-3">
                <Button 
                  size="lg" 
                  className="bg-red-600 hover:bg-red-700 h-12 px-6 text-lg font-medium"
                  onClick={() => setShowCreatePopup(true)}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  {t('actions.newMeeting')}
                </Button>
                
                <Input
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  placeholder={t('form.enterCodeOrLink')}
                  className="h-12 text-lg border-gray-300 focus:border-red-500 focus:ring-red-500 flex-1"
                />
                
                <Link 
                  href="#"
                  className="h-12 px-6 text-lg font-medium border-2 border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-600 rounded-lg flex items-center justify-center transition-colors"
                  onClick={handleJoinConference}
                >
                  {t('actions.join')}
                </Link>
              </div>
              
              <p className="text-sm text-gray-500 text-center">
                {t('actions.learnMore')}
              </p>
            </div>
          </div>
          
          {/* Right Section - Slideshow */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              {/* Navigation Arrows */}
              <button
                onClick={handlePreviousImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
              
              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
              >
                <ArrowRight className="w-5 h-5 text-gray-700" />
              </button>
              
              {/* Current Slide */}
              <div className={`h-80 bg-gradient-to-br ${currentImage.bgColor} p-8 flex flex-col items-center justify-center text-center`}>
                <div className={`w-20 h-20 ${currentImage.iconBg} rounded-full flex items-center justify-center mb-6`}>
                  <div className={`w-12 h-12 ${currentImage.iconColor} rounded-full flex items-center justify-center`}>
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  {currentImage.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {currentImage.description}
                </p>
              </div>
              
              {/* Navigation Dots */}
              <div className="flex justify-center space-x-2 mt-8">
                {images.map((_, index) => (
                  <div 
                    key={index}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentImageIndex 
                        ? 'bg-red-600' 
                        : 'bg-red-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Conference Popup */}
      {showCreatePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-96 max-w-md mx-4">
            <div className="space-y-3">
              <div 
                className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors border border-gray-200"
                onClick={() => handleCreateConference('scheduled')}
              >
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <LinkIcon className="w-5 h-5 text-red-600" />
                </div>
                <span className="text-gray-700 font-medium">
                  {t('popups.createConference.createMeetingForLater')}
                </span>
              </div>
              
              <div 
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border border-gray-200"
                onClick={() => handleCreateConference('instant')}
              >
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Plus className="w-5 h-5 text-red-600" />
                </div>
                <span className="text-gray-700 font-medium">
                  {t('popups.createConference.startInstantMeeting')}
                </span>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setShowCreatePopup(false)}
              >
                {t('popups.createConference.cancel')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Join Conference Popup */}
      {showJoinPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-96 max-w-md mx-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {t('popups.joinConference.title')}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('form.roomCode')}
                </label>
                <Input
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  placeholder={t('form.enterRoomCode')}
                  className="w-full"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('form.enterYourName')}
                </label>
                <Input
                  value={participantName}
                  onChange={(e) => setParticipantName(e.target.value)}
                  placeholder={t('form.enterYourName')}
                  className="w-full"
                />
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200 flex space-x-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowJoinPopup(false)}
              >
                {t('popups.joinConference.cancel')}
              </Button>
              <Button 
                className="flex-1 bg-red-600 hover:bg-red-700"
                onClick={handleJoinWithName}
                disabled={!participantName.trim()}
              >
                Join
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Create Conference Dialog */}
      <CreateConferenceDialog
        isOpen={createDialogType !== null}
        onClose={() => setCreateDialogType(null)}
        type={createDialogType as 'instant' | 'scheduled'}
      />

      {/* Conflict Dialog: already has live conference */}
      <Dialog open={conflictOpen} onOpenChange={setConflictOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>You already have a live conference</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Current live: <span className="font-semibold text-gray-900">{conflictInfo?.title || 'Your live conference'}</span>
              {conflictInfo?.code ? ` (${conflictInfo.code})` : ''}
            </p>
            <Separator />
            <div className="flex flex-col gap-2">
              <Button
                onClick={handleConflictEndAndStartNew}
                disabled={conflictLoading}
                className="bg-red-600 hover:bg-red-700"
              >
                {conflictLoading ? 'Processing...' : 'End current and start new now'}
              </Button>
              <Button
                variant="outline"
                onClick={handleConflictCreateScheduled}
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
    </div>
  );
}
