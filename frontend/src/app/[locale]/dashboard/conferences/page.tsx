'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ConferenceStatus, ConferenceType, conferenceService, type ConferenceWithParticipants } from '@/services/conferenceService';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { 
  Calendar, 
  Clock, 
  Users, 
  Play, 
  Pause, 
  Square, 
  Edit, 
  Trash2, 
  Plus,
  Search,
  Filter,
  ExternalLink,
  Copy as CopyIcon,
  QrCode
} from 'lucide-react';
import { useLocale } from 'next-intl';

// Dữ liệu sẽ được tải từ API

export default function DashboardConferencesPage() {
  const [conferences, setConferences] = useState<ConferenceWithParticipants[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [editDialog, setEditDialog] = useState<{ open: boolean; conference: ConferenceWithParticipants | null }>({ open: false, conference: null });
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; conference: ConferenceWithParticipants | null }>({ open: false, conference: null });
  const [startConflict, setStartConflict] = useState<{ open: boolean; live: ConferenceWithParticipants | null; target: ConferenceWithParticipants | null; loading: boolean }>({ open: false, live: null, target: null, loading: false });
  const [qrDialog, setQrDialog] = useState<{ open: boolean; link: string; title: string }>({ open: false, link: '', title: '' });
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    const fetchConferences = async () => {
      try {
        const data = await conferenceService.getMyConferences();
        setConferences(data);
      } catch (error: any) {
        console.error('Error fetching conferences:', error);
        toast.error('Failed to load conferences');
      } finally {
        setLoading(false);
      }
    };
    fetchConferences();
  }, []);

  const handleStatusChange = async (conferenceId: string, action: 'start' | 'pause' | 'resume' | 'end') => {
    try {
      let updated;
      switch (action) {
        case 'start':
          updated = await conferenceService.startConference(conferenceId);
          break;
        case 'pause':
          updated = await conferenceService.pauseConference(conferenceId);
          break;
        case 'resume':
          updated = await conferenceService.resumeConference(conferenceId);
          break;
        case 'end':
          updated = await conferenceService.endConference(conferenceId);
          break;
      }
      setConferences(prev => prev.map(c => (c.id === conferenceId ? { ...c, ...updated } : c)));
      toast.success(`Conference ${action}ed successfully`);
    } catch (error: any) {
      console.error(`Error ${action}ing conference:`, error);
      toast.error(`Failed to ${action} conference`);
    }
  };

  const handleStartWithConflictCheck = async (target: ConferenceWithParticipants) => {
    try {
      // Use current list to check for live/paused conference
      const live = conferences.find(c => (c.status === ConferenceStatus.STARTED || c.status === ConferenceStatus.PAUSED) && c.id !== target.id);
      if (live) {
        setStartConflict({ open: true, live, target, loading: false });
        return;
      }
      await handleStatusChange(target.id, 'start');
    } catch (e) {
      toast.error('Failed to start conference');
    }
  };

  const confirmEndLiveAndStartTarget = async () => {
    if (!startConflict.live || !startConflict.target) {
      setStartConflict({ open: false, live: null, target: null, loading: false });
      return;
    }
    setStartConflict(prev => ({ ...prev, loading: true }));
    try {
      const ended = await conferenceService.endConference(startConflict.live.id);
      const started = await conferenceService.startConference(startConflict.target.id);
      setConferences(prev => prev.map(c => {
        if (c.id === ended.id) return { ...c, ...ended };
        if (c.id === started.id) return { ...c, ...started };
        return c;
      }));
      toast.success('Ended current live conference and started the selected one');
      setStartConflict({ open: false, live: null, target: null, loading: false });
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Action failed');
      setStartConflict(prev => ({ ...prev, loading: false }));
    }
  };

  const handleEditConference = async (conferenceData: any) => {
    if (!editDialog.conference) return;
    
    try {
      const payload: any = { ...conferenceData };
      if (payload.scheduled_at === '' || payload.scheduled_at === undefined) {
        delete payload.scheduled_at;
      } else if (typeof payload.scheduled_at === 'string') {
        const parsed = new Date(payload.scheduled_at);
        if (!isNaN(parsed.getTime())) {
          payload.scheduled_at = parsed.toISOString();
        } else {
          delete payload.scheduled_at;
        }
      }
      const updated = await conferenceService.updateConference(editDialog.conference.id, payload);
      setConferences(prev => prev.map(c => (c.id === editDialog.conference!.id ? { ...c, ...updated } : c)));
      setEditDialog({ open: false, conference: null });
      toast.success('Conference updated successfully');
    } catch (error: any) {
      console.error('Error updating conference:', error);
      toast.error('Failed to update conference');
    }
  };

  const handleDeleteConference = async () => {
    if (!deleteDialog.conference) return;
    
    try {
      await conferenceService.deleteConference(deleteDialog.conference.id);
      setConferences(prev => prev.filter(c => c.id !== deleteDialog.conference!.id));
      setDeleteDialog({ open: false, conference: null });
      toast.success('Conference deleted successfully');
    } catch (error: any) {
      console.error('Error deleting conference:', error);
      toast.error('Failed to delete conference');
    }
  };

  const getStatusBadge = (status: ConferenceStatus) => {
    const statusConfig = {
      [ConferenceStatus.PENDING]: { label: 'Pending', variant: 'secondary' as const },
      [ConferenceStatus.STARTED]: { label: 'Live', variant: 'default' as const },
      [ConferenceStatus.PAUSED]: { label: 'Paused', variant: 'outline' as const },
      [ConferenceStatus.ENDED]: { label: 'Ended', variant: 'destructive' as const },
      [ConferenceStatus.CANCELLED]: { label: 'Cancelled', variant: 'destructive' as const },
    };
    
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getTypeBadge = (type: ConferenceType) => {
    const typeConfig = {
      [ConferenceType.INSTANT]: { label: 'Instant', variant: 'default' as const },
      [ConferenceType.SCHEDULED]: { label: 'Scheduled', variant: 'secondary' as const },
    };
    
    const config = typeConfig[type];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getActionButtons = (conference: ConferenceWithParticipants) => {
    const buttons = [];
    
    switch (conference.status) {
      case ConferenceStatus.PENDING:
        buttons.push(
          <Button
            key="start"
            size="sm"
            onClick={() => handleStartWithConflictCheck(conference)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Play className="w-4 h-4 mr-1" />
            Start
          </Button>
        );
        break;
        
      case ConferenceStatus.STARTED:
        buttons.push(
          <Button
            key="pause"
            size="sm"
            variant="outline"
            onClick={() => handleStatusChange(conference.id, 'pause')}
          >
            <Pause className="w-4 h-4 mr-1" />
            Pause
          </Button>
        );
        buttons.push(
          <Button
            key="end"
            size="sm"
            variant="destructive"
            onClick={() => handleStatusChange(conference.id, 'end')}
          >
            <Square className="w-4 h-4 mr-1" />
            End
          </Button>
        );
        break;
        
      case ConferenceStatus.PAUSED:
        buttons.push(
          <Button
            key="resume"
            size="sm"
            onClick={() => handleStatusChange(conference.id, 'resume')}
            className="bg-green-600 hover:bg-green-700"
          >
            <Play className="w-4 h-4 mr-1" />
            Resume
          </Button>
        );
        buttons.push(
          <Button
            key="end"
            size="sm"
            variant="destructive"
            onClick={() => handleStatusChange(conference.id, 'end')}
          >
            <Square className="w-4 h-4 mr-1" />
            End
          </Button>
        );
        break;
    }
    
    // Add edit and delete buttons for all statuses
    buttons.push(
      <Button
        key="edit"
        size="sm"
        variant="outline"
        onClick={() => setEditDialog({ open: true, conference })}
      >
        <Edit className="w-4 h-4 mr-1" />
        Edit
      </Button>
    );
    
    buttons.push(
      <Button
        key="delete"
        size="sm"
        variant="outline"
        onClick={() => setDeleteDialog({ open: true, conference })}
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <Trash2 className="w-4 h-4 mr-1" />
        Delete
      </Button>
    );
    
    return buttons;
  };

  const filteredConferences = conferences.filter(conference => {
    const matchesSearch = conference.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conference.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conference.conference_code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || conference.status === statusFilter;
    const matchesType = typeFilter === 'all' || conference.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const buildLivePath = (code: string) => `/${locale}/live-conference/${code}?name=Host`;
  const buildLiveLink = (code: string) => {
    if (typeof window !== 'undefined' && window.location?.origin) {
      return `${window.location.origin}${buildLivePath(code)}`;
    }
    return buildLivePath(code);
  };
  const openQrForLink = (title: string, link: string) => {
    setQrDialog({ open: true, link, title });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Conference Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your conferences and monitor their status</p>
        </div>
        <Button onClick={() => router.push('/conference')} className="bg-red-600 hover:bg-red-700">
          <Plus className="w-4 h-4 mr-2" />
          Create New Conference
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search conferences..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="status-filter">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value={ConferenceStatus.PENDING}>Pending</SelectItem>
                  <SelectItem value={ConferenceStatus.STARTED}>Live</SelectItem>
                  <SelectItem value={ConferenceStatus.PAUSED}>Paused</SelectItem>
                  <SelectItem value={ConferenceStatus.ENDED}>Ended</SelectItem>
                  <SelectItem value={ConferenceStatus.CANCELLED}>Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="type-filter">Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value={ConferenceType.INSTANT}>Instant</SelectItem>
                  <SelectItem value={ConferenceType.SCHEDULED}>Scheduled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setTypeFilter('all');
                }}
              >
                <Filter className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conferences Grid */}
      {loading && (
        <Card>
          <CardContent className="pt-6">Loading conferences...</CardContent>
        </Card>
      )}
      {filteredConferences.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Calendar className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No conferences found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' 
                  ? 'Try adjusting your filters or search terms'
                  : 'Get started by creating your first conference'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && typeFilter === 'all' && (
                <Button onClick={() => router.push('/conference')} className="bg-red-600 hover:bg-red-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Conference
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredConferences.map((conference) => (
            <Card key={conference.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{conference.title}</CardTitle>
                    <CardDescription className="mt-2">
                      Code: <span className="font-mono font-semibold">{conference.conference_code}</span>
                    </CardDescription>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    {getStatusBadge(conference.status)}
                    {getTypeBadge(conference.type)}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {conference.description && (
                  <p className="text-gray-600 mb-4 line-clamp-2">{conference.description}</p>
                )}
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    Max: {conference.max_participants} participants
                  </div>
                  
                  {conference.scheduled_at && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      Scheduled: {formatDate(conference.scheduled_at)}
                    </div>
                  )}
                  
                  {conference.started_at && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      Started: {formatDate(conference.started_at)}
                    </div>
                  )}
                  
                  {conference.ended_at && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      Ended: {formatDate(conference.ended_at)}
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2 items-center">
                  {getActionButtons(conference)}
                  {/* Open live link if active */}
                  {(conference.status === ConferenceStatus.STARTED || conference.status === ConferenceStatus.PAUSED) && (
                    <Button
                      key="open"
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(buildLivePath(conference.conference_code))}
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Open live
                    </Button>
                  )}
                  {/* Copy share link */}
                  <Button
                    key="copy"
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      const link = buildLiveLink(conference.conference_code);
                      try {
                        await navigator.clipboard.writeText(link);
                        toast.success('Copied link to clipboard');
                      } catch {
                        toast.error('Failed to copy link');
                      }
                    }}
                  >
                    <CopyIcon className="w-4 h-4 mr-1" />
                    Copy link
                  </Button>
                  {/* QR code */}
                  <Button
                    key="qr"
                    size="sm"
                    variant="outline"
                    onClick={() => openQrForLink(conference.title, buildLiveLink(conference.conference_code))}
                  >
                    <QrCode className="w-4 h-4 mr-1" />
                    QR
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialog.open} onOpenChange={(open) => setEditDialog({ open, conference: editDialog.conference })}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Conference</DialogTitle>
          </DialogHeader>
          {editDialog.conference && (
            <EditConferenceForm
              conference={editDialog.conference}
              onSubmit={handleEditConference}
              onCancel={() => setEditDialog({ open: false, conference: null })}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, conference: deleteDialog.conference })}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Conference</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600">
              Are you sure you want to delete "{deleteDialog.conference?.title}"? This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, conference: null })}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConference}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Start Conflict Dialog */}
      <Dialog open={startConflict.open} onOpenChange={(open) => setStartConflict(prev => ({ ...prev, open }))}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Another conference is live</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Current live: <span className="font-semibold text-gray-900">{startConflict.live?.title}</span>
              {startConflict.live?.conference_code ? ` (${startConflict.live.conference_code})` : ''}
            </p>
            <p className="text-sm text-gray-600">
              Target to start: <span className="font-semibold text-gray-900">{startConflict.target?.title}</span>
              {startConflict.target?.conference_code ? ` (${startConflict.target.conference_code})` : ''}
            </p>
            <Separator />
            <div className="flex flex-col gap-2">
              <Button
                onClick={confirmEndLiveAndStartTarget}
                disabled={startConflict.loading}
                className="bg-red-600 hover:bg-red-700"
              >
                {startConflict.loading ? 'Processing...' : 'End current live and start selected'}
              </Button>
              <Button
                variant="ghost"
                onClick={() => setStartConflict({ open: false, live: null, target: null, loading: false })}
                disabled={startConflict.loading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* QR Dialog */}
      <Dialog open={qrDialog.open} onOpenChange={(open) => setQrDialog(prev => ({ ...prev, open }))}>
        <DialogContent className="sm:max-w-[360px]">
          <DialogHeader>
            <DialogTitle>Share "{qrDialog.title}"</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-3 py-2">
            <img
              alt="QR"
              className="w-48 h-48"
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrDialog.link)}`}
            />
            <div className="w-full flex gap-2">
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(qrDialog.link);
                    toast.success('Copied link');
                  } catch {
                    toast.error('Failed to copy');
                  }
                }}
              >
                Copy link
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open(qrDialog.link, '_blank')}
              >
                Open
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Edit Conference Form Component
function EditConferenceForm({ 
  conference, 
  onSubmit, 
  onCancel 
}: { 
  conference: ConferenceWithParticipants; 
  onSubmit: (data: any) => void; 
  onCancel: () => void; 
}) {
  const [formData, setFormData] = useState({
    title: conference.title,
    description: conference.description || '',
    max_participants: conference.max_participants,
    language_from: conference.language_from,
    language_to: conference.language_to,
    scheduled_at: conference.scheduled_at ? new Date(conference.scheduled_at).toISOString().slice(0, 16) : ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="max_participants">Max Participants</Label>
          <Select
            value={formData.max_participants.toString()}
            onValueChange={(value) => setFormData(prev => ({ ...prev, max_participants: parseInt(value) }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {conference.type === ConferenceType.SCHEDULED && (
          <div>
            <Label htmlFor="scheduled_at">Scheduled Time</Label>
            <Input
              id="scheduled_at"
              type="datetime-local"
              value={formData.scheduled_at}
              onChange={(e) => setFormData(prev => ({ ...prev, scheduled_at: e.target.value }))}
            />
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="language_from">From Language</Label>
          <Select
            value={formData.language_from}
            onValueChange={(value) => setFormData(prev => ({ ...prev, language_from: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="vi">Vietnamese</SelectItem>
              <SelectItem value="zh">Chinese</SelectItem>
              <SelectItem value="ja">Japanese</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="language_to">To Language</Label>
          <Select
            value={formData.language_to}
            onValueChange={(value) => setFormData(prev => ({ ...prev, language_to: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="vi">Vietnamese</SelectItem>
              <SelectItem value="zh">Chinese</SelectItem>
              <SelectItem value="ja">Japanese</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-red-600 hover:bg-red-700">
          Save Changes
        </Button>
      </div>
    </form>
  );
}
