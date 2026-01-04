import { useState } from 'react'
import { AppLayout } from '@/components/AppLayout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Book, FileText, Rocket, Code, Zap, Layout, Package, Github } from 'lucide-react'

interface DocSection {
  id: string
  title: string
  icon: typeof Book
  content: string
}

const docSections: DocSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: Rocket,
    content: `# Getting Started with Unslop AI

## What is Unslop AI?

Unslop AI is an AI-powered product planning and design tool that helps you define your product vision, generate data models and design systems, and export production-ready components.

## Quick Start

1. **Choose a Project Folder** - Select where you want to save your product files
2. **Define Product Vision** - Describe what you're building and why
3. **Create Roadmap** - Break your product into development sections
4. **Generate Data Model** - Let AI create your data structure
5. **Design System** - Choose colors and typography
6. **Design Sections** - Create screen designs for each section
7. **Export** - Get production-ready code and documentation

## Key Features

- 🤖 **AI-Powered Generation** - Automatically generate data models, design tokens, and components
- 📦 **Export Ready** - Get production-ready React components and TypeScript types
- 🎨 **Design System** - Consistent colors and typography across your product
- 📱 **Responsive** - All designs are mobile-responsive by default
- 🌙 **Dark Mode** - Built-in light and dark mode support`,
  },
  {
    id: 'product-planning',
    title: 'Product Planning',
    icon: FileText,
    content: `# Product Planning

## Product Overview

Define your product's core description, the problems it solves, and key features.

**What to include:**
- Product name and description
- Problems your product solves
- Solutions your product provides
- Key features

## Product Roadmap

Break your product into 3-5 development sections. Each section represents a self-contained area that can be designed and built independently.

**Example sections:**
- User Management
- Dashboard
- Analytics
- Settings
- Billing

## Data Model

Define the core entities and relationships in your product. This establishes the "nouns" of your system.

**Example entities:**
- User
- Project
- Task
- Comment
- Team`,
  },
  {
    id: 'design-system',
    title: 'Design System',
    icon: Layout,
    content: `# Design System

## Color Palette

Choose your color palette from Tailwind CSS colors:
- **Primary** - Main brand color (e.g., lime, blue, purple)
- **Secondary** - Accent color (e.g., teal, orange, pink)
- **Neutral** - Background and text (e.g., stone, slate, gray)

## Typography

Choose your fonts from Google Fonts:
- **Heading** - For titles and headings
- **Body** - For body text and UI
- **Mono** - For code and technical content

## Application Shell

Design the persistent navigation and layout that wraps all sections:
- Global navigation structure
- User menu
- Layout pattern`,
  },
  {
    id: 'ai-integration',
    title: 'AI Integration',
    icon: Zap,
    content: `# AI Integration

## OpenAI API

Unslop AI uses OpenAI's GPT-4 to generate:
- Data models based on your product description
- Design tokens (colors and typography)
- Application shell navigation
- Sample data for screen designs
- React components for screen designs

## How It Works

1. **Context Building** - AI analyzes your product overview, roadmap, and data model
2. **Generation** - AI generates structured output based on your requirements
3. **Validation** - Output is validated and formatted
4. **Integration** - Generated content is saved to your project folder

## Best Practices

- Provide clear, detailed product descriptions
- Be specific about features and requirements
- Review and refine AI-generated content
- Iterate on designs based on feedback`,
  },
  {
    id: 'export',
    title: 'Export & Handoff',
    icon: Package,
    content: `# Export & Handoff

## Export Package

The export package includes:
- **README.md** - Quick start guide
- **Product Overview** - Product summary
- **Prompts** - Ready-to-use prompts for coding agents
- **Instructions** - Implementation guides
- **Design System** - Tokens, colors, fonts
- **Data Model** - Types and sample data
- **Shell** - Shell components
- **Sections** - Section components with tests

## Implementation

You can implement the exported package in two ways:

### One-Shot Implementation
Use the one-shot prompt to implement everything at once:
\`\`\`
Copy the content from prompts/one-shot-prompt.md
Paste into your coding agent (Claude, Cursor, etc.)
Follow the implementation instructions
\`\`\`

### Incremental Implementation
Implement section by section:
\`\`\`
Start with instructions/incremental/01-foundation.md
Then instructions/incremental/02-shell.md
Then each section in order
\`\`\``,
  },
]

export function DocsPage() {
  const [activeSection, setActiveSection] = useState<string>('getting-started')

  const currentSection = docSections.find(s => s.id === activeSection) || docSections[0]
  const Icon = currentSection.icon

  return (
    <AppLayout showPhaseNav={false}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-2">
            Documentation
          </h1>
          <p className="text-stone-600 dark:text-stone-400">
            Learn how to use Unslop AI to plan and design your product
          </p>
        </div>

        {/* GitHub Link */}
        <Card className="border-stone-200 dark:border-stone-700 bg-gradient-to-br from-stone-50 to-stone-100 dark:from-stone-900/20 dark:to-stone-800/20">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Github className="w-6 h-6 text-stone-700 dark:text-stone-300" />
                <div>
                  <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                    Open Source
                  </h3>
                  <p className="text-sm text-stone-600 dark:text-stone-400">
                    View the source code and contribute on GitHub
                  </p>
                </div>
              </div>
              <Button variant="outline" asChild>
                <a 
                  href="https://github.com/zainulabedeen123/UnSlop.Design-" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  View on GitHub
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Documentation Content */}
        <div className="grid md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <Card className="border-stone-200 dark:border-stone-700">
              <CardContent className="p-4">
                <nav className="space-y-1">
                  {docSections.map((section) => {
                    const SectionIcon = section.icon
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors ${
                          activeSection === section.id
                            ? 'bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-400'
                            : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                        }`}
                      >
                        <SectionIcon className="w-4 h-4 shrink-0" />
                        <span className="text-sm font-medium">{section.title}</span>
                      </button>
                    )
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Content */}
          <div className="md:col-span-3">
            <Card className="border-stone-200 dark:border-stone-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-lime-100 dark:bg-lime-900/30 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-lime-600 dark:text-lime-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
                    {currentSection.title}
                  </h2>
                </div>
                <div className="prose prose-stone dark:prose-invert max-w-none">
                  <div className="whitespace-pre-wrap text-stone-700 dark:text-stone-300">
                    {currentSection.content}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

