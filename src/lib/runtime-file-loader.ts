/**
 * Runtime File Loader
 * Reads files from the user's selected directory using File System API
 * This allows the app to display user-generated content without rebuilding
 */

import { fileSystemService } from './file-system-service'

class RuntimeFileLoader {
  private cache: Map<string, string> = new Map()
  private cacheTimestamps: Map<string, number> = new Map()
  private readonly CACHE_TTL = 5000 // 5 seconds

  /**
   * Read a file from the user's selected directory
   */
  async readFile(path: string): Promise<string | null> {
    // Check cache first
    const cached = this.getCached(path)
    if (cached !== null) {
      return cached
    }

    // Check if we have directory access
    if (!fileSystemService.hasDirectoryAccess()) {
      return null
    }

    try {
      const directoryHandle = await fileSystemService.getDirectoryHandle()
      if (!directoryHandle) return null

      // Navigate to the file
      const pathParts = path.split('/')
      const fileName = pathParts.pop()!
      
      let currentDir = directoryHandle
      for (const dirName of pathParts) {
        try {
          currentDir = await currentDir.getDirectoryHandle(dirName)
        } catch {
          // Directory doesn't exist
          return null
        }
      }

      // Get the file
      try {
        const fileHandle = await currentDir.getFileHandle(fileName)
        const file = await fileHandle.getFile()
        const content = await file.text()
        
        // Cache the content
        this.setCache(path, content)
        
        return content
      } catch {
        // File doesn't exist
        return null
      }
    } catch (error) {
      console.warn('Failed to read file:', path, error)
      return null
    }
  }

  /**
   * Read a JSON file from the user's selected directory
   */
  async readJsonFile<T = Record<string, unknown>>(path: string): Promise<T | null> {
    const content = await this.readFile(path)
    if (!content) return null

    try {
      return JSON.parse(content) as T
    } catch (error) {
      console.warn('Failed to parse JSON file:', path, error)
      return null
    }
  }

  /**
   * Check if a file exists
   */
  async fileExists(path: string): Promise<boolean> {
    const content = await this.readFile(path)
    return content !== null
  }

  /**
   * List files in a directory
   */
  async listFiles(dirPath: string): Promise<string[]> {
    if (!fileSystemService.hasDirectoryAccess()) {
      return []
    }

    try {
      const directoryHandle = await fileSystemService.getDirectoryHandle()
      if (!directoryHandle) return []

      // Navigate to the directory
      const pathParts = dirPath.split('/').filter(p => p)
      
      let currentDir = directoryHandle
      for (const dirName of pathParts) {
        try {
          currentDir = await currentDir.getDirectoryHandle(dirName)
        } catch {
          return []
        }
      }

      // List files
      const files: string[] = []
      // @ts-ignore - TypeScript doesn't recognize FileSystemDirectoryHandle as async iterable
      for await (const [name, entry] of currentDir.entries()) {
        if (entry.kind === 'file') {
          files.push(name)
        }
      }

      return files
    } catch (error) {
      console.warn('Failed to list files:', dirPath, error)
      return []
    }
  }

  /**
   * Get cached content if still valid
   */
  private getCached(path: string): string | null {
    const cached = this.cache.get(path)
    const timestamp = this.cacheTimestamps.get(path)
    
    if (cached && timestamp && Date.now() - timestamp < this.CACHE_TTL) {
      return cached
    }
    
    return null
  }

  /**
   * Set cache for a file
   */
  private setCache(path: string, content: string): void {
    this.cache.set(path, content)
    this.cacheTimestamps.set(path, Date.now())
  }

  /**
   * Clear cache for a specific file or all files
   */
  clearCache(path?: string): void {
    if (path) {
      this.cache.delete(path)
      this.cacheTimestamps.delete(path)
    } else {
      this.cache.clear()
      this.cacheTimestamps.clear()
    }
  }
}

export const runtimeFileLoader = new RuntimeFileLoader()

