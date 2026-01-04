/**
 * Service for managing user's OpenRouter API key in localStorage
 */

const STORAGE_KEY = 'unslop_user_openrouter_api_key'

export const userApiKeyService = {
  /**
   * Save the user's OpenRouter API key to localStorage
   */
  saveApiKey(apiKey: string): void {
    try {
      localStorage.setItem(STORAGE_KEY, apiKey)
    } catch (error) {
      console.error('Failed to save API key:', error)
      throw new Error('Failed to save API key to browser storage')
    }
  },

  /**
   * Get the user's OpenRouter API key from localStorage
   */
  getApiKey(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEY)
    } catch (error) {
      console.error('Failed to get API key:', error)
      return null
    }
  },

  /**
   * Clear the user's OpenRouter API key from localStorage
   */
  clearApiKey(): void {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error('Failed to clear API key:', error)
      throw new Error('Failed to clear API key from browser storage')
    }
  },

  /**
   * Check if the user has saved an API key
   */
  hasApiKey(): boolean {
    return this.getApiKey() !== null
  },

  /**
   * Validate API key format (basic validation)
   */
  validateApiKey(apiKey: string): boolean {
    // OpenRouter API keys typically start with 'sk-or-v1-'
    return apiKey.trim().length > 0 && apiKey.startsWith('sk-or-v1-')
  },

  /**
   * Mask API key for display (show first 12 and last 4 characters)
   */
  maskApiKey(apiKey: string): string {
    if (apiKey.length < 20) {
      return '••••••••••••'
    }
    const start = apiKey.substring(0, 12)
    const end = apiKey.substring(apiKey.length - 4)
    return `${start}••••••••${end}`
  },
}

