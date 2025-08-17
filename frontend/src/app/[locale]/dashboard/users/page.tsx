'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, User, Mail, Shield, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { apiClient } from '@/lib/api-client'
import { isAdmin } from '@/lib/constants/roles'

interface User {
  id: string
  name: string
  email: string
  role: string
  created_at: string
}

export default function UsersPage() {
  const { user } = useAuth()
  const locale = useLocale()
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [accessDenied, setAccessDenied] = useState(false)

  useEffect(() => {
    console.log('User in useEffect:', user)
    console.log('User role:', user?.role)
    console.log('Is admin:', user?.role ? isAdmin(user.role) : false)
    
    if (!user?.role || !isAdmin(user.role)) {
      setAccessDenied(true)
      return
    }

    // Clear any previous errors when user is admin and fetch users
    setAccessDenied(false)
    setError('')
    setIsLoading(true)
    fetchUsers()
  }, [user])

  // Debug error state
  useEffect(() => {
    console.log('Error state changed:', error)
  }, [error])

  const fetchUsers = async () => {
    try {
      console.log('Fetching users...')
      const response = await apiClient.get<User[]>('/users')
      console.log('Users response:', response)
      // Filter out current user
      const filteredUsers = response.filter(u => u.id !== user?.id)
      setUsers(filteredUsers)
      setError('') // Clear any previous errors on success
    } catch (err: any) {
      console.error('Error fetching users:', err)
      setError(err.response?.data?.message || 'Failed to fetch users')
    } finally {
      setIsLoading(false)
    }
  }

  // Check if user is admin - if not, show access denied page
  if (accessDenied) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You need admin privileges to view this page.</p>
          <Link href={`/${locale}/dashboard`}>
            <Button className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href={`/${locale}/dashboard`}>
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
                <p className="text-gray-600">Manage all users in the system</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">Error: {error}</p>
            <p className="text-sm text-red-600 mt-1">Debug: User role = {user?.role}, Is admin = {user?.role ? isAdmin(user.role) : 'unknown'}</p>
            <p className="text-sm text-red-600">Error length: {error.length}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-lg">
                  <User className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Regular Users</p>
                                     <p className="text-2xl font-bold text-gray-900">
                     {users.filter(u => u.role && !isAdmin(u.role)).length}
                   </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Admins</p>
                                     <p className="text-2xl font-bold text-gray-900">
                     {users.filter(u => u.role && isAdmin(u.role)).length}
                   </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>
              Manage user accounts and permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((userItem) => (
                <div key={userItem.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gray-100 p-3 rounded-full">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{userItem.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <p className="text-sm text-gray-600">{userItem.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                                         <Badge variant={userItem.role && isAdmin(userItem.role) ? 'default' : 'secondary'}>
                       {userItem.role}
                     </Badge>
                    <p className="text-sm text-gray-500">
                      Joined {new Date(userItem.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 