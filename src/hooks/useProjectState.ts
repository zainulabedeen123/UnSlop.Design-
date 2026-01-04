/**
 * React hook for accessing project state
 */

import { useState, useEffect } from 'react'
import { projectStateService, type ProjectState } from '@/lib/project-state-service'

export function useProjectState(): ProjectState {
  const [state, setState] = useState(projectStateService.getState())

  useEffect(() => {
    // Subscribe to state changes
    const unsubscribe = projectStateService.subscribe(() => {
      setState(projectStateService.getState())
    })

    // Cleanup subscription on unmount
    return unsubscribe
  }, [])

  return state
}

