# Runtime File Loading Fix

## 🐛 Problem

**User-generated files were not visible in the app after being saved.**

### Symptoms:
1. ❌ User creates `product-overview.md` and `product-roadmap.md`
2. ❌ Files are saved to disk successfully
3. ❌ User navigates to Product page → **Content not shown**
4. ❌ User navigates to Data Model page → **Content not shown**
5. ❌ User clicks on Sections → **Warning: "Consider completing Data Model and Design before designing sections"**
6. ❌ Files exist on disk but app doesn't see them

### Root Cause:
The app was using `import.meta.glob()` which **only loads files at build time**. When users save files at runtime using the File System API, those files are saved to their local disk but are **NOT part of the Vite build**, so they're invisible to the app.

---

## ✅ Solution

Implemented **runtime file loading** using the File System API to read files from the user's selected directory.

### Architecture:

```
Build-time files (import.meta.glob)
    ↓
Runtime files (File System API)
    ↓
Merged data (runtime takes precedence)
    ↓
Display to user
```

---

## 📦 What Was Implemented

### 1. **Runtime File Loader** (`src/lib/runtime-file-loader.ts`)

New service that reads files from the user's selected directory:

**Features:**
- ✅ Read text files (markdown)
- ✅ Read JSON files
- ✅ Check if file exists
- ✅ List files in directory
- ✅ 5-second cache to reduce file system calls
- ✅ Automatic fallback if no directory access

**Key Methods:**
```typescript
await runtimeFileLoader.readFile('product/product-overview.md')
await runtimeFileLoader.readJsonFile('product/design-system/colors.json')
await runtimeFileLoader.fileExists('product/data-model/data-model.md')
await runtimeFileLoader.listFiles('product/sections')
```

---

### 2. **Async Loader Functions**

Added async versions of all loader functions that check runtime files first:

**Updated Files:**
- `src/lib/product-loader.ts` → `loadProductDataRuntime()`
- `src/lib/data-model-loader.ts` → `loadDataModelRuntime()`
- `src/lib/design-system-loader.ts` → `loadDesignSystemRuntime()`
- `src/lib/shell-loader.ts` → `loadShellInfoRuntime()`

**Pattern:**
```typescript
export async function loadProductDataRuntime(): Promise<ProductData> {
  // Try runtime files first
  const content = await runtimeFileLoader.readFile('product/product-overview.md')
  
  // Fall back to build-time files
  const final = content || productFiles['/product/product-overview.md']
  
  return parseData(final)
}
```

---

### 3. **React Hook** (`src/hooks/useProductData.ts`)

New hook that loads product data asynchronously:

```typescript
const productData = useProductData()
// Returns null while loading, then ProductData
```

**Features:**
- ✅ Loads data on mount
- ✅ Handles loading state
- ✅ Cleans up on unmount
- ✅ Error handling

---

### 4. **Updated Components**

All pages now use the async hook instead of synchronous loader:

**Before:**
```typescript
const productData = useMemo(() => loadProductData(), [])
```

**After:**
```typescript
const productData = useProductData()
```

**Updated Components:**
- ✅ `ProductPage.tsx`
- ✅ `DataModelPage.tsx`
- ✅ `DesignPage.tsx`
- ✅ `PhaseWarningBanner.tsx`

---

### 5. **File System Service Enhancement**

Added method to expose directory handle for reading:

```typescript
async getDirectoryHandle(): Promise<FileSystemDirectoryHandle | null>
```

---

## 🔄 How It Works Now

### User Flow:

1. **User creates product overview:**
   - Fills form
   - Clicks "Generate"
   - File saved to `product/product-overview.md`
   - **State updated** (project-state-service)

2. **User navigates to Product page:**
   - `useProductData()` hook loads
   - Calls `loadProductDataRuntime()`
   - Reads `product/product-overview.md` from disk
   - Parses and displays content ✅

3. **User navigates to Data Model page:**
   - Hook loads data
   - Reads `product/data-model/data-model.md` from disk
   - Displays content ✅

4. **User clicks on Sections:**
   - `PhaseWarningBanner` checks project state
   - Sees `hasDataModel = true` and `hasDesignSystem = true`
   - **No warning shown** ✅

---

## 📊 Data Flow

```
User saves file
    ↓
File System API writes to disk
    ↓
Project state updated (IndexedDB)
    ↓
User navigates to page
    ↓
useProductData() hook loads
    ↓
loadProductDataRuntime() called
    ↓
runtimeFileLoader.readFile() reads from disk
    ↓
Content parsed and returned
    ↓
Component renders with data ✅
```

---

## 🎯 Benefits

### 1. **Files Visible Immediately**
- No need to rebuild the app
- Content shows up right after saving

### 2. **Accurate State Tracking**
- Project state service tracks completion
- Warning banners work correctly
- Export validation works

### 3. **Persistent Across Sessions**
- Files saved to user's folder
- State saved to IndexedDB
- Both persist across page reloads

### 4. **Performance**
- 5-second cache reduces file system calls
- Async loading doesn't block UI
- Fallback to build-time files for speed

---

## 🧪 Testing

### Manual Test Flow:

1. **Test Product Overview:**
   ```
   1. Create product overview
   2. Navigate away
   3. Navigate back to Product page
   4. ✅ Content should be visible
   ```

2. **Test Data Model:**
   ```
   1. Create data model
   2. Navigate to Sections page
   3. ✅ No warning banner should appear
   ```

3. **Test Design System:**
   ```
   1. Create colors and typography
   2. Navigate to Sections page
   3. ✅ No warning banner should appear
   ```

4. **Test Page Reload:**
   ```
   1. Create some files
   2. Reload page
   3. Navigate to pages
   4. ✅ All content should be visible
   ```

---

## 📁 Files Created/Modified

### New Files:
1. ✅ `src/lib/runtime-file-loader.ts` - Runtime file reading service
2. ✅ `src/hooks/useProductData.ts` - React hook for async data loading
3. ✅ `RUNTIME_FILE_LOADING_FIX.md` - This documentation

### Modified Files:
1. ✅ `src/lib/file-system-service.ts` - Added `getDirectoryHandle()`
2. ✅ `src/lib/product-loader.ts` - Added `loadProductDataRuntime()`
3. ✅ `src/lib/data-model-loader.ts` - Added `loadDataModelRuntime()`
4. ✅ `src/lib/design-system-loader.ts` - Added `loadDesignSystemRuntime()`
5. ✅ `src/lib/shell-loader.ts` - Added `loadShellInfoRuntime()`
6. ✅ `src/components/ProductPage.tsx` - Uses `useProductData()`
7. ✅ `src/components/DataModelPage.tsx` - Uses `useProductData()`
8. ✅ `src/components/DesignPage.tsx` - Uses `useProductData()`
9. ✅ `src/components/PhaseWarningBanner.tsx` - Uses `useProductData()` and `useProjectState()`

---

## 🚀 Deployment

```bash
# Commit changes
git add .
git commit -m "Fix runtime file loading - files now visible after saving"
git push

# Vercel will automatically rebuild and deploy
```

---

## ✅ Summary

**Before:**
- ❌ Files saved but not visible
- ❌ Warning banners incorrect
- ❌ Export validation broken
- ❌ Required app rebuild to see files

**After:**
- ✅ Files visible immediately after saving
- ✅ Warning banners accurate
- ✅ Export validation works
- ✅ No rebuild needed
- ✅ State persists across sessions

**Status:** Complete and ready for testing! 🎉

---

**Implementation Date:** 2024-01-04
**Ready for:** Testing → Deployment

