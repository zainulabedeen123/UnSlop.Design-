# Testing Guide

## Prerequisites

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up OpenRouter API key** (for AI features):
   ```bash
   # Create .env file
   echo "VITE_OPENROUTER_API_KEY=your_api_key_here" > .env
   ```

3. **Start dev server:**
   ```bash
   npm run dev
   ```

## Test 1: AI Integration (Product Vision Form)

### Without API Key

1. Navigate to `/product-vision`
2. **Expected:** No AI toggle appears
3. Fill out the form
4. Click "Generate Product Overview"
5. **Expected:** Direct markdown generation (no AI)

### With API Key

1. Add API key to `.env`
2. Restart dev server
3. Navigate to `/product-vision`
4. **Expected:** AI toggle and model selector appear
5. Fill out the form with minimal info:
   - Product Name: "TaskFlow"
   - Description: "A task management app"
   - Problem: "People forget tasks" / "Reminders"
   - Feature: "Smart notifications"
6. Click "Generate Product Overview"
7. **Expected:** 
   - Loading spinner appears
   - AI generates expanded, professional content
   - Content is much more detailed than input

### Test Regeneration

1. After generating, click "Regenerate with AI"
2. **Expected:** New content generated (may be different)

### Test Model Selection

1. Select "Claude 3.5 Sonnet" from dropdown
2. Click "Regenerate with AI"
3. **Expected:** Content generated with Claude model

### Test Custom Model

1. Select "Custom Model ID..." from dropdown
2. Enter: `anthropic/claude-3.5-sonnet`
3. Click "Regenerate with AI"
4. **Expected:** Content generated with custom model

## Test 2: Auto-Save Feature

### First Time (No Access)

1. Navigate to `/product-vision`
2. **Expected:** See "Enable Auto-Save" prompt with "Choose Project Folder" button
3. Fill out form and generate content
4. **Expected:** File is downloaded (fallback)

### Grant Access

1. Click "Choose Project Folder"
2. Select your Design OS project root folder
3. **Expected:** Browser shows permission dialog
4. Grant permission
5. **Expected:** "Auto-save enabled" message appears

### Test Auto-Save

1. Fill out form and generate content
2. **Expected:** 
   - Success message: "File saved successfully to product/product-overview.md"
   - File path shown
3. Check your project folder
4. **Expected:** File exists at `product/product-overview.md`

### Test Folder Creation

1. Delete the `product/` folder from your project
2. Generate content again
3. **Expected:** 
   - `product/` folder is created automatically
   - File is saved inside

## Test 3: Product Roadmap Form

### Test AI Enhancement

1. Navigate to `/product-roadmap`
2. Fill out sections with brief descriptions:
   - Section 1: "User Auth" / "Login and signup"
   - Section 2: "Dashboard" / "Main app interface"
   - Section 3: "Settings" / "User preferences"
3. Enable AI and generate
4. **Expected:** 
   - AI expands descriptions into professional one-sentence summaries
   - Each description is clear and detailed

### Test Auto-Save

1. Generate roadmap
2. **Expected:** 
   - File saved to `product/product-roadmap.md`
   - Success message shown
3. Check project folder
4. **Expected:** File exists with correct content

## Test 4: Error Handling

### Test Invalid API Key

1. Set invalid API key in `.env`: `VITE_OPENROUTER_API_KEY=invalid_key`
2. Restart dev server
3. Try to generate with AI
4. **Expected:** 
   - Error message shown
   - No crash
   - Can still use direct generation

### Test Network Error

1. Disconnect internet
2. Try to generate with AI
3. **Expected:** 
   - Error message shown
   - Can still use direct generation

### Test File Save Error

1. Try to save to a read-only location (if possible)
2. **Expected:** 
   - Error message shown
   - Falls back to download

## Test 5: Browser Compatibility

### Chrome/Edge (Supported)

1. Open in Chrome or Edge
2. **Expected:** 
   - Auto-save works
   - "Choose Project Folder" button appears
   - Files save directly to project

### Firefox/Safari (Not Supported)

1. Open in Firefox or Safari
2. **Expected:** 
   - Message: "Auto-save not supported in this browser"
   - Files are downloaded instead
   - Everything else works normally

## Test 6: UI/UX

### Loading States

1. Generate content with AI
2. **Expected:** 
   - Button shows "Generating with AI..." with spinner
   - Button is disabled during generation
   - No double-submissions possible

### Success States

1. After generation
2. **Expected:** 
   - Success message with green checkmark
   - File path shown
   - Download and copy buttons work

### Error States

1. Trigger an error (invalid API key, etc.)
2. **Expected:** 
   - Error message with red icon
   - Clear error description
   - Can retry

## Test 7: Complete Workflow

1. Start fresh (no API key, no folder access)
2. Add API key to `.env`
3. Restart dev server
4. Navigate to `/product-vision`
5. Click "Choose Project Folder" and grant access
6. Fill out form with minimal info
7. Generate with AI
8. **Expected:** 
   - AI generates professional content
   - File auto-saves to project
   - Success message shown
9. Navigate to `/product-roadmap`
10. Fill out sections
11. Generate with AI
12. **Expected:** 
    - AI enhances descriptions
    - File auto-saves to project
    - Success message shown
13. Check project folder
14. **Expected:** 
    - `product/product-overview.md` exists
    - `product/product-roadmap.md` exists
    - Both have correct content

## Common Issues

### "OpenRouter API key not configured"
- Check `.env` file exists
- Check key starts with `VITE_OPENROUTER_API_KEY=`
- Restart dev server

### "this.client.chatCompletion is not a function"
- Run `npm install openai`
- Restart dev server

### Auto-save not working
- Check browser (Chrome/Edge only)
- Check folder permissions
- Try granting access again

### Files not appearing in project
- Check you selected the correct folder
- Check folder permissions
- Look for downloaded files instead

## Success Criteria

✅ AI generates enhanced content  
✅ Multiple models work  
✅ Custom model IDs work  
✅ Auto-save creates files in correct locations  
✅ Folder structure created automatically  
✅ Error messages are clear and helpful  
✅ Fallback to download works  
✅ Loading states show correctly  
✅ No TypeScript errors  
✅ No console errors  
✅ Works in Chrome/Edge  
✅ Graceful degradation in Firefox/Safari

