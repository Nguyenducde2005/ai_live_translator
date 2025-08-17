// Common types for the application
export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
  createdAt: Date
  updatedAt: Date
}

export interface Content {
  id: string
  title: string
  content: string
  type: 'message' | 'response' | 'template'
  authorId: string
  createdAt: Date
  updatedAt: Date
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
} 