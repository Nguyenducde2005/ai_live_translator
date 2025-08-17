import Cookies from 'js-cookie'

const COOKIE_OPTIONS = {
  expires: 7, // 7 days
  // secure: process.env.NODE_ENV === 'production',
  // sameSite: 'strict' as const,
  path: '/',
}

export const setCookie = (name: string, value: string) => {
  Cookies.set(name, value, COOKIE_OPTIONS)
}

export const getCookie = (name: string): string | undefined => {
  return Cookies.get(name)
}

export const removeCookie = (name: string) => {
  Cookies.remove(name, { path: '/' })
}

export const setAuthCookies = (token: string, user: any) => {
  console.log('setAuthCookies - Token:', token ? 'exists' : 'missing')
  console.log('setAuthCookies - User:', user)
  console.log('setAuthCookies - User avatar_url:', user?.avatar_url || 'missing')
  console.log('setAuthCookies - Setting cookies...')

  setCookie('access_token', token)
  setCookie('user', JSON.stringify(user))
  
  // Set NEXT_LOCALE cookie if user has locale preference
  if (user?.locale) {
    setCookie('NEXT_LOCALE', user.locale)
    console.log('setAuthCookies - Set NEXT_LOCALE cookie:', user.locale)
  }
  
  console.log('setAuthCookies - Cookies set successfully')
  console.log('setAuthCookies - access_token cookie:', getCookie('access_token') ? 'exists' : 'missing')
  console.log('setAuthCookies - user cookie:', getCookie('user') ? 'exists' : 'missing')
  console.log('setAuthCookies - NEXT_LOCALE cookie:', getCookie('NEXT_LOCALE') || 'missing')
}

export const clearAuthCookies = () => {
  removeCookie('access_token')
  removeCookie('user')
  removeCookie('NEXT_LOCALE')
  
  // Clear additional cookies that might be set by OAuth
  removeCookie('g_state')
  removeCookie('G_AUTHUSER_H')
  removeCookie('SID')
  removeCookie('HSID')
  removeCookie('SSID')
  removeCookie('APISID')
  removeCookie('SAPISID')
  removeCookie('__Secure-1PSID')
  removeCookie('__Secure-3PSID')
  removeCookie('__Secure-1PAPISID')
  removeCookie('__Secure-3PAPISID')
  
  console.log('clearAuthCookies - All auth cookies cleared')
}

export const getAuthData = () => {
  const token = getCookie('access_token')
  const userStr = getCookie('user')
  
  let user = null
  if (userStr && userStr !== 'undefined') {
    try {
      user = JSON.parse(userStr)
    } catch (error) {
      console.error('Error parsing user cookie:', error)
      // If parsing fails, clear the corrupted cookie
      removeCookie('user')
    }
  }
  
  return { token, user }
} 