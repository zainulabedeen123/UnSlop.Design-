/**
 * Product Context Service
 * Reads existing product files to provide context for AI generation
 */

export interface ProductContext {
  hasOverview: boolean
  hasRoadmap: boolean
  overview?: string
  roadmap?: string
}

class ProductContextService {
  /**
   * Read product overview file
   */
  async readProductOverview(): Promise<string | null> {
    try {
      const response = await fetch('/product/product-overview.md')
      if (response.ok) {
        return await response.text()
      }
    } catch (error) {
      console.warn('Failed to read product overview:', error)
    }
    return null
  }

  /**
   * Read product roadmap file
   */
  async readProductRoadmap(): Promise<string | null> {
    try {
      const response = await fetch('/product/product-roadmap.md')
      if (response.ok) {
        return await response.text()
      }
    } catch (error) {
      console.warn('Failed to read product roadmap:', error)
    }
    return null
  }

  /**
   * Get all available product context
   */
  async getProductContext(): Promise<ProductContext> {
    const [overview, roadmap] = await Promise.all([
      this.readProductOverview(),
      this.readProductRoadmap(),
    ])

    return {
      hasOverview: overview !== null,
      hasRoadmap: roadmap !== null,
      overview: overview || undefined,
      roadmap: roadmap || undefined,
    }
  }

  /**
   * Build context prompt for AI
   */
  buildContextPrompt(context: ProductContext): string {
    let prompt = ''

    if (context.overview) {
      prompt += `# Product Overview\n\n${context.overview}\n\n`
    }

    if (context.roadmap) {
      prompt += `# Product Roadmap\n\n${context.roadmap}\n\n`
    }

    return prompt
  }
}

export const productContextService = new ProductContextService()

