'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Phone, 
  Settings, 
  Users, 
  MessageSquare,
  Share2,
  QrCode,
  Copy,
  MoreVertical
} from 'lucide-react';
import QRCodeGenerator from './QRCodeGenerator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface Participant {
  id: string;
  name: string;
  isHost: boolean;
  isMuted: boolean;
  isVideoOn: boolean;
  isSpeaking: boolean;
}

interface Translation {
  original: string;
  translated: string;
  language: string;
  timestamp: Date;
}

interface ConferenceRoomProps {
  roomCode: string;
  roomName: string;
  participants: Participant[];
  onLeaveRoom: () => void;
  onToggleMute: (participantId: string) => void;
  onToggleVideo: (participantId: string) => void;
  onRemoveParticipant: (participantId: string) => void;
  locale?: string;
}

export default function ConferenceRoom({
  roomCode,
  roomName,
  participants,
  onLeaveRoom,
  onToggleMute,
  onToggleVideo,
  onRemoveParticipant,
  locale = 'en'
}: ConferenceRoomProps) {
  const t = useTranslations('conferences');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [questionText, setQuestionText] = useState('');
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isHost, setIsHost] = useState(true); // Temporary for demo
  const [showQRCode, setShowQRCode] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleToggleVideo = () => {
    setIsVideoOn(!isVideoOn);
  };

  const handleShareRoom = () => {
    const roomUrl = `${window.location.origin}/${locale}/conference/${roomCode}`;
    navigator.clipboard.writeText(roomUrl);
  };

  const handleShowQR = () => {
    setShowQRCode(true);
  };

  const handleSendQuestion = () => {
    if (questionText.trim()) {
      // TODO: Send question to host
      console.log('Question sent:', questionText);
      setQuestionText('');
    }
  };

  const handleAddTranslation = () => {
    // TODO: Add real-time translation
    const newTranslation: Translation = {
      original: 'Sample text from host',
      translated: 'Văn bản mẫu từ chủ phòng',
      language: 'vi',
      timestamp: new Date()
    };
    setTranslations([newTranslation, ...translations]);
  };

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold">{roomName}</h1>
          <Badge variant="secondary" className="bg-red-600 text-white">
            {roomCode}
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShareRoom}
            className="text-white hover:bg-gray-700"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShowQR}
            className="text-white hover:bg-gray-700"
          >
            <QrCode className="w-4 h-4 mr-2" />
            {t('qrCode')}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowParticipants(!showParticipants)}
            className="text-white hover:bg-gray-700"
          >
            <Users className="w-4 h-4 mr-2" />
            {participants.length}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Video Grid - Left Side */}
        <div className="flex-1 p-4">
          <div className="grid grid-cols-2 gap-4 h-full">
            {/* Host Video */}
            <div className="relative bg-gray-800 rounded-lg flex items-center justify-center">
              {isVideoOn ? (
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover rounded-lg"
                  autoPlay
                  muted
                />
              ) : (
                <div className="text-white text-center">
                  <div className="w-20 h-20 bg-gray-600 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <span className="text-2xl font-bold">
                      {participants.find(p => p.isHost)?.name?.charAt(0) || 'H'}
                    </span>
                  </div>
                  <p className="text-sm">Camera Off</p>
                </div>
              )}
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                {participants.find(p => p.isHost)?.name || 'Host'}
              </div>
              {isMuted && (
                <div className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded">
                  <MicOff className="w-4 h-4" />
                </div>
              )}
            </div>

            {/* Other Participants */}
            {participants.filter(p => !p.isHost).map((participant) => (
              <div key={participant.id} className="relative bg-gray-800 rounded-lg flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="w-20 h-20 bg-gray-600 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <span className="text-2xl font-bold">{participant.name.charAt(0)}</span>
                  </div>
                  <p className="text-sm">{participant.name}</p>
                </div>
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                  {participant.name}
                </div>
                {participant.isMuted && (
                  <div className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded">
                    <MicOff className="w-4 h-4" />
                  </div>
                )}
                {isHost && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 bg-black bg-opacity-50 text-white hover:bg-gray-700"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => onToggleMute(participant.id)}>
                        {participant.isMuted ? t('unmute') : t('mute')}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onToggleVideo(participant.id)}>
                        {participant.isVideoOn ? t('videoOff') : t('videoOn')}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onRemoveParticipant(participant.id)}
                        className="text-red-600"
                      >
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Translation Panel - Right Side */}
        <div className="w-96 bg-gray-800 p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">{t('translation.title')}</h3>
            <select
              value={currentLanguage}
              onChange={(e) => setCurrentLanguage(e.target.value)}
              className="bg-gray-700 text-white px-2 py-1 rounded text-sm"
            >
              <option value="en">English</option>
              <option value="vi">Tiếng Việt</option>
              <option value="ja">日本語</option>
            </select>
          </div>

          {/* Host Translation */}
          <div className="mb-6">
            <h4 className="text-white text-sm font-medium mb-2">{t('translation.hostText')}</h4>
            <Card className="bg-gray-700 border-gray-600">
              <div className="p-3">
                <div className="mb-2">
                  <label className="text-gray-300 text-xs">{t('translation.originalText')}</label>
                  <div className="bg-gray-800 text-white p-2 rounded text-sm min-h-[60px]">
                    {translations[0]?.original || 'Host is speaking...'}
                  </div>
                </div>
                <div>
                  <label className="text-gray-300 text-xs">{t('translation.translatedText')}</label>
                  <div className="bg-gray-800 text-white p-2 rounded text-sm min-h-[60px]">
                    {translations[0]?.translated || 'Chủ phòng đang nói...'}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Viewer Questions */}
          <div className="flex-1">
            <h4 className="text-white text-sm font-medium mb-2">{t('translation.questions')}</h4>
            <div className="space-y-3">
              <Textarea
                placeholder="Type your question here..."
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 resize-none"
                rows={3}
              />
              <Button
                onClick={handleSendQuestion}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Send Question
              </Button>
            </div>

            {/* Recent Questions */}
            <div className="mt-4">
              <h5 className="text-white text-sm font-medium mb-2">{t('translation.viewerQuestions')}</h5>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                <div className="bg-gray-700 p-2 rounded text-sm">
                  <p className="text-white">How do you pronounce this word?</p>
                  <p className="text-gray-400 text-xs mt-1">Làm thế nào để phát âm từ này?</p>
                </div>
                <div className="bg-gray-700 p-2 rounded text-sm">
                  <p className="text-white">Can you repeat that?</p>
                  <p className="text-gray-400 text-xs mt-1">Bạn có thể lặp lại không?</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-800 p-4 flex items-center justify-center space-x-4">
        <Button
          variant={isMuted ? "destructive" : "secondary"}
          size="lg"
          onClick={handleToggleMute}
          className="rounded-full w-12 h-12 p-0"
        >
          {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </Button>

        <Button
          variant={isVideoOn ? "secondary" : "destructive"}
          size="lg"
          onClick={handleToggleVideo}
          className="rounded-full w-12 h-12 p-0"
        >
          {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
        </Button>

        <Button
          variant="ghost"
          size="lg"
          onClick={() => setShowChat(!showChat)}
          className="rounded-full w-12 h-12 p-0 text-white hover:bg-gray-700"
        >
          <MessageSquare className="w-6 h-6" />
        </Button>

        <Button
          variant="ghost"
          size="lg"
          className="rounded-full w-12 h-12 p-0 text-white hover:bg-gray-700"
        >
          <Settings className="w-6 h-6" />
        </Button>

        <Button
          variant="destructive"
          size="lg"
          onClick={onLeaveRoom}
          className="rounded-full w-12 h-12 p-0 bg-red-600 hover:bg-red-700"
        >
          <Phone className="w-6 h-6" />
        </Button>
      </div>

                   {/* QR Code Generator */}
             <QRCodeGenerator
               roomCode={roomCode}
               roomName={roomName}
               isOpen={showQRCode}
               onClose={() => setShowQRCode(false)}
               locale={locale}
             />
    </div>
  );
}
