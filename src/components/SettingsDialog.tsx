import { useState, useEffect } from 'react'
import { Settings, Key, ExternalLink, Check, X, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { userApiKeyService } from '@/lib/user-api-key-service'
import { DEFAULT_MODEL } from '@/lib/ai-service'

export function SettingsDialog() {
  const [open, setOpen] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [savedApiKey, setSavedApiKey] = useState<string | null>(null)
  const [modelId, setModelId] = useState('')
  const [savedModel, setSavedModel] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load saved settings on mount and when dialog opens
  useEffect(() => {
    if (open) {
      const savedKey = userApiKeyService.getApiKey()
      const savedModelPref = userApiKeyService.getModel()
      setSavedApiKey(savedKey)
      setSavedModel(savedModelPref)
    }
  }, [open])

  const handleSave = () => {
    setError(null)
    setShowSuccess(false)

    // Validate API key if provided
    if (apiKey.trim()) {
      if (!userApiKeyService.validateApiKey(apiKey)) {
        setError('Invalid API key format. OpenRouter keys start with "sk-or-v1-"')
        return
      }
    }

    try {
      // Save API key if provided
      if (apiKey.trim()) {
        userApiKeyService.saveApiKey(apiKey)
        setSavedApiKey(apiKey)
        setApiKey('')
      }

      // Save model preference if provided
      if (modelId.trim()) {
        userApiKeyService.saveModel(modelId)
        setSavedModel(modelId)
        setModelId('')
      }

      setShowSuccess(true)

      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings')
    }
  }

  const handleClearApiKey = () => {
    try {
      userApiKeyService.clearApiKey()
      setSavedApiKey(null)
      setApiKey('')
      setError(null)
      setShowSuccess(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear API key')
    }
  }

  const handleClearModel = () => {
    try {
      userApiKeyService.clearModel()
      setSavedModel(null)
      setModelId('')
      setError(null)
      setShowSuccess(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear model preference')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
        >
          <Settings className="w-4 h-4" strokeWidth={1.5} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Settings
          </DialogTitle>
          <DialogDescription>
            Configure your OpenRouter API key and AI model preferences
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Current Status */}
          {(savedApiKey || savedModel) && (
            <div className="p-4 rounded-lg bg-lime-50 dark:bg-lime-900/20 border border-lime-200 dark:border-lime-800">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-lime-600 dark:text-lime-400 mt-0.5" />
                <div className="flex-1 min-w-0 space-y-2">
                  {savedApiKey && (
                    <div>
                      <p className="text-sm font-medium text-lime-900 dark:text-lime-100">
                        API Key Configured
                      </p>
                      <p className="text-xs text-lime-700 dark:text-lime-300 mt-1 font-mono break-all">
                        {userApiKeyService.maskApiKey(savedApiKey)}
                      </p>
                    </div>
                  )}
                  {savedModel && (
                    <div>
                      <p className="text-sm font-medium text-lime-900 dark:text-lime-100">
                        Custom Model Set
                      </p>
                      <p className="text-xs text-lime-700 dark:text-lime-300 mt-1 font-mono break-all">
                        {savedModel}
                      </p>
                    </div>
                  )}
                  {!savedModel && (
                    <div>
                      <p className="text-sm font-medium text-lime-900 dark:text-lime-100">
                        Using Default Model
                      </p>
                      <p className="text-xs text-lime-700 dark:text-lime-300 mt-1 font-mono break-all">
                        {DEFAULT_MODEL}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {showSuccess && (
            <div className="p-4 rounded-lg bg-lime-50 dark:bg-lime-900/20 border border-lime-200 dark:border-lime-800">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                <p className="text-sm text-lime-900 dark:text-lime-100">
                  Settings saved successfully!
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-2">
                <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                <p className="text-sm text-red-900 dark:text-red-100">{error}</p>
              </div>
            </div>
          )}

          {/* API Key Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="api-key" className="flex items-center gap-2">
                <Key className="w-4 h-4" />
                OpenRouter API Key
              </Label>
              <a
                href="https://openrouter.ai/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-lime-600 dark:text-lime-400 hover:underline flex items-center gap-1"
              >
                Get API Key
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            
            <input
              id="api-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-or-v1-..."
              className="w-full px-3 py-2 text-sm border border-stone-200 dark:border-stone-700 rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-400"
            />
            
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Your API key is stored locally in your browser and never sent to our servers.
            </p>

            {savedApiKey && (
              <Button onClick={handleClearApiKey} variant="outline" size="sm" className="w-full">
                Clear API Key
              </Button>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-stone-200 dark:border-stone-700" />

          {/* AI Model Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="model-id" className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                AI Model Preference
              </Label>
              <a
                href="https://openrouter.ai/models"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-lime-600 dark:text-lime-400 hover:underline flex items-center gap-1"
              >
                Browse Models
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <input
              id="model-id"
              type="text"
              value={modelId}
              onChange={(e) => setModelId(e.target.value)}
              placeholder={`Default: ${DEFAULT_MODEL}`}
              className="w-full px-3 py-2 text-sm border border-stone-200 dark:border-stone-700 rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-400"
            />

            <div className="space-y-2">
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Enter a custom model ID from OpenRouter. Leave empty to use the default model.
              </p>
              <div className="text-xs text-stone-500 dark:text-stone-400">
                <p className="font-medium mb-1">Popular models:</p>
                <ul className="space-y-0.5 ml-4">
                  <li>• <code className="text-xs">google/gemini-flash-1.5</code> (Fast & Free)</li>
                  <li>• <code className="text-xs">anthropic/claude-3.5-sonnet</code> (High Quality)</li>
                  <li>• <code className="text-xs">openai/gpt-4o</code> (OpenAI Latest)</li>
                  <li>• <code className="text-xs">meta-llama/llama-3.1-70b-instruct</code> (Open Source)</li>
                </ul>
              </div>
            </div>

            {savedModel && (
              <Button onClick={handleClearModel} variant="outline" size="sm" className="w-full">
                Reset to Default Model
              </Button>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex-1">
              Save Settings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

