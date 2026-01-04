import { Layers, Sparkles, FolderOpen, Zap, FileText, Boxes, Layout, Github } from 'lucide-react'
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ThemeToggle } from './ThemeToggle'

interface LandingPageProps {
  onGetStarted: () => void
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-stone-200 dark:border-stone-800 bg-card/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="px-4 sm:px-6 py-3 max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-lime-400 to-lime-600 dark:from-lime-500 dark:to-lime-700 flex items-center justify-center">
              <Layers className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <span className="text-lg font-semibold text-stone-900 dark:text-stone-100">Unslop AI</span>
          </div>
          <div className="flex items-center gap-2">
            {/* Clerk Authentication */}
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button size="sm">
                  Sign Up
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8"
                  }
                }}
              />
            </SignedIn>

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-20 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-400 text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4" />
          AI-Powered Product Planning
        </div>
        
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-900 dark:text-stone-100 mb-6 leading-tight">
          Plan Better Products<br />with AI
        </h1>
        
        <p className="text-lg sm:text-xl text-stone-600 dark:text-stone-400 mb-8 max-w-2xl mx-auto">
          Define your product vision, let AI generate data models and design systems, then export production-ready components. All in one place.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={onGetStarted} size="lg" className="text-base">
            <FolderOpen className="w-5 h-5 mr-2" />
            Get Started
          </Button>
          <Button variant="outline" size="lg" className="text-base" asChild>
            <a href="https://unslop.design/docs" target="_blank" rel="noopener noreferrer">
              View Documentation
            </a>
          </Button>
          <Button variant="outline" size="lg" className="text-base" asChild>
            <a href="https://github.com/zainulabedeen123/UnSlop.Design-" target="_blank" rel="noopener noreferrer">
              <Github className="w-5 h-5 mr-2" />
              GitHub
            </a>
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 text-center mb-12">
          Everything you need to plan your product
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-stone-200 dark:border-stone-700">
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-lg bg-lime-100 dark:bg-lime-900/30 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-lime-600 dark:text-lime-400" />
              </div>
              <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">
                AI Generation
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-400">
                AI generates data models, design tokens, and navigation based on your product context
              </p>
            </CardContent>
          </Card>

          <Card className="border-stone-200 dark:border-stone-700">
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">
                Product Planning
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-400">
                Define your vision, roadmap, and break down features into manageable sections
              </p>
            </CardContent>
          </Card>

          <Card className="border-stone-200 dark:border-stone-700">
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mb-4">
                <Boxes className="w-6 h-6 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">
                Data Modeling
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-400">
                Define entities and relationships with AI assistance for consistency
              </p>
            </CardContent>
          </Card>

          <Card className="border-stone-200 dark:border-stone-700">
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-4">
                <Layout className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">
                Design System
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-400">
                AI suggests colors and fonts, then generates your application shell
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-16 max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 text-center mb-12">
          How it works
        </h2>

        <div className="space-y-8">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-lime-600 dark:bg-lime-500 text-white flex items-center justify-center font-semibold">
              1
            </div>
            <div>
              <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">
                Choose Your Project Folder
              </h3>
              <p className="text-stone-600 dark:text-stone-400">
                Select a directory where all your product files will be saved. The folder is remembered across sessions.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-lime-600 dark:bg-lime-500 text-white flex items-center justify-center font-semibold">
              2
            </div>
            <div>
              <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">
                Define Your Product
              </h3>
              <p className="text-stone-600 dark:text-stone-400">
                Describe your product vision, problems you're solving, and key features. Create a roadmap with development sections.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-lime-600 dark:bg-lime-500 text-white flex items-center justify-center font-semibold">
              3
            </div>
            <div>
              <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">
                Let AI Generate
              </h3>
              <p className="text-stone-600 dark:text-stone-400">
                Click "Generate with AI" buttons to create data models, design tokens, and navigation structure based on your product context.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-lime-600 dark:bg-lime-500 text-white flex items-center justify-center font-semibold">
              4
            </div>
            <div>
              <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">
                Design & Export
              </h3>
              <p className="text-stone-600 dark:text-stone-400">
                Create screen designs for each section, then export everything as a complete handoff package with ready-to-use prompts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-16 max-w-4xl mx-auto text-center">
        <Card className="border-stone-200 dark:border-stone-700 bg-gradient-to-br from-lime-50 to-lime-100 dark:from-lime-900/20 dark:to-lime-800/20">
          <CardContent className="pt-12 pb-12">
            <Zap className="w-12 h-12 text-lime-600 dark:text-lime-400 mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 mb-4">
              Ready to build better products?
            </h2>
            <p className="text-stone-600 dark:text-stone-400 mb-6 max-w-xl mx-auto">
              Start planning your product with AI assistance. No credit card required.
            </p>
            <Button onClick={onGetStarted} size="lg" className="text-base">
              <FolderOpen className="w-5 h-5 mr-2" />
              Choose Project Folder
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-200 dark:border-stone-800 py-8">
        <div className="px-6 max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-lime-400 to-lime-600 dark:from-lime-500 dark:to-lime-700 flex items-center justify-center">
              <Layers className="w-4 h-4 text-white" strokeWidth={2} />
            </div>
            <span className="text-sm font-medium text-stone-600 dark:text-stone-400">Unslop AI</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-stone-500 dark:text-stone-400">
            <a href="https://unslop.design/docs" target="_blank" rel="noopener noreferrer" className="hover:text-stone-900 dark:hover:text-stone-100">
              Documentation
            </a>
            <a href="https://github.com/unslopai/unslop" target="_blank" rel="noopener noreferrer" className="hover:text-stone-900 dark:hover:text-stone-100">
              GitHub
            </a>
            <span>© 2024 Unslop AI</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

