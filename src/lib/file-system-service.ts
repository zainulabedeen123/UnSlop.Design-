/**
 * File System Service
 * Handles automatic saving of generated files to the project directory
 */

import { projectStateService } from './project-state-service'

export interface SaveFileOptions {
  path: string // Relative path from project root, e.g., 'product/product-overview.md'
  content: string
  type?: 'text/markdown' | 'application/json' | 'text/plain'
}

export interface SaveResult {
  success: boolean
  message: string
  savedPath?: string
}

class FileSystemService {
  private directoryHandle: FileSystemDirectoryHandle | null = null
  private isSupported: boolean
  private readonly STORAGE_KEY = 'fileSystemDirectoryHandle'

  constructor() {
    // Check if File System Access API is supported
    this.isSupported = 'showDirectoryPicker' in window

    // Try to restore the directory handle from IndexedDB
    this.restoreDirectoryHandle()
  }

  /**
   * Restore directory handle from IndexedDB
   */
  private async restoreDirectoryHandle(): Promise<void> {
    if (!this.isSupported) return

    try {
      // Open IndexedDB
      const db = await this.openDatabase()
      const transaction = db.transaction(['handles'], 'readonly')
      const store = transaction.objectStore('handles')
      const request = store.get(this.STORAGE_KEY)

      request.onsuccess = async () => {
        const handle = request.result
        if (handle) {
          // Verify we still have permission
          const permission = await handle.queryPermission({ mode: 'readwrite' })
          if (permission === 'granted') {
            this.directoryHandle = handle
          } else {
            // Try to request permission again
            const newPermission = await handle.requestPermission({ mode: 'readwrite' })
            if (newPermission === 'granted') {
              this.directoryHandle = handle
            }
          }
        }
      }
    } catch (error) {
      console.warn('Failed to restore directory handle:', error)
    }
  }

