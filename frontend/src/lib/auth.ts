import { SignInRequest, SignUpRequest, AuthResponse, User } from '@/types/auth'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-slackbot.sgcharo.com'

// Cookie management
export const setCookie = (name: string, value: string, days: number = 7): void => {
  if (typeof window === 'undefined') return
  
  const expires = new Date()
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000))
  
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict${process.env.NODE_ENV === 'production' ? ';Secure' : ''}`
}

export const getCookie = (name: string): string | null => {
  if (typeof window === 'undefined') return null
  
  const nameEQ = name + "="
  const ca = document.cookie.split(';')
  
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

export const removeCookie = (name: string): void => {
  if (typeof window === 'undefined') return
  
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
}

// Token management
export const getToken = (): string | null => {
  return getCookie('access_token')
}

export const setToken = (token: string): void => {
  setCookie('access_token', token, 7) // 7 days
}

export const removeToken = (): void => {
  removeCookie('access_token')
}

export const getUser = (): User | null => {
  const userStr = getCookie('user')
  return userStr ? JSON.parse(userStr) : null
}

export const setUser = (user: User): void => {
  setCookie('user', JSON.stringify(user), 7) // 7 days
}

export const removeUser = (): void => {
  removeCookie('user')
}

// Auth API functions
export const signIn = async (credentials: SignInRequest): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Sign in failed')
  }

  const data: AuthResponse = await response.json()
  
  // Store token and user data in cookies
  setToken(data.access_token)
  setUser(data.user)
  
  return data
}

export const signUp = async (userData: SignUpRequest): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Sign up failed')
  }

  const data: AuthResponse = await response.json()
  
  // Store token and user data in cookies
  setToken(data.access_token)
  setUser(data.user)
  
  return data
}

export const signOut = (): void => {
  removeToken()
  removeUser()
}

export const isAuthenticated = (): boolean => {
  return getToken() !== null
}

// API request with auth header
export const authenticatedRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getToken()
  
  if (!token) {
    throw new Error('No authentication token')
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    if (response.status === 401) {
      signOut()
      throw new Error('Authentication expired')
    }
    const error = await response.json()
    throw new Error(error.message || 'Request failed')
  }

  return response.json()
} 