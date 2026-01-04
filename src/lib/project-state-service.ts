/**
 * Project State Service
 * Tracks project completion state in browser memory (IndexedDB)
 * This allows the export page to validate completion even though files
 * are saved to the user's local folder (not in the build)
 */

export interface SectionState {
  sectionId: string
  hasSpec: boolean
  hasData: boolean
  hasTypes: boolean
  hasScreenDesigns: boolean
  hasScreenshots: boolean
  screenDesignCount: number
  screenshotCount: number
}

export interface ProjectState {
  // Core steps
  hasProductOverview: boolean
  hasProductRoadmap: boolean
  hasDataModel: boolean
  hasDesignSystem: boolean
  hasShell: boolean
  
  // Design system details
  hasColors: boolean
  hasTypography: boolean
  
  // Sections
  sections: Record<string, SectionState>
  
  // Metadata
  lastUpdated: number
  projectName?: string
}

class ProjectStateService {
  private readonly DB_NAME = 'unslopai-project-state'
  private readonly DB_VERSION = 1
  private readonly STORE_NAME = 'project-state'
  private readonly STATE_KEY = 'current-project'
  
  private state: ProjectState | null = null
  private listeners: Set<() => void> = new Set()

  constructor() {
    this.loadState()
  }

  /**
   * Open IndexedDB database
   */
  private async openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          db.createObjectStore(this.STORE_NAME)
        }
      }
    })
  }

  /**
   * Load state from IndexedDB
   */
  private async loadState(): Promise<void> {
    try {
      const db = await this.openDatabase()
      const transaction = db.transaction([this.STORE_NAME], 'readonly')
      const store = transaction.objectStore(this.STORE_NAME)
      const request = store.get(this.STATE_KEY)

      request.onsuccess = () => {
        this.state = request.result || this.getInitialState()
        this.notifyListeners()
      }

      request.onerror = () => {
        console.warn('Failed to load project state:', request.error)
        this.state = this.getInitialState()
      }
    } catch (error) {
      console.warn('Failed to open database:', error)
      this.state = this.getInitialState()
    }
  }

  /**
   * Save state to IndexedDB
   */
  private async saveState(): Promise<void> {
    if (!this.state) return

    try {
      const db = await this.openDatabase()
      const transaction = db.transaction([this.STORE_NAME], 'readwrite')
      const store = transaction.objectStore(this.STORE_NAME)
      
      this.state.lastUpdated = Date.now()
      store.put(this.state, this.STATE_KEY)
      
      this.notifyListeners()
    } catch (error) {
      console.warn('Failed to save project state:', error)
    }
  }

  /**
   * Get initial empty state
   */
  private getInitialState(): ProjectState {
    return {
      hasProductOverview: false,
      hasProductRoadmap: false,
      hasDataModel: false,
      hasDesignSystem: false,
      hasShell: false,
      hasColors: false,
      hasTypography: false,
      sections: {},
      lastUpdated: Date.now(),
    }
  }

  /**
   * Get current state (synchronous)
   */
  getState(): ProjectState {
    return this.state || this.getInitialState()
  }

  /**
   * Subscribe to state changes
   */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  /**
   * Notify all listeners of state change
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener())
  }

  /**
   * Mark product overview as complete
   */
  async markProductOverviewComplete(productName?: string): Promise<void> {
    if (!this.state) this.state = this.getInitialState()
    this.state.hasProductOverview = true
    if (productName) this.state.projectName = productName
    await this.saveState()
  }

  /**
   * Mark product roadmap as complete
   */
  async markProductRoadmapComplete(): Promise<void> {
    if (!this.state) this.state = this.getInitialState()
    this.state.hasProductRoadmap = true
    await this.saveState()
  }

  /**
   * Mark data model as complete
   */
  async markDataModelComplete(): Promise<void> {
    if (!this.state) this.state = this.getInitialState()
    this.state.hasDataModel = true
    await this.saveState()
  }

  /**
   * Mark design system colors as complete
   */
  async markColorsComplete(): Promise<void> {
    if (!this.state) this.state = this.getInitialState()
    this.state.hasColors = true
    this.state.hasDesignSystem = this.state.hasColors && this.state.hasTypography
    await this.saveState()
  }

  /**
   * Mark design system typography as complete
   */
  async markTypographyComplete(): Promise<void> {
    if (!this.state) this.state = this.getInitialState()
    this.state.hasTypography = true
    this.state.hasDesignSystem = this.state.hasColors && this.state.hasTypography
    await this.saveState()
  }

  /**
   * Mark shell as complete
   */
  async markShellComplete(): Promise<void> {
    if (!this.state) this.state = this.getInitialState()
    this.state.hasShell = true
    await this.saveState()
  }

  /**
   * Update section state
   */
  async updateSectionState(sectionId: string, updates: Partial<SectionState>): Promise<void> {
    if (!this.state) this.state = this.getInitialState()

    const currentSection = this.state.sections[sectionId] || {
      sectionId,
      hasSpec: false,
      hasData: false,
      hasTypes: false,
      hasScreenDesigns: false,
      hasScreenshots: false,
      screenDesignCount: 0,
      screenshotCount: 0,
    }

    this.state.sections[sectionId] = {
      ...currentSection,
      ...updates,
    }

    await this.saveState()
  }

  /**
   * Mark section spec as complete
   */
  async markSectionSpecComplete(sectionId: string): Promise<void> {
    await this.updateSectionState(sectionId, { hasSpec: true })
  }

  /**
   * Mark section data as complete
   */
  async markSectionDataComplete(sectionId: string): Promise<void> {
    await this.updateSectionState(sectionId, { hasData: true })
  }

  /**
   * Mark section types as complete
   */
  async markSectionTypesComplete(sectionId: string): Promise<void> {
    await this.updateSectionState(sectionId, { hasTypes: true })
  }

  /**
   * Add screen design to section
   */
  async addSectionScreenDesign(sectionId: string): Promise<void> {
    const section = this.state?.sections[sectionId]
    const count = (section?.screenDesignCount || 0) + 1
    await this.updateSectionState(sectionId, {
      hasScreenDesigns: true,
      screenDesignCount: count,
    })
  }

  /**
   * Add screenshot to section
   */
  async addSectionScreenshot(sectionId: string): Promise<void> {
    const section = this.state?.sections[sectionId]
    const count = (section?.screenshotCount || 0) + 1
    await this.updateSectionState(sectionId, {
      hasScreenshots: true,
      screenshotCount: count,
    })
  }

  /**
   * Get section state
   */
  getSectionState(sectionId: string): SectionState | null {
    return this.state?.sections[sectionId] || null
  }

  /**
   * Get all sections with screen designs
   */
  getSectionsWithScreenDesigns(): string[] {
    if (!this.state) return []
    return Object.values(this.state.sections)
      .filter(s => s.hasScreenDesigns)
      .map(s => s.sectionId)
  }

  /**
   * Check if ready for export
   */
  isReadyForExport(): boolean {
    const state = this.getState()
    const hasRequiredSteps = state.hasProductOverview && state.hasProductRoadmap
    const hasSections = this.getSectionsWithScreenDesigns().length > 0
    return hasRequiredSteps && hasSections
  }

  /**
   * Clear all state (for New Project)
   */
  async clearState(): Promise<void> {
    this.state = this.getInitialState()
    await this.saveState()
  }
}

export const projectStateService = new ProjectStateService()

