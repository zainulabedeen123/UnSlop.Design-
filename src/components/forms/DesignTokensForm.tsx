import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Palette, Download, Copy, Check, Sparkles, Loader2 } from 'lucide-react'
import { aiService, DEFAULT_MODEL } from '@/lib/ai-service'
import { AIModelSelector } from './AIModelSelector'
import { AutoSaveStatus } from './AutoSaveStatus'
import { fileSystemService } from '@/lib/file-system-service'
import type { SaveResult } from '@/lib/file-system-service'
import { productContextService } from '@/lib/product-context-service'
import type { ProductContext } from '@/lib/product-context-service'

const TAILWIND_COLORS = [
  'slate', 'gray', 'zinc', 'neutral', 'stone',
  'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan',
  'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose'
]

const GOOGLE_FONTS = [
  'Inter', 'DM Sans', 'Space Grotesk', 'Manrope', 'Plus Jakarta Sans',
  'Source Sans 3', 'Nunito Sans', 'Work Sans', 'Outfit', 'Poppins',
  'JetBrains Mono', 'Fira Code', 'IBM Plex Mono', 'Source Code Pro', 'Roboto Mono'
]

export function DesignTokensForm() {
  const [primaryColor, setPrimaryColor] = useState('lime')
  const [secondaryColor, setSecondaryColor] = useState('violet')
  const [neutralColor, setNeutralColor] = useState('stone')
  const [headingFont, setHeadingFont] = useState('DM Sans')
  const [bodyFont, setBodyFont] = useState('Inter')
  const [monoFont, setMonoFont] = useState('JetBrains Mono')
  const [generated, setGenerated] = useState<{ colors: string; typography: string } | null>(null)
  const [copied, setCopied] = useState<'colors' | 'typography' | null>(null)
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL)
  const [isGenerating, setIsGenerating] = useState(false)
  const [useAI, setUseAI] = useState(false)
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

  const generateDirectFiles = () => {
    const colors = JSON.stringify({
      primary: primaryColor,
      secondary: secondaryColor,
      neutral: neutralColor
    }, null, 2)

    const typography = JSON.stringify({
      heading: headingFont,
      body: bodyFont,
      mono: monoFont
    }, null, 2)

    return { colors, typography }
  }

  const autoSaveFiles = async (colors: string, typography: string) => {
    const results = await fileSystemService.saveFiles([
      {
        path: 'product/design-system/colors.json',
        content: colors,
        type: 'application/json',
      },
      {
        path: 'product/design-system/typography.json',
        content: typography,
        type: 'application/json',
      },
    ])

    // Show the first result (they should both succeed or fail together)
    setSaveResult(results[0])
  }

  const generateFiles = async () => {
    setError(null)
    setSaveResult(null)

    // If AI is disabled or not configured, generate directly
    if (!useAI || !aiService.isConfigured()) {
      const { colors, typography } = generateDirectFiles()
      setGenerated({ colors, typography })
      await autoSaveFiles(colors, typography)
      return
    }

    setIsGenerating(true)

    try {
      const contextPrompt = productContext ? productContextService.buildContextPrompt(productContext) : ''

      const systemPrompt = `You are a design system expert. Suggest appropriate color palettes and typography based on the product context.

You must respond with ONLY a valid JSON object in this exact format:
{
  "primary": "tailwind-color-name",
  "secondary": "tailwind-color-name",
  "neutral": "tailwind-color-name",
  "heading": "Google-Font-Name",
  "body": "Google-Font-Name",
  "mono": "Google-Font-Name"
}

Available Tailwind colors: ${TAILWIND_COLORS.join(', ')}
Available Google Fonts: ${GOOGLE_FONTS.join(', ')}

Choose colors and fonts that match the product's personality and use case. For example:
- Professional/corporate products: neutral colors like slate/gray, clean fonts like Inter
- Creative/playful products: vibrant colors like violet/pink, modern fonts like Space Grotesk
- Technical/developer products: blue/cyan colors, monospace-friendly fonts

Respond with ONLY the JSON object, no explanation.`

      let userPrompt = ''

      if (contextPrompt) {
        userPrompt += `${contextPrompt}\n\nBased on the above product context, suggest appropriate design tokens.`
      } else {
        userPrompt += 'Suggest a modern, professional design system with good contrast and readability.'
      }

      const result = await aiService.generate({
        prompt: userPrompt,
        systemPrompt,
        model: selectedModel,
      })

      // Parse the AI response
      const jsonMatch = result.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('AI did not return valid JSON')
      }

      const tokens = JSON.parse(jsonMatch[0])

      // Update the form values
      setPrimaryColor(tokens.primary)
      setSecondaryColor(tokens.secondary)
      setNeutralColor(tokens.neutral)
      setHeadingFont(tokens.heading)
      setBodyFont(tokens.body)
      setMonoFont(tokens.mono)

      // Generate the files with AI-suggested values
      const colors = JSON.stringify({
        primary: tokens.primary,
        secondary: tokens.secondary,
        neutral: tokens.neutral
      }, null, 2)

      const typography = JSON.stringify({
        heading: tokens.heading,
        body: tokens.body,
        mono: tokens.mono
      }, null, 2)

      setGenerated({ colors, typography })
      await autoSaveFiles(colors, typography)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate design tokens')
      console.error('Generation error:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const copyToClipboard = async (content: string, type: 'colors' | 'typography') => {
    await navigator.clipboard.writeText(content)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  if (generated) {
    return (
      <Card className="border-stone-200 dark:border-stone-700 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Palette className="w-5 h-5" strokeWidth={1.5} />
            Design Tokens Generated
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Auto-save status */}
          <AutoSaveStatus saveResult={saveResult} />

          {/* Colors File */}
          <div className="space-y-3">
            <Label className="text-stone-700 dark:text-stone-300">colors.json</Label>
            <div className="bg-stone-50 dark:bg-stone-900 rounded-md p-4 border border-stone-200 dark:border-stone-700">
              <pre className="text-sm text-stone-700 dark:text-stone-300 whitespace-pre-wrap font-mono overflow-x-auto">
                {generated.colors}
              </pre>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => downloadFile('colors.json', generated.colors)} size="sm" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button onClick={() => copyToClipboard(generated.colors, 'colors')} variant="outline" size="sm" className="flex-1">
                {copied === 'colors' ? (
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
            </div>
          </div>

          {/* Typography File */}
          <div className="space-y-3">
            <Label className="text-stone-700 dark:text-stone-300">typography.json</Label>
            <div className="bg-stone-50 dark:bg-stone-900 rounded-md p-4 border border-stone-200 dark:border-stone-700">
              <pre className="text-sm text-stone-700 dark:text-stone-300 whitespace-pre-wrap font-mono overflow-x-auto">
                {generated.typography}
              </pre>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => downloadFile('typography.json', generated.typography)} size="sm" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button onClick={() => copyToClipboard(generated.typography, 'typography')} variant="outline" size="sm" className="flex-1">
                {copied === 'typography' ? (
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
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-lime-50 dark:bg-lime-900/20 rounded-md p-4 border border-lime-200 dark:border-lime-800">
            <p className="text-sm text-stone-700 dark:text-stone-300 mb-2">
              <strong>Next steps:</strong>
            </p>
            <ol className="text-sm text-stone-600 dark:text-stone-400 space-y-1 ml-4 list-decimal">
              <li>Create directory: <code className="font-mono bg-stone-200 dark:bg-stone-800 px-1 rounded">product/design-system/</code></li>
              <li>Save both files to <code className="font-mono bg-stone-200 dark:bg-stone-800 px-1 rounded">product/design-system/</code></li>
              <li>Refresh this page to see your design tokens</li>
              <li>Continue to the next step: Application Shell</li>
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
          Choose Your Design Tokens
        </CardTitle>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
          Select colors from Tailwind and fonts from Google Fonts
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Auto-save status */}
        <AutoSaveStatus />

        {/* Product Context Info */}
        {productContext && (productContext.hasOverview || productContext.hasRoadmap) && (
          <div className="bg-lime-50 dark:bg-lime-900/20 rounded-md p-4 border border-lime-200 dark:border-lime-800">
            <p className="text-sm text-stone-700 dark:text-stone-300">
              <strong>AI can suggest design tokens based on your product:</strong>
            </p>
            <ul className="text-sm text-stone-600 dark:text-stone-400 mt-2 space-y-1">
              {productContext.hasOverview && <li>✓ Product Overview</li>}
              {productContext.hasRoadmap && <li>✓ Product Roadmap</li>}
            </ul>
            <p className="text-xs text-stone-500 dark:text-stone-500 mt-2">
              Enable AI below to get color and font recommendations.
            </p>
          </div>
        )}

        {/* Colors */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-stone-700 dark:text-stone-300">Colors</h3>

          <div className="space-y-2">
            <Label className="text-stone-700 dark:text-stone-300">Primary Color</Label>
            <select
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-md bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-600"
            >
              {TAILWIND_COLORS.map(color => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
            <p className="text-xs text-stone-500 dark:text-stone-400">Main accent for buttons, links, key actions</p>
          </div>

          <div className="space-y-2">
            <Label className="text-stone-700 dark:text-stone-300">Secondary Color</Label>
            <select
              value={secondaryColor}
              onChange={(e) => setSecondaryColor(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-md bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-600"
            >
              {TAILWIND_COLORS.map(color => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
            <p className="text-xs text-stone-500 dark:text-stone-400">Complementary accent for tags, highlights</p>
          </div>

          <div className="space-y-2">
            <Label className="text-stone-700 dark:text-stone-300">Neutral Color</Label>
            <select
              value={neutralColor}
              onChange={(e) => setNeutralColor(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-md bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-600"
            >
              {TAILWIND_COLORS.filter(c => ['slate', 'gray', 'zinc', 'neutral', 'stone'].includes(c)).map(color => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
            <p className="text-xs text-stone-500 dark:text-stone-400">Backgrounds, text, borders</p>
          </div>
        </div>

        {/* Typography */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-stone-700 dark:text-stone-300">Typography</h3>

          <div className="space-y-2">
            <Label className="text-stone-700 dark:text-stone-300">Heading Font</Label>
            <select
              value={headingFont}
              onChange={(e) => setHeadingFont(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-md bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-600"
            >
              {GOOGLE_FONTS.filter(f => !f.includes('Mono')).map(font => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
            <p className="text-xs text-stone-500 dark:text-stone-400">For titles and section headers</p>
          </div>

          <div className="space-y-2">
            <Label className="text-stone-700 dark:text-stone-300">Body Font</Label>
            <select
              value={bodyFont}
              onChange={(e) => setBodyFont(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-md bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-600"
            >
              {GOOGLE_FONTS.filter(f => !f.includes('Mono')).map(font => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
            <p className="text-xs text-stone-500 dark:text-stone-400">For paragraphs and UI text</p>
          </div>

          <div className="space-y-2">
            <Label className="text-stone-700 dark:text-stone-300">Mono Font</Label>
            <select
              value={monoFont}
              onChange={(e) => setMonoFont(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-md bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-600"
            >
              {GOOGLE_FONTS.filter(f => f.includes('Mono')).map(font => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
            <p className="text-xs text-stone-500 dark:text-stone-400">For code and technical content</p>
          </div>
        </div>

        {/* AI Controls */}
        {aiService.isConfigured() && (
          <div className="space-y-3 p-4 bg-stone-50 dark:bg-stone-900 rounded-md border border-stone-200 dark:border-stone-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                <Label className="text-stone-700 dark:text-stone-300">AI Suggestions</Label>
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
                  AI will suggest colors and fonts that match your product's personality
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
          onClick={generateFiles}
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
            'Generate Design Tokens'
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

