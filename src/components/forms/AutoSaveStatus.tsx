import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { FolderOpen, Check, AlertCircle, Download } from 'lucide-react'
import { fileSystemService } from '@/lib/file-system-service'
import type { SaveResult } from '@/lib/file-system-service'

interface AutoSaveStatusProps {
  saveResult?: SaveResult | null
  onRequestAccess?: () => void
}

export function AutoSaveStatus({ saveResult, onRequestAccess }: AutoSaveStatusProps) {
  const [hasAccess, setHasAccess] = useState(false)
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    setIsSupported(fileSystemService.isFileSystemAccessSupported())
    setHasAccess(fileSystemService.hasDirectoryAccess())
  }, [])

  const handleRequestAccess = async () => {
    const granted = await fileSystemService.requestDirectoryAccess()
    setHasAccess(granted)
    onRequestAccess?.()
  }

  // Show save result if available
  if (saveResult) {
    return (
      <div className={`p-3 rounded-md border ${
        saveResult.success 
          ? 'bg-lime-50 dark:bg-lime-900/20 border-lime-200 dark:border-lime-800'
          : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
      }`}>
        <div className="flex items-start gap-2">
          {saveResult.success ? (
            <Check className="w-4 h-4 text-lime-600 dark:text-lime-400 mt-0.5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
          )}
          <div className="flex-1">
            <p className={`text-sm ${
              saveResult.success
                ? 'text-lime-700 dark:text-lime-300'
                : 'text-red-700 dark:text-red-300'
            }`}>
              {saveResult.message}
            </p>
            {saveResult.savedPath && (
              <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 font-mono">
                {saveResult.savedPath}
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Show access prompt if not supported or no access
  if (!isSupported) {
    return (
      <div className="p-3 bg-stone-50 dark:bg-stone-900 rounded-md border border-stone-200 dark:border-stone-700">
        <div className="flex items-start gap-2">
          <Download className="w-4 h-4 text-stone-600 dark:text-stone-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-stone-700 dark:text-stone-300">
              Auto-save not supported in this browser
            </p>
            <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
              Files will be downloaded instead. Use Chrome, Edge, or another Chromium-based browser for auto-save.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!hasAccess) {
    return (
      <div className="p-4 bg-lime-50 dark:bg-lime-900/20 rounded-md border border-lime-200 dark:border-lime-800">
        <div className="flex items-start gap-3">
          <FolderOpen className="w-5 h-5 text-lime-600 dark:text-lime-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1 space-y-3">
            <div>
              <p className="text-sm font-medium text-lime-900 dark:text-lime-100">
                Enable Auto-Save
              </p>
              <p className="text-xs text-lime-700 dark:text-lime-300 mt-1">
                Grant access to your project folder to automatically save generated files to the correct locations.
              </p>
            </div>
            <Button 
              onClick={handleRequestAccess}
              size="sm"
              className="w-full sm:w-auto"
            >
              <FolderOpen className="w-4 h-4 mr-2" />
              Choose Project Folder
            </Button>
            <p className="text-xs text-stone-600 dark:text-stone-400">
              You'll be prompted to select your Design OS project folder. Files will be saved automatically to the correct paths.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-3 bg-lime-50 dark:bg-lime-900/20 rounded-md border border-lime-200 dark:border-lime-800">
      <div className="flex items-center gap-2">
        <Check className="w-4 h-4 text-lime-600 dark:text-lime-400" />
        <p className="text-sm text-lime-700 dark:text-lime-300">
          Auto-save enabled - files will be saved automatically
        </p>
      </div>
    </div>
  )
}

