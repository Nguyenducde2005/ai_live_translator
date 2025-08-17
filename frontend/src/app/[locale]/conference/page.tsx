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
import ConferenceHeader from '@/components/ConferenceHeader';

export default function ConferenceLandingPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('conferences.page');
  const [roomCode, setRoomCode] = useState('');
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [showJoinPopup, setShowJoinPopup] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [participantName, setParticipantName] = useState('');

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

  const handleCreateConference = (type: 'instant' | 'later') => {
    if (type === 'instant') {
      // Tạo cuộc hội nghị ngay lập tức với mã phòng ngẫu nhiên
      const randomCode = generateRoomCode();
      router.push(`/${locale}/live-conference/${randomCode}?name=Host`);
    } else {
      // Tạo cuộc hội nghị để dùng sau - chuyển đến dashboard
      router.push(`/${locale}/dashboard/conferences`);
    }
    setShowCreatePopup(false);
  };

  const generateRoomCode = () => {
    // Tạo mã 6 ký tự giống Google Meet (3 ký tự - 3 ký tự)
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const part1 = Array.from({length: 3}, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
    const part2 = Array.from({length: 3}, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
    return `${part1}-${part2}`;
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
      <ConferenceHeader />

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
                  className="text-red-600 hover:text-red-700 font-medium text-lg"
                  onClick={handleJoinConference}
                >
                  {t('actions.join')}
                </Link>
              </div>
              
              {/* Đường kẻ ngang */}
              <div className="border-t border-gray-200 pt-4">
                <Link 
                  href={`/${locale}`}
                  className="text-red-600 hover:text-red-700 font-medium hover:underline"
                >
                  {t('actions.learnMore')}
                </Link>
              </div>
            </div>
          </div>

          {/* Right Section - Feature Explanation */}
          <div className="text-center lg:text-left">
            {/* Main Illustration - Slide tự chạy */}
            <div className="w-64 h-64 mx-auto mb-8 relative overflow-hidden rounded-2xl shadow-2xl">
              <div className={`w-full h-full bg-gradient-to-br ${currentImage.bgColor} rounded-2xl flex items-center justify-center relative`}>
                {/* Icon chính ở giữa */}
                <div className={`w-16 h-16 ${currentImage.iconColor} rounded-full flex items-center justify-center shadow-lg`}>
                  {currentImageIndex === 0 && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                    </svg>
                  )}
                  {currentImageIndex === 1 && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                      <line x1="12" x2="12" y1="19" y2="22"></line>
                    </svg>
                  )}
                  {currentImageIndex === 2 && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  )}
                </div>
                
                {/* Nhân vật minh họa */}
                <div className="absolute -left-6 -top-6">
                  <div className="w-6 h-6 bg-orange-300 rounded-full"></div>
                  <div className="w-4 h-8 bg-yellow-400 rounded-t-lg mt-1"></div>
                </div>
                <div className="absolute -right-6 -top-6">
                  <div className="w-6 h-6 bg-amber-700 rounded-full"></div>
                  <div className="w-4 h-8 bg-green-600 rounded-t-lg mt-1"></div>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <div className="flex justify-center items-center mb-8 w-full">
              <button 
                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                onClick={handlePreviousImage}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="m12 19-7-7 7-7"></path>
                  <path d="M19 12H5"></path>
                </svg>
              </button>
              <div className="flex-1 max-w-32"></div>
              <button 
                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                onClick={handleNextImage}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </button>
            </div>
            
            {/* Text Content */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {currentImage.title}
              </h3>
              <p className="text-gray-600 leading-relaxed max-w-md mx-auto">
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

      {/* Create Conference Popup */}
      {showCreatePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-96 max-w-md mx-4">
            <div className="space-y-3">
              <div 
                className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors border border-gray-200"
                onClick={() => handleCreateConference('later')}
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
              
              <div 
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border border-gray-200"
                onClick={() => handleCreateConference('later')}
              >
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-red-600" />
                </div>
                <span className="text-gray-700 font-medium">
                  {t('popups.createConference.scheduleInCalendar')}
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
            
            <div className="mt-6 flex space-x-3">
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
                disabled={!roomCode.trim() || !participantName.trim()}
              >
                {t('actions.join')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
