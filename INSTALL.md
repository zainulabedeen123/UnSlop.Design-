# Unslop AI - Installation Guide

Quick guide to get Unslop AI running on your machine.

---

## Prerequisites

- **Node.js** 18+ ([download](https://nodejs.org))
- **npm** or **yarn** package manager
- **Modern browser** (Chrome, Edge, Opera recommended for File System API)

---

## Installation Steps

### 1. Clone Repository

```bash
git clone https://github.com/unslopai/unslop.git
cd unslop
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Install Alert Dialog Package

**Important:** This package is required for the New Project button.

```bash
npm install @radix-ui/react-alert-dialog
```

### 4. Run Development Server

```bash
npm run dev
```

The app will open at `http://localhost:3000`

---

## First-Time Setup

### 1. Choose Project Folder

When you first open Unslop AI, you'll see the landing page.

1. Click **"Get Started"** or **"Choose Project Folder"**
2. Select a directory where your product files will be saved
3. Grant **read/write permissions** when prompted
4. The folder will be remembered across sessions

### 2. Configure AI (Optional)

AI generation is optional but recommended for best experience.

1. Click the **settings icon** (gear) in the app
2. Add your **OpenAI API key**
   - Get one at [platform.openai.com](https://platform.openai.com)
   - Create account → API Keys → Create new key
3. Choose your preferred **AI model**
   - **GPT-4o** (recommended) - Best quality
   - **GPT-4o Mini** - Faster, lower cost
   - **GPT-4 Turbo** - High quality
   - **GPT-3.5 Turbo** - Fast, basic
4. Click **Save**

### 3. Start Planning

You're ready to go! Follow the guided workflow:

1. **Product Definition** - Define vision and roadmap
2. **Data Model** - Generate entities with AI
3. **Design System** - Get AI-suggested colors and fonts
4. **Sections** - Design screens for each feature
5. **Export** - Generate handoff package

---

## Build for Production

### Build

```bash
npm run build
```

Output will be in `dist/` directory.

### Preview Build

```bash
npm run preview
```

Test the production build locally.

---

## Troubleshooting

### "Module not found: @radix-ui/react-alert-dialog"

**Solution:**
```bash
npm install @radix-ui/react-alert-dialog
```

### "File System Access API not supported"

**Solution:** Use Chrome, Edge, or Opera browser. Other browsers will fall back to downloads.

### "Permission denied" when saving files

**Solution:** 
1. Click "Choose Project Folder" again
2. Grant read/write permissions when prompted
3. Ensure the folder is not read-only

### Port 3000 already in use

**Solution:**
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
npm run dev -- --port 3001
```

---

## Environment Variables

Unslop AI doesn't require environment variables for basic usage. All configuration is done in-app.

**Optional:**
- API keys stored in browser localStorage
- No server-side configuration needed

---

## Browser Compatibility

### Recommended
- ✅ Chrome 86+
- ✅ Edge 86+
- ✅ Opera 72+

### Supported (with limitations)
- ⚠️ Firefox - Downloads instead of direct file save
- ⚠️ Safari - Downloads instead of direct file save

### Features by Browser

| Feature | Chrome/Edge/Opera | Firefox/Safari |
|---------|-------------------|----------------|
| Auto-save to folder | ✅ Yes | ❌ Downloads |
| Persistent folder | ✅ Yes | ❌ No |
| AI generation | ✅ Yes | ✅ Yes |
| Export | ✅ Yes | ✅ Yes |
| All other features | ✅ Yes | ✅ Yes |

---

## Development

### Project Structure

```
unslop/
├── src/
│   ├── components/        # React components
│   ├── lib/              # Utilities and services
│   ├── types/            # TypeScript types
│   └── main.tsx          # Entry point
├── product/              # Sample product files
├── public/               # Static assets
└── package.json          # Dependencies
```

### Key Technologies

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Vite** - Build tool
- **Radix UI** - Accessible components
- **OpenAI API** - AI generation

### Scripts

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

---

## Next Steps

1. **Read Documentation** - See `DOCUMENTATION.md` for full guide
2. **Try AI Generation** - Configure API key and test features
3. **Plan Your Product** - Follow the guided workflow
4. **Export Package** - Generate handoff for implementation

---

## Support

- **Documentation:** [unslop.design/docs](https://unslop.design/docs)
- **GitHub Issues:** [github.com/unslopai/unslop/issues](https://github.com/unslopai/unslop/issues)
- **Email:** support@unslop.design

---

**Ready to build better products? Let's go! 🚀**

