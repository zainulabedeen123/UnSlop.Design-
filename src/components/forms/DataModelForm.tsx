import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Boxes, Download, Copy, Check, Sparkles, Loader2 } from 'lucide-react'
import { aiService, DEFAULT_MODEL } from '@/lib/ai-service'
import { AIModelSelector } from './AIModelSelector'
import { AutoSaveStatus } from './AutoSaveStatus'
import { fileSystemService } from '@/lib/file-system-service'
import type { SaveResult } from '@/lib/file-system-service'
import { productContextService } from '@/lib/product-context-service'
import type { ProductContext } from '@/lib/product-context-service'

interface Entity {
  name: string
  description: string
}

export function DataModelForm() {
  const [entities, setEntities] = useState<Entity[]>([{ name: '', description: '' }])
  const [relationships, setRelationships] = useState<string[]>([''])
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

  const addEntity = () => {
    setEntities([...entities, { name: '', description: '' }])
  }

  const removeEntity = (index: number) => {
    if (entities.length > 1) {
      setEntities(entities.filter((_, i) => i !== index))
    }
  }

  const updateEntity = (index: number, field: 'name' | 'description', value: string) => {
    const updated = [...entities]
    updated[index][field] = value
    setEntities(updated)
  }

  const addRelationship = () => {
    setRelationships([...relationships, ''])
  }

  const removeRelationship = (index: number) => {
    if (relationships.length > 1) {
      setRelationships(relationships.filter((_, i) => i !== index))
    }
  }

  const updateRelationship = (index: number, value: string) => {
    const updated = [...relationships]
    updated[index] = value
    setRelationships(updated)
  }

  const generateDirectMarkdownContent = (): string => {
    let markdown = `# Data Model\n\n## Entities\n\n`

    entities.forEach((entity) => {
      if (entity.name && entity.description) {
        markdown += `### ${entity.name}\n${entity.description}\n\n`
      }
    })

    const validRelationships = relationships.filter(r => r.trim())
    if (validRelationships.length > 0) {
      markdown += `## Relationships\n\n`
      validRelationships.forEach(rel => {
        markdown += `- ${rel}\n`
      })
    }

    return markdown
  }

  const generateDirectMarkdown = () => {
    const content = generateDirectMarkdownContent()
    setGenerated(content)
  }

  const autoSaveFile = async (content: string) => {
    const result = await fileSystemService.saveFile({
      path: 'product/data-model/data-model.md',
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

      const systemPrompt = `You are a data modeling expert. Generate a comprehensive data model in markdown format based on the product context and user input.

The output should follow this exact structure:

# Data Model

## Entities

### [Entity Name]
[Detailed description of the entity, its purpose, and key attributes]

### [Entity Name]
[Detailed description of the entity, its purpose, and key attributes]

## Relationships

- [Entity A] has many [Entity B]
- [Entity C] belongs to [Entity D]
- [Entity E] has one [Entity F]

Be specific and professional. Infer logical entities and relationships based on the product context. Include all necessary entities for the product to function.`

      let userPrompt = ''

      if (contextPrompt) {
        userPrompt += `${contextPrompt}\n\nBased on the above product context, `
      }

      userPrompt += `generate a complete data model.`

      if (entities.some(e => e.name || e.description)) {
        userPrompt += `\n\nUser-provided entities:\n`
        entities.forEach((e, i) => {
          if (e.name || e.description) {
            userPrompt += `${i + 1}. ${e.name}: ${e.description}\n`
          }
        })
      }

      const validRelationships = relationships.filter(r => r.trim())
      if (validRelationships.length > 0) {
        userPrompt += `\n\nUser-provided relationships:\n`
        validRelationships.forEach(rel => {
          userPrompt += `- ${rel}\n`
        })
      }

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
    a.download = 'data-model.md'
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

  const hasValidEntities = entities.some(e => e.name && e.description)
  const canGenerate = hasValidEntities || (useAI && aiService.isConfigured() && productContext && (productContext.hasOverview || productContext.hasRoadmap))

  if (generated) {
    return (
      <Card className="border-stone-200 dark:border-stone-700 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Boxes className="w-5 h-5" strokeWidth={1.5} />
            Data Model Generated
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
              <li>Create directory: <code className="font-mono bg-stone-200 dark:bg-stone-800 px-1 rounded">product/data-model/</code></li>
              <li>Save this file as <code className="font-mono bg-stone-200 dark:bg-stone-800 px-1 rounded">product/data-model/data-model.md</code></li>
              <li>Refresh this page to see your data model</li>
              <li>Continue to the next step: Design Tokens</li>
            </ol>
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
          Define Your Data Model
        </CardTitle>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
          Define the core entities and relationships in your system
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Auto-save status */}
        <AutoSaveStatus />

        {/* Product Context Info */}
        {productContext && (productContext.hasOverview || productContext.hasRoadmap) && (
          <div className="bg-lime-50 dark:bg-lime-900/20 rounded-md p-4 border border-lime-200 dark:border-lime-800">
            <p className="text-sm text-stone-700 dark:text-stone-300">
              <strong>AI can use your existing product context:</strong>
            </p>
            <ul className="text-sm text-stone-600 dark:text-stone-400 mt-2 space-y-1">
              {productContext.hasOverview && <li>✓ Product Overview</li>}
              {productContext.hasRoadmap && <li>✓ Product Roadmap</li>}
            </ul>
            <p className="text-xs text-stone-500 dark:text-stone-500 mt-2">
              Enable AI below to generate a data model based on your product.
            </p>
          </div>
        )}

        {/* Entities */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-stone-700 dark:text-stone-300">Entities</Label>
            <Button onClick={addEntity} variant="outline" size="sm">
              + Add Entity
            </Button>
          </div>
          {entities.map((entity, index) => (
            <div key={index} className="p-4 border border-stone-200 dark:border-stone-700 rounded-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-stone-600 dark:text-stone-400">
                  Entity {index + 1}
                </span>
                {entities.length > 1 && (
                  <Button
                    onClick={() => removeEntity(index)}
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
                value={entity.name}
                onChange={(e) => updateEntity(index, 'name', e.target.value)}
                placeholder="Entity name (e.g., User, Invoice, Project)..."
                className="w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-md bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-600"
              />
              <textarea
                value={entity.description}
                onChange={(e) => updateEntity(index, 'description', e.target.value)}
                placeholder="What this entity represents..."
                rows={2}
                className="w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-md bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-600 resize-none"
              />
            </div>
          ))}
        </div>

        {/* Relationships */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-stone-700 dark:text-stone-300">Relationships (Optional)</Label>
            <Button onClick={addRelationship} variant="outline" size="sm">
              + Add Relationship
            </Button>
          </div>
          {relationships.map((relationship, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={relationship}
                onChange={(e) => updateRelationship(index, e.target.value)}
                placeholder="e.g., User has many Projects, Invoice belongs to Client..."
                className="flex-1 px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-md bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-600"
              />
              {relationships.length > 1 && (
                <Button
                  onClick={() => removeRelationship(index)}
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

        {/* AI Controls */}
        {aiService.isConfigured() && (
          <div className="space-y-3 p-4 bg-stone-50 dark:bg-stone-900 rounded-md border border-stone-200 dark:border-stone-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                <Label className="text-stone-700 dark:text-stone-300">AI Enhancement</Label>
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
              <AIModelSelector
                value={selectedModel}
                onChange={setSelectedModel}
              />
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
          disabled={isGenerating || !canGenerate}
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
            'Generate Data Model'
          )}
        </Button>

        {!hasValidEntities && !useAI && (
          <p className="text-sm text-stone-500 dark:text-stone-400 text-center">
            * At least one entity with name and description is required (or enable AI to generate from product context)
          </p>
        )}
      </CardContent>
    </Card>
  )
}

