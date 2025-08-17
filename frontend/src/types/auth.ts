export interface SignInRequest {
  email: string
  password: string
}

export interface SignUpRequest {
  email: string
  password: string
  full_name?: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
  user: {
    id: number
    email: string
    username: string
    full_name: string
    is_active: boolean
    is_superuser: boolean
    created_at: string
    updated_at?: string
    avatar_url?: string
    language_preference: string
    timezone?: string
  }
}

export interface User {
  id: number
  email: string
  username: string
  full_name: string
  is_active: boolean
  is_superuser: boolean
  created_at: string
  updated_at?: string
  avatar_url?: string
  language_preference: string
  timezone?: string
}

export interface AuthError {
  message: string
  statusCode?: number
} 