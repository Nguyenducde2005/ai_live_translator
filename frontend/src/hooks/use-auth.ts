'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { apiClient } from '@/lib/api-client'
import { getAuthData, setAuthCookies, clearAuthCookies } from '@/lib/cookies'

import { User } from '@/types/auth'
import { SignInRequest, SignUpRequest } from '@/types/auth'

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

interface UseAuthReturn extends AuthState {
  login: (credentials: SignInRequest) => Promise<void>
  register: (userData: SignUpRequest) => Promise<void>
  logout: () => void
  error: string | null
  clearError: () => void
}

export function useAuth(): UseAuthReturn {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  })
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const locale = useLocale()

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      // Get auth data from cookies
      const { user, token } = getAuthData()
      const authenticated = !!(user && token)
      
      console.log('Auth init - user from cookie:', user)
      console.log('Auth init - user avatar_url:', user?.avatar_url || 'missing')
      console.log('Auth init - token from cookie:', token ? 'exists' : 'missing')
      console.log('Auth init - authenticated:', authenticated)
      
      if (authenticated) {
        try {
          // Refresh user data from backend to get latest locale
          const updatedUser = await apiClient.get('/api/v1/auth/me') as any
          console.log('Auth init - refreshed user from backend:', updatedUser)
          
          // Update cookies with fresh user data
          setAuthCookies(token, updatedUser)
          
          setState({
            user: updatedUser,
            isLoading: false,
            isAuthenticated: true,
          })
        } catch (error) {
          console.log('Auth init - failed to refresh user, using cookie data')
          setState({
            user,
            isLoading: false,
            isAuthenticated: authenticated,
          })
        }
      } else {
        setState({
          user,
          isLoading: false,
          isAuthenticated: authenticated,
        })
      }
    }

    initAuth()
  }, [])

  const login = useCallback(async (credentials: SignInRequest) => {
    try {
      setError(null)
      setState(prev => ({ ...prev, isLoading: true }))
      
      const data = await apiClient.signIn(credentials)

      // Store auth data in cookies
      setAuthCookies(data.access_token, data.user)
      
      setState({
        user: data.user,
        isLoading: false,
        isAuthenticated: true,
      })
      
      router.push(`/${locale}`) // Redirect to home page with current locale
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Login failed')
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [router, locale])

  const register = useCallback(async (userData: SignUpRequest) => {
    try {
      setError(null)
      setState(prev => ({ ...prev, isLoading: true }))
      
      // First register the user
      const registerData = await apiClient.signUp(userData)
      
      // Then automatically login with the same credentials
      const loginData = await apiClient.signIn({
        email: userData.email,
        password: userData.password
      })

      // Store auth data in cookies
      setAuthCookies(loginData.access_token, loginData.user)
      
      setState({
        user: loginData.user,
        isLoading: false,
        isAuthenticated: true,
      })
      
      router.push(`/${locale}`) // Redirect to home page with current locale
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Registration failed')
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [router, locale])

  const logout = useCallback(async () => {
    // Clear cookies
    clearAuthCookies()
    
    setState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    })
    
    // Force reload to clear any cached state
    window.location.href = `/${locale}`
  }, [locale])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    ...state,
    login,
    register,
    logout,
    error,
    clearError,
  }
} 