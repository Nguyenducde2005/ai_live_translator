'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Video, 
  Users, 
  Calendar, 
  Clock, 
  Search,
  Plus,
  Play,
  Settings,
  Trash2,
  Copy,
  Share2,
  QrCode,
  MoreVertical
} from 'lucide-react';
import CreateConferenceDialog from '@/components/CreateConferenceDialog';
import JoinConferenceDialog from '@/components/JoinConferenceDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Conference {
  id: string;
  name: string;
  description: string;
  roomCode: string;
  hostName: string;
  maxParticipants: number;
  currentParticipants: number;
  isActive: boolean;
  createdAt: Date;
  lastActive: Date;
}

export default function ConferencesPage() {
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations('conferences');
  
  const [conferences, setConferences] = useState<Conference[]>([
    {
      id: '1',
      name: 'Team Meeting - Q4 Planning',
      description: 'Quarterly planning session for the development team',
      roomCode: 'ABC123',
      hostName: 'John Doe',
      maxParticipants: 15,
      currentParticipants: 8,
      isActive: true,
      createdAt: new Date('2024-01-15'),
      lastActive: new Date()
    },
    {
      id: '2',
      name: 'Client Presentation',
      description: 'Product demo for potential clients',
      roomCode: 'XYZ789',
      hostName: 'Jane Smith',
      maxParticipants: 10,
      currentParticipants: 3,
      isActive: false,
      createdAt: new Date('2024-01-14'),
      lastActive: new Date('2024-01-14T16:30:00')
    },
    {
      id: '3',
      name: 'Training Session',
      description: 'New feature training for support team',
      roomCode: 'DEF456',
      hostName: 'Mike Johnson',
      maxParticipants: 20,
      currentParticipants: 12,
      isActive: true,
      createdAt: new Date('2024-01-13'),
      lastActive: new Date()
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showJoinDialog, setShowJoinDialog] = useState(false);

  const filteredConferences = conferences.filter(conference =>
    conference.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conference.roomCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeConferences = conferences.filter(c => c.isActive);
  const totalParticipants = conferences.reduce((sum, c) => sum + c.currentParticipants, 0);

  const handleCreateConference = (conferenceData: any) => {
    const newConference: Conference = {
      id: Date.now().toString(),
      name: conferenceData.name,
      description: conferenceData.description,
      roomCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
      hostName: 'You',
      maxParticipants: conferenceData.maxParticipants,
      currentParticipants: 1,
      isActive: false,
      createdAt: new Date(),
      lastActive: new Date()
    };
    
    setConferences(prev => [newConference, ...prev]);
    setShowCreateDialog(false);
  };

  const handleJoinConference = (roomCode: string, participantName: string) => {
    // TODO: Implement join logic
    console.log('Joining conference:', roomCode, 'as:', participantName);
    setShowJoinDialog(false);
  };

  const handleDeleteConference = (conferenceId: string) => {
    if (confirm('Are you sure you want to delete this conference?')) {
      setConferences(prev => prev.filter(c => c.id !== conferenceId));
    }
  };

  const handleCopyRoomCode = (roomCode: string) => {
    navigator.clipboard.writeText(roomCode);
  };

  const handleShareConference = (conference: Conference) => {
    const shareUrl = `${window.location.origin}/${locale}/conference/${conference.roomCode}`;
    navigator.clipboard.writeText(shareUrl);
  };

  const handleShowQR = (conference: Conference) => {
    // TODO: Implement QR code display
    console.log('Show QR for:', conference.roomCode);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
              <p className="text-gray-600 mt-2">
                Manage your conference rooms and monitor participant activity
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowJoinDialog(true)}
              >
                <Users className="w-4 h-4 mr-2" />
                {t('joinConference')}
              </Button>
              <Button
                onClick={() => setShowCreateDialog(true)}
                className="bg-red-600 hover:bg-red-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t('createConference')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Video className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{t('conferenceStats.totalRooms')}</p>
                  <p className="text-2xl font-bold text-gray-900">{conferences.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{t('conferenceStats.activeParticipants')}</p>
                  <p className="text-2xl font-bold text-gray-900">{totalParticipants}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Video className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Conferences</p>
                  <p className="text-2xl font-bold text-gray-900">{activeConferences.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search conferences by name or room code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Conferences List */}
        {filteredConferences.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t('noConferences')}</h3>
              <p className="text-gray-600 mb-6">{t('noConferencesDescription')}</p>
              <Button
                onClick={() => setShowCreateDialog(true)}
                className="bg-red-600 hover:bg-red-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t('createConference')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredConferences.map((conference) => (
              <Card key={conference.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{conference.name}</CardTitle>
                      <CardDescription className="text-sm text-gray-600 mb-3">
                        {conference.description}
                      </CardDescription>
                    </div>
                    <Badge 
                      variant={conference.isActive ? "default" : "secondary"}
                      className="ml-2"
                    >
                      {conference.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">{t('roomCode')}:</span>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="font-mono">
                          {conference.roomCode}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyRoomCode(conference.roomCode)}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-gray-600">{t('participants')}:</span>
                      <p className="font-semibold mt-1">
                        {conference.currentParticipants} / {conference.maxParticipants}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      <span>{t('host')}: {conference.hostName}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{conference.createdAt.toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShareConference(conference)}
                      className="flex-1"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      {t('share')}
                    </Button>
                    
                                         <Button
                       variant="outline"
                       size="sm"
                       onClick={() => handleShowQR(conference)}
                       className="flex-1"
                     >
                       <QrCode className="w-4 h-4 mr-2" />
                       {t('showQR')}
                     </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleDeleteConference(conference.id)}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Dialogs */}
      <CreateConferenceDialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onCreateConference={handleCreateConference}
        locale={locale}
      />
      
      <JoinConferenceDialog
        isOpen={showJoinDialog}
        onClose={() => setShowJoinDialog(false)}
        onJoinConference={handleJoinConference}
        locale={locale}
      />
    </div>
  );
}
