# Auto-Save Feature

Design OS now includes automatic file saving that writes generated files directly to your project directory.

## How It Works

When you generate content (Product Overview, Roadmap, Data Model, etc.), Design OS can automatically save the files to the correct locations in your project:

- **Product Overview** → `product/product-overview.md`
- **Product Roadmap** → `product/product-roadmap.md`
- **Data Model** → `product/data-model/data-model.md`
- **Design Tokens** → `product/design-system/colors.json` & `typography.json`
- **And more...**

## Browser Support

Auto-save uses the **File System Access API**, which is supported in:

✅ **Chrome** (86+)  
✅ **Edge** (86+)  
✅ **Opera** (72+)  
✅ **Other Chromium-based browsers**

❌ **Not supported in:**
- Firefox
- Safari
- Older browsers

**Fallback:** If your browser doesn't support auto-save, files will be downloaded instead, and you'll need to manually save them to the correct locations.

## Setup

### First Time Use

1. **Generate content** using any form (Product Vision, Roadmap, etc.)
2. **Click "Choose Project Folder"** when prompted
3. **Select your Design OS project root folder** (the folder containing the `product/` directory)
4. **Grant permission** when the browser asks

That's it! From now on, all generated files will be automatically saved to the correct locations.

### What Happens

- Design OS creates the necessary folder structure (`product/`, `product/design-system/`, etc.)
- Files are saved with the correct names and paths
- You'll see a success message showing where the file was saved
- The file is immediately available in your project

## Using Auto-Save

### Enable Auto-Save

When you first use a form, you'll see a prompt:

```
Enable Auto-Save
Grant access to your project folder to automatically save generated files to the correct locations.

[Choose Project Folder]
```

Click the button and select your project root folder.

### After Enabling

Once enabled, you'll see:

```
✓ Auto-save enabled - files will be saved automatically
```

Every time you generate content, it will be automatically saved.

### Save Status

After generating content, you'll see one of these messages:

**Success:**
```
✓ File saved successfully to product/product-overview.md
```

**Download (fallback):**
```
✓ File downloaded as product-overview.md. Please save it to product/product-overview.md
```

**Error:**
```
✗ Failed to save file: [error message]
```

## File Paths

Design OS saves files to these locations:

| Form | File Path |
|------|-----------|
| Product Vision | `product/product-overview.md` |
| Product Roadmap | `product/product-roadmap.md` |
| Data Model | `product/data-model/data-model.md` |
| Design Tokens (Colors) | `product/design-system/colors.json` |
| Design Tokens (Typography) | `product/design-system/typography.json` |
| Shell Spec | `product/shell/spec.md` |
| Section Spec | `product/sections/[section-name]/spec.md` |
| Section Data | `product/sections/[section-name]/data.json` |
| Section Types | `product/sections/[section-name]/types.ts` |

## Privacy & Security

- **Local only:** Files are saved directly to your computer
- **No cloud storage:** Nothing is uploaded to any server
- **Permission required:** You must explicitly grant access to your project folder
- **Revocable:** You can revoke access at any time by clearing browser permissions

## Troubleshooting

### "Auto-save not supported in this browser"

**Solution:** Use Chrome, Edge, or another Chromium-based browser.

### "Choose Project Folder" button doesn't work

**Possible causes:**
1. Browser doesn't support File System Access API
2. Browser permissions are blocked
3. Running in an iframe or restricted context

**Solution:** 
- Use a supported browser
- Check browser permissions
- Make sure you're not in private/incognito mode

### Files aren't being saved

**Check:**
1. Did you grant folder access?
2. Is the folder writable?
3. Do you have disk space?
4. Check the browser console for errors

**Solution:** Try clicking "Choose Project Folder" again to re-grant access.

### Want to change the project folder

**Solution:** 
1. Clear browser permissions for the site
2. Refresh the page
3. Click "Choose Project Folder" again
4. Select the new folder

## Manual Download

If auto-save isn't working or you prefer manual control:

1. Generate your content
2. Click the **"Download File"** button
3. Save the file to the correct location manually

The UI will show you the correct path where the file should be saved.

## Benefits

✅ **Faster workflow** - No manual file saving  
✅ **Correct paths** - Files go to the right place automatically  
✅ **Folder creation** - Automatically creates necessary folders  
✅ **No mistakes** - Can't save to the wrong location  
✅ **Immediate availability** - Files are ready to use right away

## Next Steps

After files are auto-saved:

1. **Refresh the Design OS page** to see your content in the UI
2. **Continue to the next step** in the workflow
3. **Edit files directly** if needed - they're in your project folder

