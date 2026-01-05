# AI Model Preference Feature

## Overview

Users can now customize which AI model to use for content generation. The model preference is saved in the browser's localStorage and applies to all AI-powered features in the application.

---

## Default Model

**Gemini 3 Flash Preview** (`google/gemini-3-flash-preview`)
- ✅ Fast generation
- ✅ Free to use
- ✅ Good quality output
- ✅ Great for most use cases

This is the default model used when no custom preference is set.

---

## How It Works

### Model Selection Priority:

1. **Explicit Model Parameter** (highest priority)
   - When a specific model is passed to the AI service
   - Used in special cases or testing

2. **User's Saved Preference** (medium priority)
   - Model saved in Settings dialog
   - Stored in browser localStorage
   - Applies to all AI generations

3. **Default Model** (fallback)
   - `google/gemini-3-flash-preview`
   - Used when no custom preference is set

---

## User Experience

### Setting a Custom Model:

1. Click **Settings** icon (⚙️) in header
2. Scroll to **AI Model Preference** section
3. Enter a model ID from OpenRouter
4. Click **Save Settings**
5. Model preference is saved and used for all future AI generations

### Resetting to Default:

1. Open Settings dialog
2. Click **Reset to Default Model** button
3. Default model (Gemini 3 Flash) will be used

### Viewing Current Model:

The Settings dialog shows:
- ✅ Current custom model (if set)
- ✅ Default model being used (if no custom model)
- ✅ Masked API key (if configured)

---

## Implementation Details

### Files Modified:

1. **`src/lib/user-api-key-service.ts`**
   - Added model preference storage functions
   - `saveModel(modelId: string)` - Save model preference
   - `getModel()` - Get saved model preference
   - `clearModel()` - Clear model preference
   - `hasModel()` - Check if model is set

2. **`src/lib/ai-service.ts`**
   - Updated `generate()` method to check user's model preference
   - Updated `stream()` method to check user's model preference
   - Priority: explicit param > user preference > default

3. **`src/components/SettingsDialog.tsx`**
   - Added model selection UI
   - Shows current model status
   - Input for custom model ID
   - List of popular models
   - Reset to default button

---

## Storage

### localStorage Keys:

- `unslop_user_openrouter_api_key` - API key
- `unslop_user_model_preference` - Model ID

### Data Format:

```typescript
// API Key
localStorage.setItem('unslop_user_openrouter_api_key', 'sk-or-v1-...')

// Model Preference
localStorage.setItem('unslop_user_model_preference', 'anthropic/claude-3.5-sonnet')
```

---

## Popular Models

The Settings dialog suggests these popular models:

1. **google/gemini-flash-1.5** - Fast & Free
2. **anthropic/claude-3.5-sonnet** - High Quality
3. **openai/gpt-4o** - OpenAI Latest
4. **meta-llama/llama-3.1-70b-instruct** - Open Source

Users can also enter any model ID from [OpenRouter's model list](https://openrouter.ai/models).

---

## Code Examples

### Saving Model Preference:

```typescript
import { userApiKeyService } from '@/lib/user-api-key-service'

// Save custom model
userApiKeyService.saveModel('anthropic/claude-3.5-sonnet')

// Get saved model
const model = userApiKeyService.getModel()
// Returns: 'anthropic/claude-3.5-sonnet' or null

// Clear model preference
userApiKeyService.clearModel()

// Check if model is set
const hasModel = userApiKeyService.hasModel()
// Returns: true or false
```

### Using in AI Service:

```typescript
import { aiService } from '@/lib/ai-service'

// Generate with user's preferred model
const result = await aiService.generate({
  prompt: 'Write a product description',
  systemPrompt: 'You are a helpful assistant',
  // model parameter is optional - uses user preference or default
})

// Generate with explicit model (overrides user preference)
const result = await aiService.generate({
  prompt: 'Write a product description',
  model: 'openai/gpt-4o', // Explicit model takes priority
})
```

---

## UI Components

### Settings Dialog Sections:

1. **Current Status**
   - Shows API key status (masked)
   - Shows current model (custom or default)
   - Green success indicator

2. **API Key Input**
   - Password field for API key
   - Link to get OpenRouter key
   - Clear button (if key is set)

3. **AI Model Preference**
   - Text input for model ID
   - Placeholder shows default model
   - List of popular models
   - Link to browse all models
   - Reset button (if custom model is set)

4. **Actions**
   - Save Settings button (saves both API key and model)

---

## Benefits

✅ **Flexibility** - Users can choose any OpenRouter model  
✅ **Cost Control** - Select free or paid models based on budget  
✅ **Quality Control** - Choose models based on output quality needs  
✅ **Easy Reset** - One-click return to default model  
✅ **Persistent** - Preference saved across sessions  
✅ **Transparent** - Always shows which model is being used  

---

## Testing Scenarios

### Test 1: Set Custom Model
1. Open Settings
2. Enter model ID: `anthropic/claude-3.5-sonnet`
3. Click Save Settings
4. Success message appears
5. Generate content → Uses Claude 3.5 Sonnet

### Test 2: Reset to Default
1. Open Settings (with custom model set)
2. Click "Reset to Default Model"
3. Model preference cleared
4. Generate content → Uses Gemini 3 Flash

### Test 3: Invalid Model ID
1. Enter invalid model ID
2. Try to generate content
3. OpenRouter returns error
4. User can change model in Settings

### Test 4: No Model Set
1. Fresh install (no model preference)
2. Generate content
3. Uses default: `google/gemini-3-flash-preview`

---

## Error Handling

### Invalid Model ID:
- OpenRouter will return an error if model doesn't exist
- User can update model in Settings
- Error message shows in generation UI

### Storage Errors:
- Caught and logged to console
- User-friendly error message shown
- Doesn't break the application

---

## Future Enhancements

### Potential Improvements:
- [ ] Model dropdown with autocomplete
- [ ] Show model pricing information
- [ ] Test model button (verify it works)
- [ ] Model performance metrics
- [ ] Recently used models list
- [ ] Model comparison tool

---

**Status:** ✅ **Complete and ready for production!**

Users can now customize their AI model preference in Settings, with the default being Gemini 3 Flash Preview.

