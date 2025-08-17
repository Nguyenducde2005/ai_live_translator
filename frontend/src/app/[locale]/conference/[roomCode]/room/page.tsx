'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import ConferenceRoom from '@/components/ConferenceRoom';

interface ConferenceRoomPageProps {
  params: {
    roomCode: string;
    locale: string;
  };
}

export default function ConferenceRoomPage({ params }: ConferenceRoomPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { roomCode, locale } = params;
  const participantName = searchParams.get('name');
  const t = useTranslations('conferences');

  const [participants, setParticipants] = useState([
    {
      id: '1',
      name: 'Host User',
      isHost: true,
      isMuted: false,
      isVideoOn: true,
      isSpeaking: false
    },
    {
      id: '2',
      name: participantName || 'Participant',
      isHost: false,
      isMuted: false,
      isVideoOn: true,
      isSpeaking: false
    }
  ]);

  useEffect(() => {
    if (!participantName) {
      router.push(`/${locale}/conference/${roomCode}`);
      return;
    }

    // Update participant name if it changed
    setParticipants(prev => prev.map(p => 
      !p.isHost ? { ...p, name: participantName } : p
    ));
  }, [participantName, roomCode, router, locale]);

  const handleLeaveRoom = () => {
    if (confirm('Are you sure you want to leave the conference?')) {
      router.push(`/${locale}`);
    }
  };

  const handleToggleMute = (participantId: string) => {
    setParticipants(prev => prev.map(p => 
      p.id === participantId ? { ...p, isMuted: !p.isMuted } : p
    ));
  };

  const handleToggleVideo = (participantId: string) => {
    setParticipants(prev => prev.map(p => 
      p.id === participantId ? { ...p, isVideoOn: !p.isVideoOn } : p
    ));
  };

  const handleRemoveParticipant = (participantId: string) => {
    setParticipants(prev => prev.filter(p => p.id !== participantId));
  };

  if (!participantName) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ConferenceRoom
      roomCode={roomCode}
      roomName="Live Voice Translation Conference"
      participants={participants}
      onLeaveRoom={handleLeaveRoom}
      onToggleMute={handleToggleMute}
      onToggleVideo={handleToggleVideo}
      onRemoveParticipant={handleRemoveParticipant}
      locale={locale}
    />
  );
}
