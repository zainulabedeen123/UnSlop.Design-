import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { FileText, Download, Copy, Check, Sparkles, Loader2 } from 'lucide-react'
import { aiService, DEFAULT_MODEL } from '@/lib/ai-service'
import { AIModelSelector } from './AIModelSelector'
import { AutoSaveStatus } from './AutoSaveStatus'
import { fileSystemService } from '@/lib/file-system-service'
import type { SaveResult } from '@/lib/file-system-service'

interface Problem {
  title: string
  solution: string
}

export function ProductVisionForm() {
  const [productName, setProductName] = useState('')
  const [description, setDescription] = useState('')
  const [problems, setProblems] = useState<Problem[]>([{ title: '', solution: '' }])
  const [features, setFeatures] = useState<string[]>([''])
  const [generated, setGenerated] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL)
  const [isGenerating, setIsGenerating] = useState(false)
  const [useAI, setUseAI] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saveResult, setSaveResult] = useState<SaveResult | null>(null)

  const addProblem = () => {
    setProblems([...problems, { title: '', solution: '' }])
  }

  const removeProblem = (index: number) => {
    setProblems(problems.filter((_, i) => i !== index))
  }

  const updateProblem = (index: number, field: 'title' | 'solution', value: string) => {
    const updated = [...problems]
    updated[index][field] = value
    setProblems(updated)
  }

  const addFeature = () => {
    setFeatures([...features, ''])
  }

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index))
  }

  const updateFeature = (index: number, value: string) => {
    const updated = [...features]
    updated[index] = value
    setFeatures(updated)
  }

  const generateDirectMarkdown = () => {
    let markdown = `# ${productName}\n\n`
    markdown += `## Description\n${description}\n\n`

    if (problems.some(p => p.title && p.solution)) {
      markdown += `## Problems & Solutions\n\n`
      problems.forEach((problem, index) => {
        if (problem.title && problem.solution) {
          markdown += `### Problem ${index + 1}: ${problem.title}\n${problem.solution}\n\n`
        }
      })
    }

    const validFeatures = features.filter(f => f.trim())
    if (validFeatures.length > 0) {
      markdown += `## Key Features\n`
      validFeatures.forEach(feature => {
        markdown += `- ${feature}\n`
      })
    }

    setGenerated(markdown)
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
      const systemPrompt = `You are a product planning assistant. Generate a well-structured product overview in markdown format.
The output should follow this exact structure:

# [Product Name]

## Description
[2-3 sentences describing the product]

## Problems & Solutions

### Problem 1: [Problem Title]
[How the product solves this problem]

### Problem 2: [Problem Title]
[How the product solves this problem]

## Key Features
- [Feature 1]
- [Feature 2]
- [Feature 3]

Be specific, professional, and focus on value proposition. Expand on the user's input to create compelling, clear descriptions.`

      const userPrompt = `Product Name: ${productName}

Brief Description: ${description}

Problems to solve:
${problems.map((p, i) => `${i + 1}. ${p.title}: ${p.solution}`).join('\n')}

Key Features:
${features.filter(f => f).map((f, i) => `${i + 1}. ${f}`).join('\n')}

Please generate a complete, professional product overview based on this information.`

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

  const generateDirectMarkdownContent = (): string => {
    let markdown = `# ${productName}\n\n`
    markdown += `## Description\n${description}\n\n`

    if (problems.some(p => p.title && p.solution)) {
      markdown += `## Problems & Solutions\n\n`
      problems.forEach((problem, index) => {
        if (problem.title && problem.solution) {
          markdown += `### Problem ${index + 1}: ${problem.title}\n${problem.solution}\n\n`
        }
      })
    }

    const validFeatures = features.filter(f => f.trim())
    if (validFeatures.length > 0) {
      markdown += `## Key Features\n`
      validFeatures.forEach(feature => {
        markdown += `- ${feature}\n`
      })
    }

    return markdown
  }

  const autoSaveFile = async (content: string) => {
    const result = await fileSystemService.saveFile({
      path: 'product/product-overview.md',
      content,
      type: 'text/markdown',
    })
    setSaveResult(result)
  }

  const downloadFile = () => {
    if (!generated) return
    const blob = new Blob([generated], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'product-overview.md'
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
            <FileText className="w-5 h-5" strokeWidth={1.5} />
            Product Overview Generated
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
              <li>File saved to <code className="font-mono bg-stone-200 dark:bg-stone-800 px-1 rounded">product/product-overview.md</code></li>
              <li>Refresh this page to see your product overview</li>
              <li>Continue to the next step: Product Roadmap</li>
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
          Define Your Product Vision
        </CardTitle>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
          Fill out this form to create your product overview
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Auto-save status */}
        <AutoSaveStatus />

        {/* Product Name */}
        <div className="space-y-2">
          <Label htmlFor="product-name" className="text-stone-700 dark:text-stone-300">
            Product Name *
          </Label>
          <input
            id="product-name"
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="e.g., TaskFlow, InvoiceHub, etc."
            className="w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-md bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-600"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-stone-700 dark:text-stone-300">
            Description *
          </Label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A brief 1-3 sentence description of your product..."
            rows={3}
            className="w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-md bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-600 resize-none"
          />
        </div>

        {/* Problems & Solutions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-stone-700 dark:text-stone-300">Problems & Solutions</Label>
            <Button onClick={addProblem} variant="outline" size="sm">
              + Add Problem
            </Button>
          </div>
          {problems.map((problem, index) => (
            <div key={index} className="p-4 border border-stone-200 dark:border-stone-700 rounded-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-stone-600 dark:text-stone-400">
                  Problem {index + 1}
                </span>
                {problems.length > 1 && (
                  <Button
                    onClick={() => removeProblem(index)}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Remove
                  </Button>
                )}
              </div>
              <input
                type="text"
                value={problem.title}
                onChange={(e) => updateProblem(index, 'title', e.target.value)}
                placeholder="Problem title..."
                className="w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-md bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-600"
              />
              <textarea
                value={problem.solution}
                onChange={(e) => updateProblem(index, 'solution', e.target.value)}
                placeholder="How your product solves this problem..."
                rows={2}
                className="w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-md bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-600 resize-none"
              />
            </div>
          ))}
        </div>

        {/* Key Features */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-stone-700 dark:text-stone-300">Key Features</Label>
            <Button onClick={addFeature} variant="outline" size="sm">
              + Add Feature
            </Button>
          </div>
          {features.map((feature, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={feature}
                onChange={(e) => updateFeature(index, e.target.value)}
                placeholder="Feature description..."
                className="flex-1 px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-md bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-600"
              />
              {features.length > 1 && (
                <Button
                  onClick={() => removeFeature(index)}
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  Remove
                </Button>
              )}
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
                Use AI to enhance content
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
              AI will expand your input into a professional, detailed product overview
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
        <Button
          onClick={generateMarkdown}
          disabled={!productName || !description || isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating with AI...
            </>
          ) : (
            <>
              {useAI && aiService.isConfigured() && <Sparkles className="w-4 h-4 mr-2" />}
              Generate Product Overview
            </>
          )}
        </Button>

        {(!productName || !description) && (
          <p className="text-sm text-stone-500 dark:text-stone-400 text-center">
            * Product name and description are required
          </p>
        )}
      </CardContent>
    </Card>
  )
}

