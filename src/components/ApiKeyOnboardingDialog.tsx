import { useState } from 'react'
import { Key, ExternalLink, Sparkles, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { userApiKeyService } from '@/lib/user-api-key-service'

interface ApiKeyOnboardingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete: () => void
}

export function ApiKeyOnboardingDialog({ open, onOpenChange, onComplete }: ApiKeyOnboardingDialogProps) {
  const [apiKey, setApiKey] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const handleContinue = async () => {
    setError(null)
    setIsSaving(true)

    // Validate API key
    if (!apiKey.trim()) {
      setError('Please enter an API key to continue')
      setIsSaving(false)
      return
    }

    if (!userApiKeyService.validateApiKey(apiKey)) {
      setError('Invalid API key format. OpenRouter keys start with "sk-or-v1-"')
      setIsSaving(false)
      return
    }

    try {
      // Save API key
      userApiKeyService.saveApiKey(apiKey)
      
      // Close dialog
      onOpenChange(false)
      
      // Reset state
      setApiKey('')
      setError(null)
      
      // Trigger completion callback (folder selection)
      setTimeout(() => {
        onComplete()
      }, 100)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save API key')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSkip = () => {
    setApiKey('')
    setError(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-lime-600 dark:text-lime-400" />
            Welcome to Design OS!
          </DialogTitle>
          <DialogDescription>
            To use AI-powered features, you'll need an OpenRouter API key
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Welcome Message */}
          <div className="p-4 rounded-lg bg-lime-50 dark:bg-lime-900/20 border border-lime-200 dark:border-lime-800">
            <p className="text-sm text-lime-900 dark:text-lime-100">
              Design OS uses AI to help you create professional product documentation. 
              Add your OpenRouter API key to get started, or skip and add it later in Settings.
            </p>
          </div>

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
              <Label htmlFor="onboarding-api-key" className="flex items-center gap-2">
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
              id="onboarding-api-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && apiKey.trim()) {
                  handleContinue()
                }
              }}
              placeholder="sk-or-v1-..."
              className="w-full px-3 py-2 text-sm border border-stone-200 dark:border-stone-700 rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-400"
              autoFocus
            />
            
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Your API key is stored locally in your browser and never sent to our servers.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button 
              onClick={handleContinue} 
              className="flex-1"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Continue'}
            </Button>
            <Button 
              onClick={handleSkip} 
              variant="outline"
              disabled={isSaving}
            >
              Skip for Now
            </Button>
          </div>

          <p className="text-xs text-center text-stone-500 dark:text-stone-400">
            You can always add your API key later in Settings
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

