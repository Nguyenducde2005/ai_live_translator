'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Save, Building2, Key, Shield, Bot, Sparkles, AlertCircle, CheckCircle, ExternalLink, Info, Eye, EyeOff, Copy, Check } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api-client'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { DashboardHeader } from '@/components/ui/dashboard-header'

interface CreateSlackAppForm {
  workspace_name: string
  slack_token: string
  signing_secret: string
  openai_token: string
  app_id: string
  verification_token: string
  status?: string
}

interface FormErrors {
  [key: string]: string
}

export default function CreateSlackAppPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [formData, setFormData] = useState<CreateSlackAppForm>({
    workspace_name: '',
    slack_token: '',
    signing_secret: '',
    openai_token: '',
    app_id: '',
    verification_token: '',
    status: 'active'
  })

  // State for password visibility
  const [showPasswords, setShowPasswords] = useState<{[key: string]: boolean}>({
    signing_secret: false,
    verification_token: false,
    slack_token: false,
    openai_token: false
  })

  // State for copy feedback
  const [copiedFields, setCopiedFields] = useState<{[key: string]: boolean}>({
    signing_secret: false,
    verification_token: false,
    slack_token: false,
    openai_token: false
  })

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.workspace_name.trim()) {
      newErrors.workspace_name = 'Slack app name is required'
    }

    if (!formData.app_id.trim()) {
      newErrors.app_id = 'App ID is required'
    } else if (!formData.app_id.startsWith('A')) {
      newErrors.app_id = 'App ID should start with "A"'
    }

    if (!formData.slack_token.trim()) {
      newErrors.slack_token = 'Slack Bot Token is required'
    } else if (!formData.slack_token.startsWith('xoxb-')) {
      newErrors.slack_token = 'Slack Bot Token should start with "xoxb-"'
    }

    if (!formData.signing_secret.trim()) {
      newErrors.signing_secret = 'Signing Secret is required'
    }

    if (!formData.verification_token.trim()) {
      newErrors.verification_token = 'Verification Token is required'
    }

    if (!formData.openai_token.trim()) {
      newErrors.openai_token = 'OpenAI Token is required'
    } else if (!formData.openai_token.startsWith('sk-')) {
      newErrors.openai_token = 'OpenAI Token should start with "sk-"'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // Show check mark for 2 seconds
      setCopiedFields(prev => ({
        ...prev,
        [field]: true
      }))
      setTimeout(() => {
        setCopiedFields(prev => ({
          ...prev,
          [field]: false
        }))
      }, 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      await apiClient.post('/workspaces', formData)
      setSuccess(true)
      setTimeout(() => {
        router.push('/dashboard/workspaces')
      }, 1500)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to connect Slack app')
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader showDashboardButton={true} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Breadcrumb items={[
          { label: 'Slack Apps', href: '/dashboard/workspaces' },
          { label: 'Connect Slack App' }
        ]} />

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            Slack app connected successfully! Redirecting...
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                     {/* Header */}
           <div className="px-6 py-4 border-b border-gray-200">
             <div className="flex items-center justify-between">
               <div className="flex items-center space-x-3">
                 <div>
                   <h1 className="text-2xl font-bold text-gray-900">Connect Slack App</h1>
                   <p className="text-gray-600">Connect your existing Slack app for translation bot</p>
                 </div>
               </div>
             </div>
           </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-8">
              
              {/* Section 1: Basic Information */}
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <Building2 className="w-6 h-6 text-blue-600" />
                    <h3 className="text-xl font-semibold text-gray-900">1. Basic Information</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <a 
                      href="https://api.slack.com/apps/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Slack Apps
                    </a>
                    <button
                      type="button"
                      className="flex items-center text-gray-500 hover:text-gray-700 text-sm"
                                             onClick={() => {
                         // Show guidance image for Basic Information
                         const backdrop = document.createElement('div')
                         backdrop.style.position = 'fixed'
                         backdrop.style.top = '0'
                         backdrop.style.left = '0'
                         backdrop.style.width = '100vw'
                         backdrop.style.height = '100vh'
                         backdrop.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'
                         backdrop.style.zIndex = '9998'
                         backdrop.style.cursor = 'pointer'
                         
                         const img = new Image()
                         img.src = '/static/configution_app/config1.png'
                         img.style.position = 'fixed'
                         img.style.top = '50%'
                         img.style.left = '50%'
                         img.style.transform = 'translate(-50%, -50%)'
                         img.style.maxWidth = '90vw'
                         img.style.maxHeight = '90vh'
                         img.style.zIndex = '9999'
                         img.style.cursor = 'pointer'
                         img.style.borderRadius = '8px'
                         img.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                         
                         const closeModal = () => {
                           document.body.removeChild(backdrop)
                           document.body.removeChild(img)
                         }
                         
                         backdrop.onclick = closeModal
                         img.onclick = (e) => {
                           e.stopPropagation()
                           closeModal()
                         }
                         
                         document.body.appendChild(backdrop)
                         document.body.appendChild(img)
                       }}
                    >
                      <Info className="w-4 h-4 mr-1" />
                      How to get
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="workspace_name" className="block text-sm font-medium text-gray-700 mb-2">
                      App Name *
                    </label>
                    <input
                      type="text"
                      id="workspace_name"
                      name="workspace_name"
                      value={formData.workspace_name}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.workspace_name ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Custom Slack App name"
                    />
                    {errors.workspace_name && (
                      <p className="text-red-600 text-sm mt-1">{errors.workspace_name}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="app_id" className="block text-sm font-medium text-gray-700 mb-2">
                      App ID *
                    </label>
                    <input
                      type="text"
                      id="app_id"
                      name="app_id"
                      value={formData.app_id}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.app_id ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="A1234567890"
                    />
                    {errors.app_id && (
                      <p className="text-red-600 text-sm mt-1">{errors.app_id}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="signing_secret" className="block text-sm font-medium text-gray-700 mb-2">
                      Signing Secret *
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.signing_secret ? "text" : "password"}
                        id="signing_secret"
                        name="signing_secret"
                        value={formData.signing_secret}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 pr-20 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.signing_secret ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="your-signing-secret"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-2">
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('signing_secret')}
                          className="p-1 text-gray-500 hover:text-gray-700"
                        >
                          {showPasswords.signing_secret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                                                 {formData.signing_secret && (
                           <button
                             type="button"
                             onClick={() => copyToClipboard(formData.signing_secret, 'signing_secret')}
                             className="p-1 text-gray-500 hover:text-gray-700"
                           >
                             {copiedFields.signing_secret ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                           </button>
                         )}
                      </div>
                    </div>
                    {errors.signing_secret && (
                      <p className="text-red-600 text-sm mt-1">{errors.signing_secret}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="verification_token" className="block text-sm font-medium text-gray-700 mb-2">
                      Verification Token *
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.verification_token ? "text" : "password"}
                        id="verification_token"
                        name="verification_token"
                        value={formData.verification_token}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 pr-20 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.verification_token ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="your-verification-token"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-2">
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('verification_token')}
                          className="p-1 text-gray-500 hover:text-gray-700"
                        >
                          {showPasswords.verification_token ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                                                 {formData.verification_token && (
                           <button
                             type="button"
                             onClick={() => copyToClipboard(formData.verification_token, 'verification_token')}
                             className="p-1 text-gray-500 hover:text-gray-700"
                           >
                             {copiedFields.verification_token ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                           </button>
                         )}
                      </div>
                    </div>
                    {errors.verification_token && (
                      <p className="text-red-600 text-sm mt-1">{errors.verification_token}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 2: OAuth & Permissions */}
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-6 h-6 text-green-600" />
                    <h3 className="text-xl font-semibold text-gray-900">2. OAuth & Permissions</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <a 
                      href="https://api.slack.com/apps/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Slack Apps
                    </a>
                    <button
                      type="button"
                      className="flex items-center text-gray-500 hover:text-gray-700 text-sm"
                                             onClick={() => {
                         // Show guidance image for OAuth & Permissions
                         const backdrop = document.createElement('div')
                         backdrop.style.position = 'fixed'
                         backdrop.style.top = '0'
                         backdrop.style.left = '0'
                         backdrop.style.width = '100vw'
                         backdrop.style.height = '100vh'
                         backdrop.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'
                         backdrop.style.zIndex = '9998'
                         backdrop.style.cursor = 'pointer'
                         
                         const img = new Image()
                         img.src = '/static/configution_app/config2.png'
                         img.style.position = 'fixed'
                         img.style.top = '50%'
                         img.style.left = '50%'
                         img.style.transform = 'translate(-50%, -50%)'
                         img.style.maxWidth = '90vw'
                         img.style.maxHeight = '90vh'
                         img.style.zIndex = '9999'
                         img.style.cursor = 'pointer'
                         img.style.borderRadius = '8px'
                         img.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                         
                         const closeModal = () => {
                           document.body.removeChild(backdrop)
                           document.body.removeChild(img)
                         }
                         
                         backdrop.onclick = closeModal
                         img.onclick = (e) => {
                           e.stopPropagation()
                           closeModal()
                         }
                         
                         document.body.appendChild(backdrop)
                         document.body.appendChild(img)
                       }}
                    >
                      <Info className="w-4 h-4 mr-1" />
                      How to get
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label htmlFor="slack_token" className="block text-sm font-medium text-gray-700 mb-2">
                      Bot User OAuth Token *
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.slack_token ? "text" : "password"}
                        id="slack_token"
                        name="slack_token"
                        value={formData.slack_token}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 pr-20 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.slack_token ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="xoxb-your-bot-token"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-2">
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('slack_token')}
                          className="p-1 text-gray-500 hover:text-gray-700"
                        >
                          {showPasswords.slack_token ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                                                 {formData.slack_token && (
                           <button
                             type="button"
                             onClick={() => copyToClipboard(formData.slack_token, 'slack_token')}
                             className="p-1 text-gray-500 hover:text-gray-700"
                           >
                             {copiedFields.slack_token ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                           </button>
                         )}
                      </div>
                    </div>
                    {errors.slack_token && (
                      <p className="text-red-600 text-sm mt-1">{errors.slack_token}</p>
                    )}
                    <p className="text-gray-500 text-xs mt-1">Found in your Slack App settings under "OAuth & Permissions" → "Bot User OAuth Token"</p>
                  </div>
                </div>
              </div>

              {/* Section 3: OpenAI API Key Configuration */}
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <Sparkles className="w-6 h-6 text-purple-600" />
                    <h3 className="text-xl font-semibold text-gray-900">3. OpenAI API Key Configuration</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <a 
                      href="https://platform.openai.com/api-keys" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      OpenAI Platform
                    </a>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label htmlFor="openai_token" className="block text-sm font-medium text-gray-700 mb-2">
                      OpenAI API Key *
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.openai_token ? "text" : "password"}
                        id="openai_token"
                        name="openai_token"
                        value={formData.openai_token}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 pr-20 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.openai_token ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="sk-your-openai-api-key"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-2">
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('openai_token')}
                          className="p-1 text-gray-500 hover:text-gray-700"
                        >
                          {showPasswords.openai_token ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                                                 {formData.openai_token && (
                           <button
                             type="button"
                             onClick={() => copyToClipboard(formData.openai_token, 'openai_token')}
                             className="p-1 text-gray-500 hover:text-gray-700"
                           >
                             {copiedFields.openai_token ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                           </button>
                         )}
                      </div>
                    </div>
                    {errors.openai_token && (
                      <p className="text-red-600 text-sm mt-1">{errors.openai_token}</p>
                    )}
                    <p className="text-gray-500 text-xs mt-1">Get your API key from OpenAI Platform → API Keys</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 mt-8">
              <Link href="/dashboard/workspaces">
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-purple-700 hover:bg-purple-800 text-white flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{isLoading ? 'Connecting Slack App...' : 'Connect Slack App'}</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 