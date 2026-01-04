import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import './index.css'
import { router } from '@/lib/router'

// Get Clerk publishable key from environment variables
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

// Only wrap with ClerkProvider if the key is provided
const AppContent = PUBLISHABLE_KEY ? (
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <RouterProvider router={router} />
  </ClerkProvider>
) : (
  <RouterProvider router={router} />
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {AppContent}
  </StrictMode>,
)
