'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Header from '@/components/Header';
import { 
  Plus,
  Link as LinkIcon,
  Calendar,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function ConferenceLandingPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('conferences');
  const [roomCode, setRoomCode] = useState('');
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [showJoinPopup, setShowJoinPopup] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [participantName, setParticipantName] = useState('');

  // Mảng ảnh minh họa
  const images = [
    {
      id: 1,
      title: t('planAhead'),
      description: t('planAheadDescription'),
      bgColor: 'from-blue-50 to-blue-100',
      iconColor: 'bg-blue-500',
      iconBg: 'bg-blue-100'
    },
    {
      id: 2,
      title: t('getShareableLink'),
      description: t('clickNewMeetingDescription'),
      bgColor: 'from-green-50 to-green-100',
      iconColor: 'bg-green-500',
      iconBg: 'bg-green-100'
    },
    {
      id: 3,
      title: t('startInstantMeeting'),
      description: t('startInstantMeeting'),
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

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Main Content - Đưa xuống dưới header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Section - Hero & Call to Action */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Live Voice Translation
              </h1>
              <h2 className="text-5xl md:text-6xl font-bold text-red-600 mb-6 leading-tight">
                Conferences
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Break language barriers with real-time voice translation. Create conference rooms, invite participants, and communicate seamlessly across languages.
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
                  {t('newMeeting')}
                </Button>
                
                <Input
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  placeholder="dfgdfgdfgdf"
                  className="h-12 text-lg border-gray-300 focus:border-red-500 focus:ring-red-500 flex-1"
                />
                
                <Link 
                  href="#"
                  className="text-red-600 hover:text-red-700 font-medium text-lg"
                  onClick={handleJoinConference}
                >
                  {t('join')}
                </Link>
              </div>
              
              {/* Đường kẻ ngang */}
              <div className="border-t border-gray-200 pt-4">
                <Link 
                  href={`/${locale}`}
                  className="text-red-600 hover:text-red-700 font-medium hover:underline"
                >
                  {t('learnMore')}
                </Link>
              </div>
            </div>
          </div>

          {/* Right Section - Feature Explanation */}
          <div className="text-center lg:text-left">
            {/* Main Illustration - Giống hoàn toàn Google Meet */}
            <div className={`w-64 h-64 mx-auto bg-gradient-to-br ${currentImage.bgColor} rounded-full flex items-center justify-center mb-8 relative`}>
              {/* Icon Link ở giữa trên */}
              <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 ${currentImage.iconColor} rounded-full flex items-center justify-center shadow-lg`}>
                <LinkIcon className="w-6 h-6 text-white" />
              </div>
              
              {/* Bàn trắng */}
              <div className="w-32 h-16 bg-white rounded-lg shadow-lg relative">
                {/* Nhân vật nam bên trái */}
                <div className="absolute -left-8 -top-8">
                  {/* Đầu */}
                  <div className="w-8 h-8 bg-orange-300 rounded-full"></div>
                  {/* Thân */}
                  <div className="w-6 h-10 bg-yellow-400 rounded-t-lg mt-1"></div>
                  {/* Chân */}
                  <div className="w-8 h-4 bg-blue-300 rounded-lg mt-1"></div>
                  {/* Laptop */}
                  <div className="w-6 h-4 bg-gray-200 rounded mt-2"></div>
                </div>
                
                {/* Nhân vật nữ bên phải */}
                <div className="absolute -right-8 -top-8">
                  {/* Đầu */}
                  <div className="w-8 h-8 bg-amber-700 rounded-full"></div>
                  {/* Thân */}
                  <div className="w-6 h-10 bg-green-600 rounded-t-lg mt-1"></div>
                  {/* Chân */}
                  <div className="w-8 h-4 bg-blue-300 rounded-lg mt-1"></div>
                  {/* Laptop */}
                  <div className="w-6 h-4 bg-gray-200 rounded mt-2"></div>
                </div>
              </div>
            </div>

            {/* Navigation Arrows - Đưa xuống dưới minh họa và căn giữa */}
            <div className="flex justify-center items-center mb-8 w-full">
              <button 
                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-800"
                onClick={handlePreviousImage}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex-1 max-w-32"></div>
              <button 
                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-800"
                onClick={handleNextImage}
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            
            {/* Text Content - Căn giữa */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {currentImage.title}
              </h3>
              <p className="text-gray-600 leading-relaxed max-w-md mx-auto">
                {currentImage.description}
              </p>
            </div>
            
            {/* Navigation Dots - Căn giữa */}
            <div className="flex justify-center space-x-2 mt-8">
              {images.map((_, index) => (
                <div 
                  key={index}
                  className={`w-3 h-3 rounded-full ${
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
                  {t('createMeetingForLater')}
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
                  {t('startInstantMeeting')}
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
                  {t('scheduleInCalendar')}
                </span>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setShowCreatePopup(false)}
              >
                {t('common.cancel')}
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
              Join Conference
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Conference Code
                </label>
                <Input
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  placeholder="Enter conference code"
                  className="w-full"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <Input
                  value={participantName}
                  onChange={(e) => setParticipantName(e.target.value)}
                  placeholder="Enter your name"
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
                Cancel
              </Button>
              <Button 
                className="flex-1 bg-red-600 hover:bg-red-700"
                onClick={handleJoinWithName}
                disabled={!roomCode.trim() || !participantName.trim()}
              >
                Join
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
