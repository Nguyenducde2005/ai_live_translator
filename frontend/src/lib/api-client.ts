import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { SignInRequest, SignUpRequest, AuthResponse } from '@/types/auth'
import { getCookie, setAuthCookies, clearAuthCookies } from './cookies'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api-GiantyLive.sgcharo.com',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    })

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = getCookie('access_token')
        console.log('API Request - URL:', config.url)
        console.log('API Request - Token exists:', !!token)
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log('API Response - URL:', response.config.url, 'Status:', response.status)
        return response
      },
      (error) => {
        console.log('API Error - URL:', error.config?.url, 'Status:', error.response?.status, 'Message:', error.response?.data?.message)
        if (error.response?.status === 401) {
          // Clear cookies on 401
          clearAuthCookies()
          // Don't redirect automatically for auth pages
          if (!window.location.pathname.includes('/sign-in') && !window.location.pathname.includes('/sign-up')) {
            // Extract current locale from pathname
            const currentLocale = window.location.pathname.match(/^\/(vi|en|ja)/)?.[1] || 'en'
            window.location.href = `/${currentLocale}/sign-in`
          }
        }
        return Promise.reject(error)
      }
    )
  }

  // Auth methods
  async signIn(credentials: SignInRequest): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/api/v1/auth/signin', credentials)
    return response.data
  }

  async signUp(userData: SignUpRequest): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/api/v1/auth/signup', userData)
    return response.data
  }

  // Generic methods
  async get<T>(url: string): Promise<T> {
    const response = await this.client.get<T>(url)
    return response.data
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.post<T>(url, data)
    return response.data
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.put<T>(url, data)
    return response.data
  }

  async patch<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.patch<T>(url, data)
    return response.data
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete<T>(url)
    return response.data
  }
}

// Export singleton instance
export const apiClient = new ApiClient() 