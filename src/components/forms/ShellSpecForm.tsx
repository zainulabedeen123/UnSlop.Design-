import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { PanelLeft, Download, Copy, Check, Sparkles, Loader2 } from 'lucide-react'
import { aiService, DEFAULT_MODEL } from '@/lib/ai-service'
import { AIModelSelector } from './AIModelSelector'
import { AutoSaveStatus } from './AutoSaveStatus'
import { fileSystemService } from '@/lib/file-system-service'
import type { SaveResult } from '@/lib/file-system-service'
import { productContextService } from '@/lib/product-context-service'
import type { ProductContext } from '@/lib/product-context-service'

export function ShellSpecForm() {
  const [layoutType, setLayoutType] = useState<'sidebar' | 'topbar'>('sidebar')
  const [generated, setGenerated] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL)
  const [isGenerating, setIsGenerating] = useState(false)
  const [useAI, setUseAI] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saveResult, setSaveResult] = useState<SaveResult | null>(null)
  const [productContext, setProductContext] = useState<ProductContext | null>(null)

  // Load product context on mount
  useEffect(() => {
    const loadContext = async () => {
      const context = await productContextService.getProductContext()
      setProductContext(context)
    }
    loadContext()
  }, [])

  const generateDirectMarkdownContent = (): string => {
    let markdown = `# Application Shell\n\n`
    markdown += `## Layout\n${layoutType === 'sidebar' ? 'Sidebar Navigation' : 'Top Bar Navigation'}\n\n`
    markdown += `## Overview\nThe application shell provides consistent navigation and layout across all sections.\n\n`
    markdown += `## Navigation Items\n- Dashboard\n- Settings\n- Profile\n`
    return markdown
  }

  const generateDirectMarkdown = () => {
    const content = generateDirectMarkdownContent()
    setGenerated(content)
  }

  const autoSaveFile = async (content: string) => {
    const result = await fileSystemService.saveFile({
      path: 'product/shell/spec.md',
      content,
      type: 'text/markdown',
    })
    setSaveResult(result)
  }

  const generateMarkdown = async () => {
    setError(null)
    setSaveResult(null)
    
    // If AI is disabled or not configured, generate directly
    if (!useAI || !aiService.isConfigured()) {
      generateDirectMarkdown()
      await autoSaveFile(generateDirectMarkdownContent())
      return
    }

    setIsGenerating(true)

    try {
      const contextPrompt = productContext ? productContextService.buildContextPrompt(productContext) : ''
      
      const systemPrompt = `You are a UX design expert. Generate an application shell specification in markdown format.

The output should follow this exact structure:

# Application Shell

## Layout
[Sidebar Navigation or Top Bar Navigation]

## Overview
[2-3 sentences describing the shell's purpose and structure]

## Navigation Items
- [Item 1]
- [Item 2]
- [Item 3]

## User Menu
- Profile
- Settings
- Logout

Be specific and professional. Base navigation items on the product's sections/features.`

      let userPrompt = ''
      
      if (contextPrompt) {
        userPrompt += `${contextPrompt}\n\nBased on the above product context, generate an application shell specification.`
      } else {
        userPrompt += 'Generate a professional application shell specification.'
      }
      
      userPrompt += `\n\nPreferred layout: ${layoutType === 'sidebar' ? 'Sidebar Navigation' : 'Top Bar Navigation'}`

      const result = await aiService.generate({
        prompt: userPrompt,
        systemPrompt,
        model: selectedModel,
      })

      setGenerated(result)
      await autoSaveFile(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate content')
      console.error('Generation error:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadFile = () => {
    if (!generated) return
    const blob = new Blob([generated], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'shell-spec.md'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const copyToClipboard = async () => {
    if (!generated) return
    await navigator.clipboard.writeText(generated)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (generated) {
    return (
      <Card className="border-stone-200 dark:border-stone-700 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <PanelLeft className="w-5 h-5" strokeWidth={1.5} />
            Shell Specification Generated
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Auto-save status */}
          <AutoSaveStatus saveResult={saveResult} />

          {/* Preview */}
          <div className="bg-stone-50 dark:bg-stone-900 rounded-md p-4 border border-stone-200 dark:border-stone-700">
            <pre className="text-xs text-stone-700 dark:text-stone-300 whitespace-pre-wrap font-mono max-h-96 overflow-y-auto">
              {generated}
            </pre>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button onClick={copyToClipboard} variant="outline" className="flex-1">
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
            <Button onClick={downloadFile} variant="outline" className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>

          <Button onClick={() => setGenerated(null)} variant="ghost" className="w-full">
            ← Edit Form
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-stone-200 dark:border-stone-700 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-stone-900 dark:text-stone-100">
          Design Application Shell
        </CardTitle>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
          Define the navigation and layout structure
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Auto-save status */}
        <AutoSaveStatus />

        {/* Product Context Info */}
        {productContext && (productContext.hasOverview || productContext.hasRoadmap) && (
          <div className="bg-lime-50 dark:bg-lime-900/20 rounded-md p-4 border border-lime-200 dark:border-lime-800">
            <p className="text-sm text-stone-700 dark:text-stone-300">
              <strong>AI can generate shell based on your product:</strong>
            </p>
            <ul className="text-sm text-stone-600 dark:text-stone-400 mt-2 space-y-1">
              {productContext.hasOverview && <li>✓ Product Overview</li>}
              {productContext.hasRoadmap && <li>✓ Product Roadmap</li>}
            </ul>
            <p className="text-xs text-stone-500 dark:text-stone-500 mt-2">
              Enable AI below to get navigation suggestions based on your sections.
            </p>
          </div>
        )}

        {/* Layout Type */}
        <div className="space-y-2">
          <Label className="text-stone-700 dark:text-stone-300">Layout Type</Label>
          <select
            value={layoutType}
            onChange={(e) => setLayoutType(e.target.value as 'sidebar' | 'topbar')}
            className="w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-md bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-600"
          >
            <option value="sidebar">Sidebar Navigation</option>
            <option value="topbar">Top Bar Navigation</option>
          </select>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Choose the navigation pattern for your application
          </p>
        </div>

        {/* AI Controls */}
        {aiService.isConfigured() && (
          <div className="space-y-3 p-4 bg-stone-50 dark:bg-stone-900 rounded-md border border-stone-200 dark:border-stone-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                <Label className="text-stone-700 dark:text-stone-300">AI Generation</Label>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={useAI}
                  onChange={(e) => setUseAI(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-stone-300 dark:bg-stone-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-lime-500 dark:peer-focus:ring-lime-600 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-stone-600 peer-checked:bg-lime-600"></div>
              </label>
            </div>

            {useAI && (
              <>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  AI will generate navigation based on your product sections
                </p>
                <AIModelSelector
                  value={selectedModel}
                  onChange={setSelectedModel}
                />
              </>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 rounded-md p-4 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Generate Button */}
        <Button
          onClick={generateMarkdown}
          disabled={isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating with AI...
            </>
          ) : useAI && aiService.isConfigured() ? (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate with AI
            </>
          ) : (
            'Generate Shell Spec'
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

