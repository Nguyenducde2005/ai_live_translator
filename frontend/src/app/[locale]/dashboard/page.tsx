'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { 
  Calendar, 
  Users, 
  Play, 
  Clock,
  TrendingUp,
  Plus,
  ArrowRight
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();

  // Mock data for demo purposes
  const mockStats = {
    total_conferences: 12,
    active_conferences: 3,
    total_participants: 156
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome to your Dashboard</h1>
        <p className="text-gray-600 mt-2">Monitor your conferences and manage your live translation sessions</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conferences</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.total_conferences}</div>
            <p className="text-xs text-muted-foreground">
              All time conferences created
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Conferences</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.active_conferences}</div>
            <p className="text-xs text-muted-foreground">
              Currently running conferences
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.total_participants}</div>
            <p className="text-xs text-muted-foreground">
              Across all conferences
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((mockStats.active_conferences / mockStats.total_conferences) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Active vs total conferences
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="w-5 h-5 mr-2 text-red-600" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Common tasks to get you started
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-3 text-blue-600" />
                <div>
                  <h3 className="font-medium">Create Conference</h3>
                  <p className="text-sm text-gray-600">Start a new live translation session</p>
                </div>
              </div>
              <Button 
                onClick={() => router.push('/conference')}
                className="bg-red-600 hover:bg-red-700"
              >
                Create
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-3 text-green-600" />
                <div>
                  <h3 className="font-medium">Manage Conferences</h3>
                  <p className="text-sm text-gray-600">View and control your conferences</p>
                </div>
              </div>
              <Button 
                variant="outline"
                onClick={() => router.push('/dashboard/conferences')}
              >
                Manage
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-orange-600" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Your latest conference activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Conference started</p>
                  <p className="text-xs text-gray-500">Team Meeting - 2 minutes ago</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New participant joined</p>
                  <p className="text-xs text-gray-500">Client Presentation - 5 minutes ago</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Conference scheduled</p>
                  <p className="text-xs text-gray-500">Training Session - 1 hour ago</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => router.push('/dashboard/conferences')}
              >
                View All Activity
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tips and Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle>💡 Tips for Better Conferences</CardTitle>
          <CardDescription>
            Make the most of your live translation sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-medium mb-2">Schedule Ahead</h3>
              <p className="text-sm text-gray-600">
                Create scheduled conferences to ensure participants can prepare and join on time
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-medium mb-2">Manage Participants</h3>
              <p className="text-sm text-gray-600">
                Control who can speak and mute participants when needed for better audio quality
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Play className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-sm font-medium mb-2">Monitor Status</h3>
              <p className="text-sm text-gray-600">
                Keep track of conference status and pause/resume as needed during long sessions
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 