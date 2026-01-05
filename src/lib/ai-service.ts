import OpenAI from 'openai'
import { userApiKeyService } from './user-api-key-service'

const DEFAULT_MODEL = 'google/gemini-3-flash-preview'

interface AIGenerateOptions {
  prompt: string
  model?: string
  systemPrompt?: string
}

interface AIStreamOptions extends AIGenerateOptions {
  onChunk?: (chunk: string) => void
  onComplete?: (fullResponse: string) => void
  onError?: (error: Error) => void
}

class AIService {
  private client: OpenAI | null = null
  private apiKey: string | null = null

  constructor() {
    this.initializeClient()
  }

  /**
   * Initialize or reinitialize the OpenAI client with the current API key
   * Checks user's API key first, then falls back to environment variable
   */
  private initializeClient(): void {
    // Priority 1: User's API key from localStorage
    const userApiKey = userApiKeyService.getApiKey()

    // Priority 2: Default API key from environment
    const defaultApiKey = import.meta.env.VITE_OPENROUTER_API_KEY

    this.apiKey = userApiKey || defaultApiKey || null

    if (this.apiKey) {
      this.client = new OpenAI({
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey: this.apiKey,
        dangerouslyAllowBrowser: true, // Required for browser usage
      })
    } else {
      this.client = null
    }
  }

  /**
   * Check if AI service is configured with an API key
   */
  isConfigured(): boolean {
    // Reinitialize to check for updated user API key
    this.initializeClient()
    return !!this.apiKey && !!this.client
  }

  /**
   * Get the current API key source (user or default)
   */
  getApiKeySource(): 'user' | 'default' | 'none' {
    const userApiKey = userApiKeyService.getApiKey()
    if (userApiKey) return 'user'

    const defaultApiKey = import.meta.env.VITE_OPENROUTER_API_KEY
    if (defaultApiKey) return 'default'

    return 'none'
  }

  async generate({ prompt, model, systemPrompt }: AIGenerateOptions): Promise<string> {
    // Reinitialize to get latest API key
    this.initializeClient()

    if (!this.client) {
      throw new Error('OpenRouter API key not configured. Please add your API key in Settings or configure VITE_OPENROUTER_API_KEY in your .env file.')
    }

    // Determine which model to use (priority: explicit param > user preference > default)
    const modelToUse = model || userApiKeyService.getModel() || DEFAULT_MODEL

    const messages: Array<{ role: 'system' | 'user'; content: string }> = []

    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt })
    }

    messages.push({ role: 'user', content: prompt })

    try {
      // OpenRouter uses OpenAI SDK format
      const response = await this.client.chat.completions.create({
        model: modelToUse,
        messages,
      })

      return response.choices[0]?.message?.content || ''
    } catch (error) {
      console.error('AI generation error:', error)
      throw new Error(`Failed to generate content: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async *stream({ prompt, model, systemPrompt }: AIStreamOptions): AsyncGenerator<string> {
    // Reinitialize to get latest API key
    this.initializeClient()

    if (!this.client) {
      throw new Error('OpenRouter API key not configured. Please add your API key in Settings or configure VITE_OPENROUTER_API_KEY in your .env file.')
    }

    // Determine which model to use (priority: explicit param > user preference > default)
    const modelToUse = model || userApiKeyService.getModel() || DEFAULT_MODEL

    const messages: Array<{ role: 'system' | 'user'; content: string }> = []

    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt })
    }

    messages.push({ role: 'user', content: prompt })

    try {
      // OpenRouter uses OpenAI SDK format with streaming
      const stream = await this.client.chat.completions.create({
        model: modelToUse,
        messages,
        stream: true,
      })

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content
        if (content) {
          yield content
        }
      }
    } catch (error) {
      console.error('AI streaming error:', error)
      throw new Error(`Failed to stream content: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async streamToString({ prompt, model, systemPrompt, onChunk, onComplete, onError }: AIStreamOptions): Promise<string> {
    let fullResponse = ''

    try {
      for await (const chunk of this.stream({ prompt, model, systemPrompt })) {
        fullResponse += chunk
        onChunk?.(chunk)
      }
      onComplete?.(fullResponse)
      return fullResponse
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error')
      onError?.(err)
      throw err
    }
  }
}

export const aiService = new AIService()
export { DEFAULT_MODEL }

