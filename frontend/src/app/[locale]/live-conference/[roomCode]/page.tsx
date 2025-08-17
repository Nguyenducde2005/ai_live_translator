'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Share, 
  Smile, 
  MessageSquare, 
  Hand, 
  MoreHorizontal, 
  Phone, 
  PhoneOff,
  Users,
  Copy,
  X
} from 'lucide-react';

export default function LiveConferencePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const roomCode = params.roomCode as string;
  const participantName = searchParams.get('name') || 'Anonymous';

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showInvitePopup, setShowInvitePopup] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      }));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleMute = () => setIsMuted(!isMuted);
  const toggleVideo = () => setIsVideoOff(!isVideoOff);
  const toggleParticipants = () => setShowParticipants(!showParticipants);
  const toggleChat = () => setShowChat(!showChat);

  const copyMeetingLink = () => {
    const link = `${window.location.origin}/${locale}/live-conference/${roomCode}`;
    navigator.clipboard.writeText(link);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            {currentTime}
          </div>
          <div className="text-sm font-medium text-gray-900">
            {roomCode}
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowInvitePopup(true)}
            className="text-blue-600 hover:text-blue-700"
          >
            <Users className="w-4 h-4 mr-2" />
            Invite
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={copyMeetingLink}
            className="text-gray-600 hover:text-gray-700"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Link
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Main Video Area */}
        <div className="flex-1 flex items-center justify-center bg-gray-50 relative">
          {/* Video Feed Placeholder */}
          <div className="w-96 h-72 bg-white rounded-lg shadow-lg flex items-center justify-center border-2 border-gray-200">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-600">
                  {participantName.charAt(0).toUpperCase()}
                </span>
              </div>
              <p className="text-gray-600 font-medium">{participantName}</p>
              <p className="text-sm text-gray-500 mt-1">Camera is off</p>
            </div>
          </div>

          {/* Room Info Overlay */}
          <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded-lg px-4 py-2 shadow-lg">
            <p className="text-sm font-medium text-gray-900">Room: {roomCode}</p>
            <p className="text-xs text-gray-600">Live Voice Translation</p>
          </div>
        </div>

        {/* Right Sidebar */}
        {(showParticipants || showChat) && (
          <div className="w-80 bg-white border-l border-gray-200">
            {showParticipants && (
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Participants</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowParticipants(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {participantName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{participantName}</p>
                      <p className="text-xs text-gray-500">You</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {showChat && (
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Chat</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowChat(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="text-center text-gray-500 py-8">
                  <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No messages yet</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Control Bar */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex items-center justify-center space-x-4">
          {/* Mute Button */}
          <Button
            variant="ghost"
            size="lg"
            onClick={toggleMute}
            className={`w-12 h-12 rounded-full ${
              isMuted 
                ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </Button>

          {/* Video Button */}
          <Button
            variant="ghost"
            size="lg"
            onClick={toggleVideo}
            className={`w-12 h-12 rounded-full ${
              isVideoOff 
                ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
          </Button>

          {/* Share Button */}
          <Button
            variant="ghost"
            size="lg"
            className="w-12 h-12 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            <Share className="w-6 h-6" />
          </Button>

          {/* Reactions Button */}
          <Button
            variant="ghost"
            size="lg"
            className="w-12 h-12 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            <Smile className="w-6 h-6" />
          </Button>

          {/* Chat Button */}
          <Button
            variant="ghost"
            size="lg"
            onClick={toggleChat}
            className={`w-12 h-12 rounded-full ${
              showChat 
                ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <MessageSquare className="w-6 h-6" />
          </Button>

          {/* Participants Button */}
          <Button
            variant="ghost"
            size="lg"
            onClick={toggleParticipants}
            className={`w-12 h-12 rounded-full ${
              showParticipants 
                ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Users className="w-6 h-6" />
          </Button>

          {/* More Options */}
          <Button
            variant="ghost"
            size="lg"
            className="w-12 h-12 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            <MoreHorizontal className="w-6 h-6" />
          </Button>

          {/* End Call Button */}
          <Button
            size="lg"
            onClick={() => window.history.back()}
            className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 text-white"
          >
            <PhoneOff className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Invite Popup */}
      {showInvitePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-96 max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Invite others</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowInvitePopup(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting link
                </label>
                <div className="flex items-center space-x-2">
                  <Input
                    value={`meet.google.com/${roomCode}`}
                    readOnly
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyMeetingLink}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <p className="text-sm text-gray-600">
                People using this meeting link must be allowed by you to join.
              </p>
            </div>
            
            <div className="mt-6">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => setShowInvitePopup(false)}
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
