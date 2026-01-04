import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Map, Download, Copy, Check, GripVertical, Sparkles, Loader2 } from 'lucide-react'
import { aiService, DEFAULT_MODEL } from '@/lib/ai-service'
import { AIModelSelector } from './AIModelSelector'
import { AutoSaveStatus } from './AutoSaveStatus'
import { fileSystemService } from '@/lib/file-system-service'
import type { SaveResult } from '@/lib/file-system-service'

interface Section {
  title: string
  description: string
}

export function ProductRoadmapForm() {
  const [sections, setSections] = useState<Section[]>([
    { title: '', description: '' },
    { title: '', description: '' },
    { title: '', description: '' },
  ])
  const [generated, setGenerated] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL)
  const [isGenerating, setIsGenerating] = useState(false)
  const [useAI, setUseAI] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saveResult, setSaveResult] = useState<SaveResult | null>(null)

  const addSection = () => {
    setSections([...sections, { title: '', description: '' }])
  }

  const removeSection = (index: number) => {
    if (sections.length > 1) {
      setSections(sections.filter((_, i) => i !== index))
    }
  }

  const updateSection = (index: number, field: 'title' | 'description', value: string) => {
    const updated = [...sections]
    updated[index][field] = value
    setSections(updated)
  }

  const moveSection = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === sections.length - 1)
    ) {
      return
    }

    const updated = [...sections]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    ;[updated[index], updated[newIndex]] = [updated[newIndex], updated[index]]
    setSections(updated)
  }

  const generateDirectMarkdownContent = (): string => {
    let markdown = `# Product Roadmap\n\n## Sections\n\n`

    sections.forEach((section, index) => {
      if (section.title && section.description) {
        markdown += `### ${index + 1}. ${section.title}\n${section.description}\n\n`
      }
    })

    return markdown
  }

  const generateDirectMarkdown = () => {
    const content = generateDirectMarkdownContent()
    setGenerated(content)
  }

  const autoSaveFile = async (content: string) => {
    const result = await fileSystemService.saveFile({
      path: 'product/product-roadmap.md',
      content,
      type: 'text/markdown',
    })
    setSaveResult(result)
  }

  const generateMarkdown = async () => {
    setError(null)
    setSaveResult(null)

    if (!useAI || !aiService.isConfigured()) {
      generateDirectMarkdown()
      await autoSaveFile(generateDirectMarkdownContent())
      return
    }

    setIsGenerating(true)

    try {
      const systemPrompt = `You are a product planning assistant. Generate a well-structured product roadmap in markdown format.
The output should follow this exact structure:

# Product Roadmap

## Sections

### 1. [Section Title]
[One clear sentence describing this section's purpose and scope]

### 2. [Section Title]
[One clear sentence describing this section's purpose and scope]

### 3. [Section Title]
[One clear sentence describing this section's purpose and scope]

Expand on the user's input to create clear, professional section descriptions. Each description should be one sentence that clearly explains what the section does.`

      const userPrompt = `Product Sections:

${sections.map((s, i) => `${i + 1}. ${s.title}: ${s.description}`).join('\n')}

Please generate a complete product roadmap with improved, professional descriptions for each section.`

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
    a.download = 'product-roadmap.md'
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

  const hasValidSections = sections.some(s => s.title && s.description)

  if (generated) {
    return (
      <Card className="border-stone-200 dark:border-stone-700 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Map className="w-5 h-5" strokeWidth={1.5} />
            Product Roadmap Generated
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Auto-save status */}
          <AutoSaveStatus saveResult={saveResult} />

          <div className="bg-stone-50 dark:bg-stone-900 rounded-md p-4 border border-stone-200 dark:border-stone-700">
            <pre className="text-sm text-stone-700 dark:text-stone-300 whitespace-pre-wrap font-mono overflow-x-auto">
              {generated}
            </pre>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={downloadFile} className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Download File
            </Button>
            <Button onClick={copyToClipboard} variant="outline" className="flex-1">
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Content
                </>
              )}
            </Button>
          </div>

          <div className="bg-lime-50 dark:bg-lime-900/20 rounded-md p-4 border border-lime-200 dark:border-lime-800">
            <p className="text-sm text-stone-700 dark:text-stone-300 mb-2">
              <strong>Next steps:</strong>
            </p>
            <ol className="text-sm text-stone-600 dark:text-stone-400 space-y-1 ml-4 list-decimal">
              <li>Save this file as <code className="font-mono bg-stone-200 dark:bg-stone-800 px-1 rounded">product/product-roadmap.md</code></li>
              <li>Refresh this page to see your roadmap</li>
              <li>Continue to the next step: Data Model</li>
            </ol>
          </div>

          <div className="flex gap-2">
            <Button onClick={() => setGenerated(null)} variant="ghost" className="flex-1">
              ← Edit Form
            </Button>
            {useAI && aiService.isConfigured() && (
              <Button
                onClick={generateMarkdown}
                variant="outline"
                className="flex-1"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Regenerating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Regenerate with AI
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-stone-200 dark:border-stone-700 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-stone-900 dark:text-stone-100">
          Define Your Product Roadmap
        </CardTitle>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
          Break your product into 3-5 development sections
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Auto-save status */}
        <AutoSaveStatus />

        {/* Sections */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-stone-700 dark:text-stone-300">Sections (3-5 recommended)</Label>
            <Button onClick={addSection} variant="outline" size="sm">
              + Add Section
            </Button>
          </div>

          {sections.map((section, index) => (
            <div
              key={index}
              className="p-4 border border-stone-200 dark:border-stone-700 rounded-md space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-stone-400 dark:text-stone-500" />
                  <span className="text-sm font-medium text-stone-600 dark:text-stone-400">
                    Section {index + 1}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    onClick={() => moveSection(index, 'up')}
                    disabled={index === 0}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    ↑
                  </Button>
                  <Button
                    onClick={() => moveSection(index, 'down')}
                    disabled={index === sections.length - 1}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    ↓
                  </Button>
                  {sections.length > 1 && (
                    <Button
                      onClick={() => removeSection(index)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>

              <input
                type="text"
                value={section.title}
                onChange={(e) => updateSection(index, 'title', e.target.value)}
                placeholder="Section title (e.g., Dashboard, Invoices, Settings)..."
                className="w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-md bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-600"
              />

              <textarea
                value={section.description}
                onChange={(e) => updateSection(index, 'description', e.target.value)}
                placeholder="One sentence description of this section..."
                rows={2}
                className="w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-md bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-600 resize-none"
              />
            </div>
          ))}
        </div>

        {/* AI Options */}
        {aiService.isConfigured() && (
          <div className="space-y-4 p-4 border border-lime-200 dark:border-lime-800 rounded-md bg-lime-50 dark:bg-lime-900/20">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="useAI"
                checked={useAI}
                onChange={(e) => setUseAI(e.target.checked)}
                className="w-4 h-4 rounded border-stone-300 dark:border-stone-600"
              />
              <Label htmlFor="useAI" className="text-stone-700 dark:text-stone-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                Use AI to enhance descriptions
              </Label>
            </div>

            {useAI && (
              <AIModelSelector
                value={selectedModel}
                onChange={setSelectedModel}
                disabled={isGenerating}
              />
            )}

            <p className="text-xs text-stone-600 dark:text-stone-400">
              AI will improve and expand your section descriptions
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Generate Button */}
        <Button onClick={generateMarkdown} disabled={!hasValidSections || isGenerating} className="w-full">
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating with AI...
            </>
          ) : (
            <>
              {useAI && aiService.isConfigured() && <Sparkles className="w-4 h-4 mr-2" />}
              Generate Product Roadmap
            </>
          )}
        </Button>

        {!hasValidSections && (
          <p className="text-sm text-stone-500 dark:text-stone-400 text-center">
            * At least one section with title and description is required
          </p>
        )}
      </CardContent>
    </Card>
  )
}