  /**
   * Open IndexedDB for storing directory handles
   */
  private openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('FileSystemDB', 1)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains('handles')) {
          db.createObjectStore('handles')
        }
      }
    })
  }

  /**
   * Save directory handle to IndexedDB
   */
  private async saveDirectoryHandle(handle: FileSystemDirectoryHandle): Promise<void> {
    try {
      const db = await this.openDatabase()
      const transaction = db.transaction(['handles'], 'readwrite')
      const store = transaction.objectStore('handles')
      store.put(handle, this.STORAGE_KEY)
    } catch (error) {
      console.warn('Failed to save directory handle:', error)
    }
  }

  /**
   * Check if the File System Access API is supported
   */
  isFileSystemAccessSupported(): boolean {
    return this.isSupported
  }

  /**
   * Request access to the project directory
   */
  async requestDirectoryAccess(): Promise<boolean> {
    if (!this.isSupported) {
      console.warn('File System Access API not supported')
      return false
    }

    try {
      // @ts-ignore - File System Access API types
      this.directoryHandle = await window.showDirectoryPicker({
        mode: 'readwrite',
        startIn: 'documents',
      })

      // Save the handle to IndexedDB for future sessions
      if (this.directoryHandle) {
        await this.saveDirectoryHandle(this.directoryHandle)
      }

      return true
    } catch (error) {
      console.error('Failed to get directory access:', error)
      return false
    }
  }

  /**
   * Check if we have directory access
   */
  hasDirectoryAccess(): boolean {
    return this.directoryHandle !== null
  }

  /**
   * Get the directory handle (for reading files)
   */
  async getDirectoryHandle(): Promise<FileSystemDirectoryHandle | null> {
    return this.directoryHandle
  }

  /**
   * Save a file to the project directory
   */
  async saveFile({ path, content, type = 'text/markdown' }: SaveFileOptions): Promise<SaveResult> {
    // If no directory access, fall back to download
    if (!this.hasDirectoryAccess()) {
      return this.downloadFile({ path, content, type })
    }

    try {
      const pathParts = path.split('/')
      const fileName = pathParts.pop()!
      
      // Navigate to or create the directory structure
      let currentDir = this.directoryHandle!
      for (const dirName of pathParts) {
        currentDir = await currentDir.getDirectoryHandle(dirName, { create: true })
      }

      // Create or get the file
      const fileHandle = await currentDir.getFileHandle(fileName, { create: true })
      
      // Write the content
      const writable = await fileHandle.createWritable()
      await writable.write(content)
      await writable.close()

      // Update project state based on file path
      await this.updateProjectState(path, content)

      return {
        success: true,
        message: `File saved successfully to ${path}`,
        savedPath: path,
      }
    } catch (error) {
      console.error('Failed to save file:', error)

      // Fall back to download
      return this.downloadFile({ path, content, type })
    }
  }

  /**
   * Update project state based on saved file
   */
  private async updateProjectState(path: string, content: string): Promise<void> {
    try {
      // Product overview
      if (path === 'product/product-overview.md') {
        // Extract product name from markdown
        const nameMatch = content.match(/^#\s+(.+)$/m)
        const productName = nameMatch?.[1]?.trim()
        await projectStateService.markProductOverviewComplete(productName)
      }

      // Product roadmap
      else if (path === 'product/product-roadmap.md') {
        await projectStateService.markProductRoadmapComplete()
      }

      // Data model
      else if (path === 'product/data-model/data-model.md') {
        await projectStateService.markDataModelComplete()
      }

      // Design system - colors
      else if (path === 'product/design-system/colors.json') {
        await projectStateService.markColorsComplete()
      }

      // Design system - typography
      else if (path === 'product/design-system/typography.json') {
        await projectStateService.markTypographyComplete()
      }

      // Shell
      else if (path === 'product/shell/spec.md') {
        await projectStateService.markShellComplete()
      }

      // Section files
      else if (path.startsWith('product/sections/')) {
        const match = path.match(/^product\/sections\/([^/]+)\/(.+)$/)
        if (match) {
          const [, sectionId, fileName] = match

          if (fileName === 'spec.md') {
            await projectStateService.markSectionSpecComplete(sectionId)
          } else if (fileName === 'data.json') {
            await projectStateService.markSectionDataComplete(sectionId)
          } else if (fileName === 'types.ts') {
            await projectStateService.markSectionTypesComplete(sectionId)
          } else if (fileName.endsWith('.png')) {
            await projectStateService.addSectionScreenshot(sectionId)
          }
        }
      }

      // Screen designs (src/sections)
      else if (path.startsWith('src/sections/')) {
        const match = path.match(/^src\/sections\/([^/]+)\//)
        if (match) {
          const [, sectionId] = match
          await projectStateService.addSectionScreenDesign(sectionId)
        }
      }
    } catch (error) {
      console.warn('Failed to update project state:', error)
    }
  }

  /**
   * Download a file (fallback method)
   */
  private downloadFile({ path, content, type }: SaveFileOptions): SaveResult {
    try {
      const blob = new Blob([content], { type })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = path.split('/').pop()! // Just the filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      return {
        success: true,
        message: `File downloaded as ${path.split('/').pop()}. Please save it to ${path}`,
        savedPath: path,
      }
    } catch (error) {
      return {
        success: false,
        message: `Failed to download file: ${error instanceof Error ? error.message : 'Unknown error'}`,
      }
    }
  }

  /**
   * Save multiple files at once
   */
  async saveFiles(files: SaveFileOptions[]): Promise<SaveResult[]> {
    const results: SaveResult[] = []
    
    for (const file of files) {
      const result = await this.saveFile(file)
      results.push(result)
    }
    
    return results
  }

  /**
   * Clear directory access (for testing or reset)
   */
  async clearAccess(): Promise<void> {
    this.directoryHandle = null

    try {
      const db = await this.openDatabase()
      const transaction = db.transaction(['handles'], 'readwrite')
      const store = transaction.objectStore('handles')
      store.delete(this.STORAGE_KEY)

      // Also clear project state
      await projectStateService.clearState()
    } catch (error) {
      console.warn('Failed to clear directory handle:', error)
    }
  }
}

export const fileSystemService = new FileSystemService()
