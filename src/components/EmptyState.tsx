import { useState, useEffect } from 'react'
import { FileText, Map, ClipboardList, Database, Layout, Package, Boxes, Palette, PanelLeft, Sparkles } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ProductVisionForm } from '@/components/forms/ProductVisionForm'
import { ProductRoadmapForm } from '@/components/forms/ProductRoadmapForm'
import { DataModelForm } from '@/components/forms/DataModelForm'
import { DesignTokensForm } from '@/components/forms/DesignTokensForm'
import { ShellSpecForm } from '@/components/forms/ShellSpecForm'
import { aiService } from '@/lib/ai-service'
import { productContextService } from '@/lib/product-context-service'
import type { ProductContext } from '@/lib/product-context-service'

type EmptyStateType = 'overview' | 'roadmap' | 'spec' | 'data' | 'screen-designs' | 'data-model' | 'design-system' | 'shell' | 'export'

interface EmptyStateProps {
  type: EmptyStateType
  /** Optional: Force showing the form instead of command */
  showForm?: boolean
}

const config: Record<EmptyStateType, {
  icon: typeof FileText
  title: string
  command: string
  description: string
}> = {
  overview: {
    icon: FileText,
    title: 'No product defined yet',
    command: '/product-vision',
    description: 'Define your product vision, key problems, and features',
  },
  roadmap: {
    icon: Map,
    title: 'No roadmap defined yet',
    command: '/product-roadmap',
    description: 'Break down your product into development sections',
  },
  spec: {
    icon: ClipboardList,
    title: 'No specification defined yet',
    command: '/shape-section',
    description: 'Define the user flows and UI requirements',
  },
  data: {
    icon: Database,
    title: 'No sample data generated yet',
    command: '/sample-data',
    description: 'Create realistic sample data for screen designs',
  },
  'screen-designs': {
    icon: Layout,
    title: 'No screen designs created yet',
    command: '/design-screen',
    description: 'Create screen designs for this section',
  },
  'data-model': {
    icon: Boxes,
    title: 'No data model defined yet',
    command: '/data-model',
    description: 'Define the core entities and relationships',
  },
  'design-system': {
    icon: Palette,
    title: 'No design tokens defined yet',
    command: '/design-tokens',
    description: 'Choose colors and typography for your product',
  },
  shell: {
    icon: PanelLeft,
    title: 'No application shell designed yet',
    command: '/design-shell',
    description: 'Design the navigation and layout',
  },
  export: {
    icon: Package,
    title: 'Ready to export',
    command: '/export-product',
    description: 'Generate the complete handoff package',
  },
}

export function EmptyState({ type, showForm = false }: EmptyStateProps) {
  const [useForm, setUseForm] = useState(showForm)
  const [productContext, setProductContext] = useState<ProductContext | null>(null)
  const { icon: Icon, title, command, description } = config[type]

  // Load product context for AI generation
  useEffect(() => {
    const loadContext = async () => {
      const context = await productContextService.getProductContext()
      setProductContext(context)
    }
    loadContext()
  }, [])

  // Show form if available and user toggled it
  if (useForm) {
    if (type === 'overview') return <ProductVisionForm />
    if (type === 'roadmap') return <ProductRoadmapForm />
    if (type === 'data-model') return <DataModelForm />
    if (type === 'design-system') return <DesignTokensForm />
    if (type === 'shell') return <ShellSpecForm />
  }

  // Check if form is available for this type
  const hasForm = ['overview', 'roadmap', 'data-model', 'design-system', 'shell'].includes(type)

  // Check if AI generation is available
  const canUseAI = aiService.isConfigured() && productContext && (productContext.hasOverview || productContext.hasRoadmap)
  const showAIButton = canUseAI && (type === 'design-system' || type === 'data-model' || type === 'shell')

  return (
    <Card className="border-stone-200 dark:border-stone-700 shadow-sm border-dashed">
      <CardContent className="py-8">
        <div className="flex flex-col items-center text-center max-w-sm mx-auto">
          <div className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center mb-3">
            <Icon className="w-5 h-5 text-stone-400 dark:text-stone-500" strokeWidth={1.5} />
          </div>
          <h3 className="text-base font-medium text-stone-600 dark:text-stone-400 mb-1">
            {title}
          </h3>
          <p className="text-sm text-stone-500 dark:text-stone-400 mb-4">
            {description}
          </p>

          {/* AI Generation Button */}
          {showAIButton && (
            <div className="w-full mb-4">
              <Button
                onClick={() => setUseForm(true)}
                variant="default"
                className="w-full mb-2"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generate with AI
              </Button>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-2">
                AI will use your product context to generate suggestions
              </p>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-stone-200 dark:border-stone-700"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-stone-900 px-2 text-stone-500 dark:text-stone-400">
                    or
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Option 1: Use Interactive Form */}
          {hasForm && !showAIButton && (
            <div className="w-full mb-4">
              <Button
                onClick={() => setUseForm(true)}
                variant="default"
                className="w-full mb-2"
              >
                Use Interactive Form
              </Button>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-stone-200 dark:border-stone-700"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-stone-900 px-2 text-stone-500 dark:text-stone-400">
                    or
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Option 2: Use AI Command */}
          <div className="bg-stone-100 dark:bg-stone-800 rounded-md px-4 py-2.5 w-full">
            <p className="text-xs text-stone-500 dark:text-stone-400 mb-0.5">
              Use with AI Code Editor:
            </p>
            <code className="text-sm font-mono text-stone-700 dark:text-stone-300">
              {command}
            </code>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-2">
              Works with Claude Code, Cursor, Augment, Windsurf, etc.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
