# Clerk Authentication Integration

This document explains how Clerk authentication has been integrated into the Unslop AI application.

## Overview

Clerk provides user authentication and management for the application. The integration is **optional** - the app works perfectly fine without Clerk credentials, but authentication features will be disabled.

---

## Setup Instructions

### 1. Create a Clerk Account

1. Go to [https://clerk.com](https://clerk.com)
2. Sign up for a free account
3. Create a new application

### 2. Get Your Publishable Key

1. Go to your Clerk Dashboard
2. Navigate to **API Keys** page: [https://dashboard.clerk.com/last-active?path=api-keys](https://dashboard.clerk.com/last-active?path=api-keys)
3. Copy your **Publishable Key** (starts with `pk_test_` or `pk_live_`)

### 3. Configure Environment Variables

Add your Clerk publishable key to `.env`:

```bash
# .env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
```

**Important:** 
- Never commit your `.env` file to version control
- The `.env.example` file shows the required format
- If you don't provide a Clerk key, the app will work without authentication

### 4. Restart Development Server

After adding the environment variable, restart your dev server:

```bash
npm run dev
```

---

## What Was Implemented

### 1. **Clerk React SDK** (`@clerk/clerk-react`)

Installed the official Clerk React SDK for Vite applications.

```bash
npm install @clerk/clerk-react
```

### 2. **ClerkProvider Wrapper** (`src/main.tsx`)

The app is conditionally wrapped with `ClerkProvider` only if a Clerk key is provided:

```typescript
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

const AppContent = PUBLISHABLE_KEY ? (
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <RouterProvider router={router} />
  </ClerkProvider>
) : (
  <RouterProvider router={router} />
)
```

**Benefits:**
- ✅ App works without Clerk credentials
- ✅ Authentication enabled when key is provided
- ✅ No errors if key is missing

### 3. **Conditional Clerk Components**

All Clerk components are conditionally rendered based on whether a Clerk key is provided:

```typescript
// Check if Clerk is enabled
const isClerkEnabled = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY)

// Only render Clerk components if enabled
{isClerkEnabled && (
  <>
    <SignedOut>
      <SignInButton mode="modal">
        <Button>Sign In</Button>
      </SignInButton>
    </SignedOut>
    <SignedIn>
      <UserButton />
    </SignedIn>
  </>
)}
```

**Why this is important:**
- ✅ Prevents "ClerkProvider not found" errors
- ✅ Clerk components only render when ClerkProvider is present
- ✅ Graceful degradation when no Clerk key is provided

### 4. **Authentication UI Components**

Added Clerk components to all headers:

**Components Used:**
- `<SignInButton>` - Opens sign-in modal
- `<SignUpButton>` - Opens sign-up modal
- `<UserButton>` - Shows user avatar and menu
- `<SignedIn>` - Renders content only when signed in
- `<SignedOut>` - Renders content only when signed out

**Locations:**
- ✅ `AppLayout.tsx` - Main app header (both main and sub-page headers)
- ✅ `LandingPage.tsx` - Landing page header

### 5. **Modal Mode**

All sign-in/sign-up buttons use `mode="modal"` for a better UX:

```typescript
<SignInButton mode="modal">
  <Button variant="ghost" size="sm">
    Sign In
  </Button>
</SignInButton>
```

**Benefits:**
- ✅ No page navigation required
- ✅ Smooth modal experience
- ✅ Consistent with modern web apps

---

## User Experience

### Without Clerk Key (Default)

- ✅ App works normally
- ✅ No authentication UI shown
- ✅ All features accessible without login

### With Clerk Key

**Signed Out:**
- "Sign In" and "Sign Up" buttons visible in header
- Clicking opens modal for authentication
- Users can sign in with email, Google, GitHub, etc. (based on Clerk settings)

**Signed In:**
- User avatar shown in header
- Clicking avatar opens menu with:
  - User profile
  - Account settings
  - Sign out option

---

## Clerk Dashboard Configuration

### Recommended Settings

1. **Authentication Methods:**
   - Email + Password
   - Google OAuth
   - GitHub OAuth

2. **User Profile:**
   - Enable username
   - Enable profile picture
   - Enable email verification

3. **Session Settings:**
   - Session lifetime: 7 days
   - Inactivity timeout: 30 minutes

### Customization

You can customize the appearance of Clerk components in the Clerk Dashboard:
- Colors and branding
- Button styles
- Modal appearance
- Email templates

---

## Files Modified

### New Files:
- `CLERK_INTEGRATION.md` - This documentation

### Modified Files:
1. ✅ `package.json` - Added `@clerk/clerk-react` dependency
2. ✅ `.env` - Added `VITE_CLERK_PUBLISHABLE_KEY`
3. ✅ `.env.example` - Added Clerk key template
4. ✅ `src/main.tsx` - Wrapped app with ClerkProvider
5. ✅ `src/components/AppLayout.tsx` - Added auth UI to headers
6. ✅ `src/components/LandingPage.tsx` - Added auth UI to landing page

---

## Testing

### Manual Testing Steps:

1. **Without Clerk Key:**
   ```bash
   # Remove or comment out VITE_CLERK_PUBLISHABLE_KEY in .env
   npm run dev
   ```
   - ✅ App should work normally
   - ✅ No auth buttons visible

2. **With Clerk Key:**
   ```bash
   # Add VITE_CLERK_PUBLISHABLE_KEY to .env
   npm run dev
   ```
   - ✅ "Sign In" and "Sign Up" buttons visible
   - ✅ Clicking opens modal
   - ✅ Can sign in/sign up
   - ✅ User avatar appears after sign in
   - ✅ Can sign out from user menu

---

## Deployment

### Vercel Deployment

Add the Clerk publishable key to your Vercel environment variables:

1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add:
   - **Name:** `VITE_CLERK_PUBLISHABLE_KEY`
   - **Value:** Your Clerk publishable key
   - **Environment:** Production, Preview, Development

### Other Platforms

Add the environment variable according to your platform's documentation.

---

## Security Notes

1. **Publishable Key is Safe:**
   - The publishable key is meant to be public
   - It's safe to include in client-side code
   - Never expose your Clerk Secret Key

2. **Environment Variables:**
   - Always use `.env` for local development
   - Never commit `.env` to version control
   - Use platform-specific env vars for deployment

3. **HTTPS Required:**
   - Clerk requires HTTPS in production
   - Local development works with HTTP

---

## Support

- **Clerk Documentation:** [https://clerk.com/docs](https://clerk.com/docs)
- **Clerk Support:** [https://clerk.com/support](https://clerk.com/support)
- **Clerk Discord:** [https://clerk.com/discord](https://clerk.com/discord)

---

**Status:** ✅ **Complete and ready for use!**

The Clerk integration is fully functional and optional. Users can choose to enable authentication by providing a Clerk publishable key, or use the app without authentication.

