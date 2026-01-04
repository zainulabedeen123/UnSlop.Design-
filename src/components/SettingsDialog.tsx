import { useState, useEffect } from 'react'
import { Settings, Key, ExternalLink, Check, X } from 'lucide-react'
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

export function SettingsDialog() {
  const [open, setOpen] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [savedApiKey, setSavedApiKey] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load saved API key on mount
  useEffect(() => {
    const saved = userApiKeyService.getApiKey()
    setSavedApiKey(saved)
  }, [])

  const handleSave = () => {
    setError(null)
    setShowSuccess(false)

    // Validate API key
    if (!apiKey.trim()) {
      setError('Please enter an API key')
      return
    }

    if (!userApiKeyService.validateApiKey(apiKey)) {
      setError('Invalid API key format. OpenRouter keys start with "sk-or-v1-"')
      return
    }

    try {
      userApiKeyService.saveApiKey(apiKey)
      setSavedApiKey(apiKey)
      setApiKey('')
      setShowSuccess(true)
      
      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save API key')
    }
  }

  const handleClear = () => {
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
            Configure your OpenRouter API key to use AI features
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Current Status */}
          {savedApiKey && (
            <div className="p-4 rounded-lg bg-lime-50 dark:bg-lime-900/20 border border-lime-200 dark:border-lime-800">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-lime-600 dark:text-lime-400 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-lime-900 dark:text-lime-100">
                    API Key Configured
                  </p>
                  <p className="text-xs text-lime-700 dark:text-lime-300 mt-1 font-mono break-all">
                    {userApiKeyService.maskApiKey(savedApiKey)}
                  </p>
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
                  API key saved successfully!
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
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex-1">
              Save API Key
            </Button>
            {savedApiKey && (
              <Button onClick={handleClear} variant="outline">
                Clear
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

