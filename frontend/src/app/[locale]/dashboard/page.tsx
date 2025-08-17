'use client'

import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Video, Plus, Settings, Home, Calendar, Users, BarChart3, Globe, Bell, Shield, User } from 'lucide-react'
import Link from 'next/link'
import { DashboardHeader } from '@/components/ui/dashboard-header'
import { useTranslation } from '@/i18n/hooks/useTranslation'
import { useState } from 'react'

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const { t, locale } = useTranslation()
  const [activeTab, setActiveTab] = useState<'dashboard' | 'conferences' | 'settings'>('dashboard')

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  const renderDashboardContent = () => (
    <>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('header.welcomeBack', { name: user?.full_name || 'User' })}
        </h1>
        <p className="text-gray-600">Welcome to your GiantyLive dashboard. Manage your conferences and settings.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-lg">
              <Video className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Conferences</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Participants</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Translation Hours</p>
              <p className="text-2xl font-bold text-gray-900">0h</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            onClick={() => setActiveTab('conferences')}
            className="p-6 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-all duration-200 cursor-pointer h-full group"
          >
            <div className="flex items-start">
              <div className="bg-red-100 p-3 rounded-lg group-hover:bg-red-200 transition-colors">
                <Plus className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4 flex-1">
                <h4 className="font-semibold text-gray-900 text-lg mb-2">Create Conference</h4>
                <p className="text-sm text-gray-600 mb-3">Start a new live voice translation conference</p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Create conference rooms with real-time translation support
                </p>
              </div>
            </div>
          </div>

          <Link href={`/${locale}/conference`}>
            <div className="p-6 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-pointer h-full group">
              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <Video className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4 flex-1">
                  <h4 className="font-semibold text-gray-900 text-lg mb-2">Join Conference</h4>
                  <p className="text-sm text-gray-600 mb-3">Join an existing conference room</p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Enter a room code to join an active conference
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500">No recent activity</p>
          <p className="text-sm text-gray-400">Your conference activities will appear here</p>
        </div>
      </div>
    </>
  )

  const renderConferencesContent = () => (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Conferences</h1>
        <p className="text-gray-600">Manage your live translation conferences</p>
      </div>

      {/* Create Conference Button */}
      <div className="mb-8">
        <Button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3">
          <Plus className="w-5 h-5 mr-2" />
          Create New Conference
        </Button>
      </div>

      {/* Conferences List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Your Conferences</h3>
        
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Video className="w-10 h-10 text-gray-400" />
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">No conferences yet</h4>
          <p className="text-gray-500 mb-4">Create your first conference to get started</p>
          <Button className="bg-red-600 hover:bg-red-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Create Conference
          </Button>
        </div>
      </div>
    </>
  )

  const renderSettingsContent = () => (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account and preferences</p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Profile Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-gray-600" />
            Profile Settings
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input 
                type="text" 
                value={user?.full_name || ''} 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input 
                type="email" 
                value={user?.email || ''} 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Enter your email"
              />
            </div>
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              Save Changes
            </Button>
          </div>
        </div>

        {/* Language Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Globe className="w-5 h-5 mr-2 text-gray-600" />
            Language Preferences
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Default Language</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                <option value="en">English</option>
                <option value="vi">Tiếng Việt</option>
                <option value="ja">日本語</option>
              </select>
            </div>
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              Update Language
            </Button>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Bell className="w-5 h-5 mr-2 text-gray-600" />
            Notification Settings
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Email Notifications</p>
                <p className="text-sm text-gray-500">Receive updates about your conferences</p>
              </div>
              <input type="checkbox" className="w-4 h-4 text-red-600 rounded focus:ring-red-500" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Push Notifications</p>
                <p className="text-sm text-gray-500">Get notified about new messages</p>
              </div>
              <input type="checkbox" className="w-4 h-4 text-red-600 rounded focus:ring-red-500" defaultChecked />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-gray-600" />
            Security
          </h3>
          <div className="space-y-4">
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
              Change Password
            </Button>
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
              Two-Factor Authentication
            </Button>
          </div>
        </div>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-6">
            {/* Navigation Menu */}
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === 'dashboard' 
                    ? 'bg-red-50 text-red-700 font-medium' 
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <Home className="w-5 h-5" />
                <span>Dashboard</span>
              </button>
              
              <button
                onClick={() => setActiveTab('conferences')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === 'conferences' 
                    ? 'bg-red-50 text-red-700 font-medium' 
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <Video className="w-5 h-5" />
                <span>Conferences</span>
              </button>
              
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === 'settings' 
                    ? 'bg-red-50 text-red-700 font-medium' 
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {activeTab === 'dashboard' && renderDashboardContent()}
          {activeTab === 'conferences' && renderConferencesContent()}
          {activeTab === 'settings' && renderSettingsContent()}
        </div>
      </div>
    </div>
  )
} 