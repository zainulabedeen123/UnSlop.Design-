# User API Key Feature

## Overview

Users can now provide their own OpenRouter API key to use AI features in Unslop AI. This feature is **only available to authenticated users** (signed in with Clerk).

---

## Why This Feature?

1. **User Control**: Users have full control over their AI usage and costs
2. **Privacy**: API keys are stored locally in the browser, never sent to our servers
3. **Flexibility**: Users can use their own OpenRouter credits and choose their preferred models
4. **Security**: Only authenticated users can access this feature

---

## How It Works

### For Users:

1. **Sign In** with Clerk authentication
2. **Click Settings Icon** (⚙️) in the header (appears next to user avatar)
3. **Enter OpenRouter API Key** in the settings dialog
4. **Save** - The key is stored in browser localStorage
5. **Use AI Features** - All AI generation will use your personal API key

### For Developers:

The system checks for API keys in this priority order:

1. **User's API Key** (from localStorage) - **Priority 1**
2. **Default API Key** (from `.env` file) - **Priority 2**
3. **None** - AI features disabled

---

## Implementation Details

### Files Created:

1. **`src/lib/user-api-key-service.ts`**
   - localStorage service for API key management
   - Save, get, clear, validate API keys
   - Mask API keys for display

2. **`src/components/SettingsDialog.tsx`**
   - Settings modal component
   - API key input and management
   - Success/error states
   - Link to get OpenRouter API key

### Files Modified:

1. **`src/lib/ai-service.ts`**
   - Updated to check user's API key first
   - Falls back to default key if no user key
   - Reinitializes client when API key changes

2. **`src/components/AppLayout.tsx`**
   - Added Settings button (only visible when signed in)
   - Positioned before UserButton

3. **`src/components/LandingPage.tsx`**
   - Added Settings button (only visible when signed in)
   - Positioned before UserButton

4. **`.env`**
   - Disabled default API key
   - Users must provide their own

---

## User Experience

### When Signed Out:
- ❌ Settings button not visible
- ❌ Cannot configure API key
- ❌ AI features disabled (no default key)

### When Signed In (No API Key):
- ✅ Settings button visible
- ✅ Can configure API key
- ❌ AI features disabled until key is added
- 💡 Error message: "Please add your API key in Settings"

### When Signed In (With API Key):
- ✅ Settings button visible
- ✅ Can view/update/clear API key
- ✅ AI features fully functional
- ✅ All AI requests use user's key

---

## Security Features

### API Key Storage:
- ✅ Stored in browser localStorage (client-side only)
- ✅ Never sent to our servers
- ✅ Masked when displayed (`sk-or-v1-••••••••abcd`)
- ✅ Can be cleared at any time

### Access Control:
- ✅ Settings only accessible to signed-in users
- ✅ Uses Clerk's `<SignedIn>` component
- ✅ Settings button hidden when signed out

### Validation:
- ✅ Validates API key format (must start with `sk-or-v1-`)
- ✅ Shows error for invalid keys
- ✅ Prevents saving empty keys

---

## API Key Management

### Save API Key:
```typescript
userApiKeyService.saveApiKey('sk-or-v1-...')
```

### Get API Key:
```typescript
const apiKey = userApiKeyService.getApiKey()
```

### Clear API Key:
```typescript
userApiKeyService.clearApiKey()
```

### Check if Key Exists:
```typescript
const hasKey = userApiKeyService.hasApiKey()
```

### Validate Key Format:
```typescript
const isValid = userApiKeyService.validateApiKey('sk-or-v1-...')
```

### Mask Key for Display:
```typescript
const masked = userApiKeyService.maskApiKey('sk-or-v1-1234567890abcdef')
// Returns: "sk-or-v1-••••••••cdef"
```

---

## Settings Dialog Features

### Current Status Display:
- Shows if API key is configured
- Displays masked API key
- Green success indicator

### API Key Input:
- Password field (hidden characters)
- Placeholder: `sk-or-v1-...`
- Link to get OpenRouter API key
- Validation on save

### Actions:
- **Save** - Saves API key to localStorage
- **Clear** - Removes API key from localStorage
- Success/error messages

### Help Text:
- Instructions on where to get API key
- Privacy notice about local storage
- Link to OpenRouter dashboard

---

## Error Messages

### No API Key Configured:
```
OpenRouter API key not configured. Please add your API key in Settings or configure VITE_OPENROUTER_API_KEY in your .env file.
```

### Invalid API Key Format:
```
Invalid API key format. OpenRouter keys start with "sk-or-v1-"
```

### Save Failed:
```
Failed to save API key to browser storage
```

---

## Testing

### Manual Testing Steps:

1. **Sign In**
   - Verify Settings button appears
   - Click Settings button
   - Dialog should open

2. **Add API Key**
   - Enter valid OpenRouter API key
   - Click Save
   - Should show success message
   - Should display masked key

3. **Use AI Features**
   - Go to any form with AI
   - Generate content
   - Should work with user's key

4. **Clear API Key**
   - Open Settings
   - Click Clear
   - Key should be removed
   - AI features should be disabled

5. **Sign Out**
   - Settings button should disappear
   - API key remains in localStorage (user-specific)

---

## Deployment Notes

### Environment Variables:

**Remove or comment out** the default API key in production:

```bash
# .env (production)
# VITE_OPENROUTER_API_KEY=  # Disabled - users provide their own
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

### Vercel:

1. Remove `VITE_OPENROUTER_API_KEY` from environment variables
2. Keep `VITE_CLERK_PUBLISHABLE_KEY` configured
3. Redeploy

---

## Benefits

✅ **User Control** - Users manage their own AI costs  
✅ **Privacy** - Keys stored locally, never on servers  
✅ **Security** - Only authenticated users can configure  
✅ **Flexibility** - Users can use any OpenRouter model  
✅ **Transparency** - Clear indication of key status  
✅ **Easy Management** - Simple save/clear interface  

---

**Status:** ✅ **Complete and ready for production!**

Users can now sign in and provide their own OpenRouter API key to use all AI features in Unslop AI.

