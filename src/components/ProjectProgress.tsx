/**
 * Project Progress Component
 * Shows visual progress indicator for project completion
 */

import { Check, Circle } from 'lucide-react'
import { useProjectState } from '@/hooks/useProjectState'

interface ProgressStepProps {
  label: string
  isComplete: boolean
  isOptional?: boolean
}

function ProgressStep({ label, isComplete, isOptional = false }: ProgressStepProps) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-5 h-5 rounded-full flex items-center justify-center ${
          isComplete
            ? 'bg-lime-100 dark:bg-lime-900/30'
            : 'bg-stone-100 dark:bg-stone-800'
        }`}
      >
        {isComplete ? (
          <Check className="w-3 h-3 text-lime-600 dark:text-lime-400" strokeWidth={2.5} />
        ) : (
          <Circle className="w-3 h-3 text-stone-400 dark:text-stone-600" strokeWidth={2} />
        )}
      </div>
      <span
        className={`text-sm ${
          isComplete
            ? 'text-stone-900 dark:text-stone-100'
            : 'text-stone-500 dark:text-stone-400'
        }`}
      >
        {label}
        {isOptional && (
          <span className="text-xs text-stone-400 dark:text-stone-500 ml-1">(optional)</span>
        )}
      </span>
    </div>
  )
}

export function ProjectProgress() {
  const state = useProjectState()

  const requiredSteps = [
    { label: 'Product Overview', isComplete: state.hasProductOverview },
    { label: 'Product Roadmap', isComplete: state.hasProductRoadmap },
  ]

  const optionalSteps = [
    { label: 'Data Model', isComplete: state.hasDataModel },
    { label: 'Design System', isComplete: state.hasDesignSystem },
    { label: 'Application Shell', isComplete: state.hasShell },
  ]

  const sectionsWithScreenDesigns = Object.values(state.sections).filter(
    s => s.hasScreenDesigns
  ).length
  const totalSections = Object.keys(state.sections).length

  const requiredComplete = requiredSteps.every(s => s.isComplete)
  const hasSections = sectionsWithScreenDesigns > 0
  const readyForExport = requiredComplete && hasSections

  const completedCount =
    requiredSteps.filter(s => s.isComplete).length +
    optionalSteps.filter(s => s.isComplete).length +
    (hasSections ? 1 : 0)
  const totalCount = requiredSteps.length + optionalSteps.length + 1

  const progressPercentage = Math.round((completedCount / totalCount) * 100)

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-stone-600 dark:text-stone-400">Project Progress</span>
          <span className="font-medium text-stone-900 dark:text-stone-100">
            {progressPercentage}%
          </span>
        </div>
        <div className="h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-lime-500 dark:bg-lime-600 transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide">
          Required
        </div>
        {requiredSteps.map(step => (
          <ProgressStep key={step.label} {...step} />
        ))}
        <ProgressStep
          label={`Sections with screen designs (${sectionsWithScreenDesigns}/${totalSections || '0'})`}
          isComplete={hasSections}
        />

        <div className="text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide mt-4">
          Optional
        </div>
        {optionalSteps.map(step => (
          <ProgressStep key={step.label} {...step} isOptional />
        ))}
      </div>

      {/* Status message */}
      {readyForExport && (
        <div className="mt-4 p-3 bg-lime-50 dark:bg-lime-900/20 border border-lime-200 dark:border-lime-800 rounded-lg">
          <p className="text-sm text-lime-900 dark:text-lime-100 font-medium">
            ✓ Ready to export!
          </p>
          <p className="text-xs text-lime-700 dark:text-lime-300 mt-1">
            Visit the Export page to generate your handoff package.
          </p>
        </div>
      )}
    </div>
  )
}

