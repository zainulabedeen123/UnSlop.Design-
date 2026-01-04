# Onboarding Flow Documentation

## Overview

The "Get Started" button on the landing page now guides users through a multi-step onboarding process:

1. **Sign In** (if not authenticated)
2. **Add API Key** (if not configured)
3. **Select Folder** (to save project files)

This creates a smooth, guided experience for new users.

---

## User Flow

### Scenario 1: User Not Signed In

**User Action:** Clicks "Get Started"

**System Response:**
1. Opens Clerk sign-in modal
2. Sets `pendingFolderAccess = true` (remembers user's intent)
3. After sign-in completes:
   - Checks if user has API key
   - If no API key → Shows API key onboarding dialog
   - If has API key → Opens folder selection dialog

### Scenario 2: User Signed In, No API Key

**User Action:** Clicks "Get Started"

**System Response:**
1. Checks API key status
2. Shows API key onboarding dialog
3. User can:
   - **Add API key** → Saves key → Opens folder selection
   - **Skip for now** → Closes dialog (can add key later in Settings)

### Scenario 3: User Signed In, Has API Key

**User Action:** Clicks "Get Started"

**System Response:**
1. Checks authentication ✅
2. Checks API key ✅
3. Opens folder selection dialog immediately

---

## Implementation Details

### Files Created:

**`src/components/ApiKeyOnboardingDialog.tsx`**
- Dedicated onboarding dialog for first-time API key setup
- Welcome message and explanation
- API key input with validation
- "Continue" button (saves and proceeds)
- "Skip for Now" button (closes dialog)
- Enter key support for quick submission

### Files Modified:

**`src/components/LandingPage.tsx`**
- Added state management for onboarding flow
- Added `useUser()` hook from Clerk
- Added `handleGetStartedClick()` function
- Added `useEffect` to watch for sign-in completion
- Added hidden SignInButton for programmatic triggering
- Added ApiKeyOnboardingDialog component

---

## State Management

### State Variables:

```typescript
const [showApiKeyOnboarding, setShowApiKeyOnboarding] = useState(false)
const [pendingFolderAccess, setPendingFolderAccess] = useState(false)
const signInButtonRef = useRef<HTMLButtonElement>(null)
```

### State Flow:

1. **User clicks "Get Started"**
   - `pendingFolderAccess = true`
   - Triggers sign-in or API key dialog

2. **User signs in**
   - `useEffect` detects sign-in
   - Checks API key status
   - Shows dialog or proceeds

3. **User adds API key**
   - Dialog closes
   - `pendingFolderAccess = false`
   - Triggers folder selection

4. **User skips API key**
   - Dialog closes
   - `pendingFolderAccess` remains (can try again)

---

## Component Props

### ApiKeyOnboardingDialog

```typescript
interface ApiKeyOnboardingDialogProps {
  open: boolean                    // Controls dialog visibility
  onOpenChange: (open: boolean) => void  // Callback when dialog opens/closes
  onComplete: () => void           // Callback when API key is saved
}
```

**Usage:**
```tsx
<ApiKeyOnboardingDialog
  open={showApiKeyOnboarding}
  onOpenChange={setShowApiKeyOnboarding}
  onComplete={handleApiKeyOnboardingComplete}
/>
```

---

## User Experience

### Welcome Message:
```
Welcome to Design OS!

To use AI-powered features, you'll need an OpenRouter API key.

Design OS uses AI to help you create professional product documentation. 
Add your OpenRouter API key to get started, or skip and add it later in Settings.
```

### Actions:
- **Continue** - Saves API key and proceeds to folder selection
- **Skip for Now** - Closes dialog, user can add key later in Settings
- **Get API Key** - Link to OpenRouter dashboard

### Validation:
- ✅ Checks for empty input
- ✅ Validates API key format (`sk-or-v1-...`)
- ✅ Shows error messages
- ✅ Prevents submission while saving

### Keyboard Support:
- ✅ Auto-focus on API key input
- ✅ Enter key submits form
- ✅ Escape key closes dialog

---

## Error Handling

### Invalid API Key Format:
```
Invalid API key format. OpenRouter keys start with "sk-or-v1-"
```

### Empty Input:
```
Please enter an API key to continue
```

### Save Failed:
```
Failed to save API key to browser storage
```

---

## Privacy & Security

### API Key Storage:
- ✅ Stored in browser localStorage (client-side only)
- ✅ Never sent to our servers
- ✅ User-specific (per browser)
- ✅ Can be cleared at any time

### Access Control:
- ✅ Only authenticated users can proceed
- ✅ Uses Clerk authentication
- ✅ API key optional (can skip)

---

## Testing Scenarios

### Test 1: New User (Not Signed In, No API Key)
1. Click "Get Started"
2. Sign-in modal appears
3. Sign in with Clerk
4. API key onboarding dialog appears
5. Add API key
6. Folder selection dialog appears

### Test 2: Signed In User (No API Key)
1. Click "Get Started"
2. API key onboarding dialog appears immediately
3. Add API key
4. Folder selection dialog appears

### Test 3: Signed In User (Has API Key)
1. Click "Get Started"
2. Folder selection dialog appears immediately

### Test 4: Skip API Key
1. Click "Get Started"
2. Sign in (if needed)
3. API key dialog appears
4. Click "Skip for Now"
5. Dialog closes
6. Can add key later in Settings

### Test 5: Invalid API Key
1. Enter invalid key (e.g., "test123")
2. Click "Continue"
3. Error message appears
4. Cannot proceed until valid key entered

---

## Benefits

✅ **Guided Experience** - Users know exactly what to do  
✅ **Progressive Disclosure** - Only shows what's needed  
✅ **Flexible** - Can skip API key and add later  
✅ **Persistent Intent** - Remembers user wanted to get started  
✅ **Clear Messaging** - Explains why each step is needed  
✅ **Error Prevention** - Validates input before proceeding  

---

## Future Enhancements

### Potential Improvements:
- [ ] Show progress indicator (Step 1 of 3)
- [ ] Add tooltips explaining each step
- [ ] Remember if user skipped API key (don't show again)
- [ ] Add "Test API Key" button to verify it works
- [ ] Show estimated cost per AI generation

---

**Status:** ✅ **Complete and ready for production!**

Users are now guided through a smooth onboarding process that ensures they're authenticated and have an API key before proceeding to folder selection.

