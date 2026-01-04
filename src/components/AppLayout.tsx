import type { ReactNode } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layers, ArrowLeft, FolderPlus } from 'lucide-react'
import { PhaseNav } from './PhaseNav'
import { ThemeToggle } from './ThemeToggle'
import { Button } from '@/components/ui/button'
import { fileSystemService } from '@/lib/file-system-service'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface AppLayoutProps {
  children: ReactNode
  /** Optional title shown in the header (for sub-pages) */
  title?: string
  /** Optional back navigation path */
  backTo?: string
  /** Optional back label */
  backLabel?: string
  /** Whether to show the phase nav (default: true) */
  showPhaseNav?: boolean
}

export function AppLayout({
  children,
  title,
  backTo,
  backLabel = 'Back',
  showPhaseNav = true,
}: AppLayoutProps) {
  const navigate = useNavigate()
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false)

  // Determine if this is a sub-page (has back navigation)
  const isSubPage = !!backTo

  const handleNewProject = async () => {
    // Clear the current directory access
    await fileSystemService.clearAccess()

    // Reload the page to reset everything
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-background animate-fade-in flex flex-col">
      {/* Header */}
      <header className="border-b border-stone-200 dark:border-stone-800 bg-card/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="px-4 sm:px-6 py-3">
          {isSubPage ? (
            /* Sub-page header with back button */
            <div className="max-w-3xl mx-auto flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(backTo)}
                className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 -ml-2"
              >
                <ArrowLeft className="w-4 h-4 mr-2" strokeWidth={1.5} />
                {backLabel}
              </Button>
              {title && (
                <>
                  <div className="h-4 w-px bg-stone-200 dark:bg-stone-700" />
                  <h1 className="text-sm font-medium text-stone-900 dark:text-stone-100 truncate">
                    {title}
                  </h1>
                </>
              )}
              <div className="ml-auto">
                <ThemeToggle />
              </div>
            </div>
          ) : (
            /* Main page header with phase nav - full width */
            <div className="flex items-center justify-between gap-4">
              {/* New Project Button */}
              <div className="shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNewProjectDialog(true)}
                  className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
                >
                  <FolderPlus className="w-4 h-4 mr-2" strokeWidth={1.5} />
                  <span className="hidden sm:inline">New Project</span>
                </Button>
              </div>

              {/* Phase Navigation - centered */}
              {showPhaseNav && (
                <div className="flex-1 flex justify-center">
                  <PhaseNav />
                </div>
              )}

              {/* Theme Toggle */}
              <div className="shrink-0 flex justify-end">
                <ThemeToggle />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-3xl mx-auto px-6 py-12 w-full">
        {children}
      </main>

      {/* Footer with logo */}
      <footer className="py-8 flex justify-center">
        <a
          href="https://unslop.design"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-400 transition-colors group"
        >
          <div className="w-5 h-5 rounded bg-gradient-to-br from-lime-400 to-lime-600 dark:from-lime-500 dark:to-lime-700 flex items-center justify-center transition-all group-hover:scale-110">
            <Layers className="w-3 h-3 text-white" strokeWidth={2} />
          </div>
          <span className="text-xs font-medium">Unslop AI</span>
        </a>
      </footer>

      {/* New Project Confirmation Dialog */}
      <AlertDialog open={showNewProjectDialog} onOpenChange={setShowNewProjectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Start a New Project?</AlertDialogTitle>
            <AlertDialogDescription>
              This will clear your current project selection and allow you to choose a new project directory.
              Your existing files will not be deleted, but you'll need to select the folder again to continue working on this project.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleNewProject}>
              Start New Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
