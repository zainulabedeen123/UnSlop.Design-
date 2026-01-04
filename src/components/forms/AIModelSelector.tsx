import { Label } from '@/components/ui/label'

interface AIModelSelectorProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

const POPULAR_MODELS = [
  { id: 'google/gemini-3-flash-preview', name: 'Gemini 3 Flash Preview (Fast & Free)' },
  { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet' },
  { id: 'openai/gpt-4o', name: 'GPT-4o' },
  { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini' },
  { id: 'meta-llama/llama-3.3-70b-instruct', name: 'Llama 3.3 70B' },
]

export function AIModelSelector({ value, onChange, disabled }: AIModelSelectorProps) {
  const isCustomModel = !POPULAR_MODELS.some(m => m.id === value)

  return (
    <div className="space-y-2">
      <Label className="text-stone-700 dark:text-stone-300">AI Model</Label>
      <select
        value={isCustomModel ? 'custom' : value}
        onChange={(e) => {
          if (e.target.value !== 'custom') {
            onChange(e.target.value)
          }
        }}
        disabled={disabled}
        className="w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-md bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-600 disabled:opacity-50"
      >
        {POPULAR_MODELS.map(model => (
          <option key={model.id} value={model.id}>
            {model.name}
          </option>
        ))}
        <option value="custom">Custom Model ID...</option>
      </select>

      {isCustomModel && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter model ID (e.g., anthropic/claude-3.5-sonnet)"
          disabled={disabled}
          className="w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-md bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-600 disabled:opacity-50"
        />
      )}

      <p className="text-xs text-stone-500 dark:text-stone-400">
        Find more models at{' '}
        <a
          href="https://openrouter.ai/models"
          target="_blank"
          rel="noopener noreferrer"
          className="text-lime-600 dark:text-lime-400 hover:underline"
        >
          openrouter.ai/models
        </a>
      </p>
    </div>
  )
}

