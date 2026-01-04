# Deployment Checklist

## Pre-Deployment

### Code Quality
- [x] TypeScript compiles without errors
- [x] No linting errors
- [x] All imports resolved
- [x] No console errors in dev mode
- [x] All unused imports removed
- [x] Proper null checks added

### Sample Data Cleanup
- [x] `product/product-overview.md` deleted (CanvasAI sample)
- [x] `product/data-model/data-model.md` deleted (CanvasAI sample)
- [x] `product/design-system/colors.json` deleted (sample colors)
- [x] `product/design-system/typography.json` deleted (sample fonts)
- [x] `product/shell/spec.md` deleted (CanvasAI sample)
- [x] Users now start with completely empty forms

### Dependencies
- [x] `openai` package added to package.json
- [ ] Run `npm install` to install dependencies
- [ ] Verify package-lock.json is updated

### Environment Variables
- [ ] Create `.env.example` file with template
- [ ] Document required environment variables
- [ ] Add `.env` to `.gitignore` (should already be there)

### Documentation
- [x] User guide for AI integration (`docs/ai-integration.md`)
- [x] User guide for auto-save (`docs/auto-save.md`)
- [x] Implementation summary (`AI_INTEGRATION_SUMMARY.md`)
- [x] Implementation summary (`AUTO_SAVE_IMPLEMENTATION.md`)
- [x] Testing guide (`TESTING_GUIDE.md`)
- [x] README updated with new features

## Testing

### Manual Testing
- [ ] Test ProductVisionForm without AI
- [ ] Test ProductVisionForm with AI
- [ ] Test ProductRoadmapForm without AI
- [ ] Test ProductRoadmapForm with AI
- [ ] Test auto-save in Chrome
- [ ] Test auto-save fallback in Firefox
- [ ] Test error handling (invalid API key)
- [ ] Test error handling (network error)
- [ ] Test folder access prompt
- [ ] Test file creation
- [ ] Test folder creation

### Browser Testing
- [ ] Chrome (latest)
- [ ] Edge (latest)
- [ ] Firefox (latest) - verify download fallback
- [ ] Safari (if available) - verify download fallback

### Functionality Testing
- [ ] AI model selection works
- [ ] Custom model ID works
- [ ] Regeneration works
- [ ] Download button works
- [ ] Copy button works
- [ ] Auto-save creates correct folders
- [ ] Auto-save creates correct files
- [ ] Success messages display correctly
- [ ] Error messages display correctly

## Deployment Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Build for Production
```bash
npm run build
```

### 3. Test Production Build
```bash
npm run preview
```

### 4. Verify Build
- [ ] No build errors
- [ ] No TypeScript errors
- [ ] Bundle size reasonable
- [ ] All features work in production build

### 5. Deploy
Follow your normal deployment process (Vercel, Netlify, etc.)

## Post-Deployment

### Verification
- [ ] Site loads correctly
- [ ] AI features work (with API key)
- [ ] Auto-save works (in supported browsers)
- [ ] Download fallback works (in unsupported browsers)
- [ ] No console errors
- [ ] No network errors

### User Communication
- [ ] Update changelog
- [ ] Announce new features
- [ ] Share documentation links
- [ ] Provide setup instructions

## Environment Variables

### Required for AI Features
```
VITE_OPENROUTER_API_KEY=your_openrouter_api_key
```

### Optional
None currently

## Known Limitations

### Auto-Save
- Only works in Chrome, Edge, and Chromium-based browsers
- Requires user to grant folder access
- Cannot persist folder handle across sessions (browser limitation)
- Falls back to download in unsupported browsers

### AI Features
- Requires OpenRouter API key
- API calls cost money (though Gemini Flash is free)
- Requires internet connection
- Rate limits apply (per OpenRouter)

## Troubleshooting

### "openai is not defined"
**Solution:** Run `npm install`

### "OpenRouter API key not configured"
**Solution:** 
1. Create `.env` file
2. Add `VITE_OPENROUTER_API_KEY=your_key`
3. Restart dev server

### Auto-save not working
**Solution:**
1. Check browser (Chrome/Edge only)
2. Grant folder access
3. Check folder permissions

### Files not saving
**Solution:**
1. Check browser console for errors
2. Verify folder access granted
3. Try download button instead

## Rollback Plan

If issues arise:

1. **Revert AI features:**
   - Remove `openai` from package.json
   - Remove AI-related code from forms
   - Remove `src/lib/ai-service.ts`
   - Remove `src/components/forms/AIModelSelector.tsx`

2. **Revert auto-save:**
   - Remove `src/lib/file-system-service.ts`
   - Remove `src/components/forms/AutoSaveStatus.tsx`
   - Remove auto-save code from forms

3. **Quick rollback:**
   ```bash
   git revert HEAD
   npm install
   npm run build
   ```

## Success Criteria

✅ All tests pass  
✅ No TypeScript errors  
✅ No console errors  
✅ AI features work with API key  
✅ Auto-save works in Chrome/Edge  
✅ Download fallback works in Firefox/Safari  
✅ Documentation complete  
✅ Users can set up and use features  

## Support Resources

- **AI Integration Guide:** `docs/ai-integration.md`
- **Auto-Save Guide:** `docs/auto-save.md`
- **Testing Guide:** `TESTING_GUIDE.md`
- **Implementation Details:** `AI_INTEGRATION_SUMMARY.md` & `AUTO_SAVE_IMPLEMENTATION.md`

## Next Steps After Deployment

1. Monitor for errors
2. Gather user feedback
3. Track API usage/costs
4. Consider adding features to more forms
5. Consider adding streaming AI responses
6. Consider adding batch file saving

