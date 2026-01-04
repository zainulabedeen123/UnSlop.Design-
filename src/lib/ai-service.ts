import OpenAI from 'openai'

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
    this.apiKey = import.meta.env.VITE_OPENROUTER_API_KEY
    if (this.apiKey) {
      this.client = new OpenAI({
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey: this.apiKey,
        dangerouslyAllowBrowser: true, // Required for browser usage
      })
    }
  }

  isConfigured(): boolean {
    return !!this.apiKey && !!this.client
  }

  async generate({ prompt, model = DEFAULT_MODEL, systemPrompt }: AIGenerateOptions): Promise<string> {
    if (!this.client) {
      throw new Error('OpenRouter API key not configured. Please add VITE_OPENROUTER_API_KEY to your .env file.')
    }

    const messages: Array<{ role: 'system' | 'user'; content: string }> = []

    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt })
    }

    messages.push({ role: 'user', content: prompt })

    try {
      // OpenRouter uses OpenAI SDK format
      const response = await this.client.chat.completions.create({
        model,
        messages,
      })

      return response.choices[0]?.message?.content || ''
    } catch (error) {
      console.error('AI generation error:', error)
      throw new Error(`Failed to generate content: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async *stream({ prompt, model = DEFAULT_MODEL, systemPrompt }: AIStreamOptions): AsyncGenerator<string> {
    if (!this.client) {
      throw new Error('OpenRouter API key not configured. Please add VITE_OPENROUTER_API_KEY to your .env file.')
    }

    const messages: Array<{ role: 'system' | 'user'; content: string }> = []

    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt })
    }

    messages.push({ role: 'user', content: prompt })

    try {
      // OpenRouter uses OpenAI SDK format with streaming
      const stream = await this.client.chat.completions.create({
        model,
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

