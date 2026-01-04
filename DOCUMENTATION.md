# Unslop AI Documentation

**AI-Powered Product Planning & Design Tool**

🌐 **Website:** [unslop.design](https://unslop.design)

---

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Features](#features)
4. [Planning Workflow](#planning-workflow)
5. [AI Integration](#ai-integration)
6. [File Structure](#file-structure)
7. [Tips & Best Practices](#tips--best-practices)
8. [Troubleshooting](#troubleshooting)

---

## Introduction

Unslop AI is an AI-powered product planning and design tool that helps you:

- **Define** your product vision and roadmap
- **Generate** data models and design systems with AI
- **Design** screen components with sample data
- **Export** production-ready handoff packages

Unlike traditional design tools, Unslop AI focuses on the planning phase—helping you think through what you're building before you build it.

---

## Getting Started

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/unslopai/unslop.git
   cd unslop
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Alert Dialog package**
   ```bash
   npm install @radix-ui/react-alert-dialog
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

### First-Time Setup

1. **Choose Project Folder**
   - Click "Choose Project Folder" on the landing page
   - Select a directory where your product files will be saved
   - Grant read/write permissions
   - The folder will be remembered across sessions

2. **Configure AI (Optional)**
   - Click the settings icon
   - Add your OpenAI API key
   - Choose your preferred model (GPT-4o recommended)

3. **Start Planning**
   - Follow the guided workflow
   - Use AI generation for faster results
   - Review and refine AI suggestions

---

## Features

### 🤖 AI-Powered Generation

#### Data Model Generation
- AI analyzes your product overview and roadmap
- Generates entities and relationships automatically
- You can provide hints or let AI generate from scratch
- Saves to `product/data-model/data-model.md`

#### Design Token Suggestions
- AI suggests color palettes based on product personality
- Recommends typography that matches your use case
- Returns valid Tailwind colors and Google Fonts
- Saves to `product/design-system/colors.json` and `typography.json`

#### Shell Generation
- AI creates navigation structure from roadmap sections
- Suggests layout pattern (sidebar vs topbar)
- Generates complete shell specification
- Saves to `product/shell/spec.md`

### 💾 Persistent Workspace

#### Auto-Save
- All generated files automatically save to correct locations
- No manual downloads or file organization needed
- Works with File System Access API (Chrome, Edge, Opera)
- Falls back to downloads in other browsers

#### Persistent Folder
- Selected folder remembered across browser sessions
- Uses IndexedDB to store directory handle
- Permission re-requested if needed
- Works across browser restarts

### 🔄 New Project Button

- Start a new project with one click
- Clears current folder selection
- Your existing files aren't deleted
- Select the same folder to continue previous project

---

## Planning Workflow

### Phase 1: Product Definition

#### Step 1: Product Overview
Define your product vision:
- **Product Name** - What you're building
- **Description** - Brief overview
- **Problems** - What problems does it solve?
- **Solutions** - How does it solve them?
- **Key Features** - Main capabilities

**Output:** `product/product-overview.md`

#### Step 2: Product Roadmap
Break down into development sections:
- **Section Title** - Feature area name
- **Description** - What this section covers
- **3-5 sections recommended** - Each should be self-contained

**Output:** `product/product-roadmap.md`

### Phase 2: Data Model

Define core entities and relationships:
- **Entity Name** - e.g., User, Post, Comment
- **Description** - What this entity represents
- **Relationships** - How entities connect

**AI Generation Available:**
- Click "Generate with AI" button
- AI uses product context to suggest entities
- Review and refine suggestions

**Output:** `product/data-model/data-model.md`

### Phase 3: Design System

#### Step 1: Design Tokens
Choose your visual identity:
- **Primary Color** - Main accent (Tailwind colors)
- **Secondary Color** - Secondary accent
- **Neutral Color** - Backgrounds, text, borders
- **Heading Font** - For headings (Google Fonts)
- **Body Font** - For paragraphs
- **Mono Font** - For code

**AI Generation Available:**
- Click "Generate with AI" button
- AI suggests colors and fonts based on product
- Analyzes product personality and use case

**Output:** 
- `product/design-system/colors.json`
- `product/design-system/typography.json`

#### Step 2: Application Shell
Design navigation and layout:
- **Layout Type** - Sidebar or topbar navigation
- **Navigation Items** - Main menu items
- **User Menu** - Profile, settings, logout

**AI Generation Available:**
- Click "Generate with AI" button
- AI creates navigation from roadmap sections
- Suggests appropriate layout pattern

**Output:** `product/shell/spec.md`

### Phase 4: Sections

For each section in your roadmap:

#### Step 1: Shape Section
Define the specification:
- **User Flows** - How users interact
- **UI Requirements** - What screens are needed
- **Data Requirements** - What data is displayed

#### Step 2: Sample Data
Create realistic sample data:
- **TypeScript Types** - Data interfaces
- **Sample JSON** - Example data for designs

#### Step 3: Design Screen
Build React components:
- **Props-based** - Accept data via props
- **Responsive** - Mobile-first design
- **Light/Dark Mode** - Support both themes
- **Design Tokens** - Use product colors and fonts

#### Step 4: Screenshot
Capture visuals:
- **Light Mode** - Screenshot in light theme
- **Dark Mode** - Screenshot in dark theme

### Phase 5: Export

Generate complete handoff package:
- **Ready-to-Use Prompts** - For coding agents
- **Implementation Instructions** - Step-by-step guides
- **Test Specifications** - TDD-ready test cases
- **All Components** - Props-based React components
- **All Data** - Types and sample data
- **All Specs** - Product and section specifications

**Output:** `product-plan/` directory (ZIP file)

---

## AI Integration

### Supported Models

- **GPT-4o** (recommended) - Best quality, balanced speed
- **GPT-4o Mini** - Faster, lower cost
- **GPT-4 Turbo** - High quality, slower
- **GPT-3.5 Turbo** - Fast, lower quality

### Configuration

1. **Get API Key**
   - Visit [platform.openai.com](https://platform.openai.com)
   - Create account or sign in
   - Go to API Keys section
   - Create new secret key
   - Copy the key

2. **Add to Unslop AI**
   - Click settings icon in app
   - Paste API key
   - Choose default model
   - Save settings

3. **Usage**
   - API key stored in browser localStorage
   - Never sent to Unslop AI servers
   - Only used for OpenAI API calls
   - You control all AI generation

### AI Generation Tips

#### For Better Data Models
- Be specific in product overview
- Define clear problems and solutions
- Mention key entities in features
- Provide entity hints if needed

#### For Better Design Tokens
- Describe product personality
- Mention target audience
- Specify industry or use case
- Review and adjust suggestions

#### For Better Shell
- Define clear sections in roadmap
- Use descriptive section titles
- Mention navigation preferences
- Choose appropriate layout type

---

## File Structure

```
your-project/
├── product/                       # Product definition (portable)
│   ├── product-overview.md        # Product vision
│   ├── product-roadmap.md         # Development sections
│   │
│   ├── data-model/                # Global data model
│   │   └── data-model.md          # Entity descriptions
│   │
│   ├── design-system/             # Design tokens
│   │   ├── colors.json            # Color palette
│   │   └── typography.json        # Font choices
│   │
│   ├── shell/                     # Application shell
│   │   └── spec.md                # Shell specification
│   │
│   └── sections/                  # Section specs and data
│       └── [section-name]/
│           ├── spec.md            # Section specification
│           ├── data.json          # Sample data
│           ├── types.ts           # TypeScript interfaces
│           └── *.png              # Screenshots
│
├── src/
│   ├── shell/                     # Shell design components
│   │   ├── components/
│   │   │   ├── AppShell.tsx
│   │   │   ├── MainNav.tsx
│   │   │   └── UserMenu.tsx
│   │   └── ShellPreview.tsx
│   │
│   └── sections/                  # Section screen designs
│       └── [section-name]/
│           ├── components/        # Exportable components
│           └── [ViewName].tsx     # Preview wrapper
│
└── product-plan/                  # Export package (generated)
    ├── README.md                  # Quick start guide
    ├── prompts/                   # Ready-to-use prompts
    ├── instructions/              # Implementation guides
    └── [all your work]            # Components, data, specs
```

---

## Tips & Best Practices

### Planning Tips

1. **Start Small**
   - Begin with 3-5 sections
   - Add more later if needed
   - Each section should be self-contained

2. **Be Specific**
   - Clear product descriptions help AI
   - Specific problems lead to better solutions
   - Detailed features guide data models

3. **Iterate**
   - Review AI suggestions
   - Refine and regenerate
   - Don't accept first result blindly

### Design Tips

1. **Use Design Tokens**
   - Define tokens before screen designs
   - Consistent colors and fonts
   - Easier to update later

2. **Mobile First**
   - Design for mobile screens first
   - Use Tailwind responsive prefixes
   - Test in different viewport sizes

3. **Light & Dark Mode**
   - Use `dark:` variants for all colors
   - Test both themes
   - Ensure readability in both

### Export Tips

1. **Complete All Phases**
   - Better exports with complete data
   - All sections designed
   - Screenshots captured

2. **Review Before Export**
   - Check all specs
   - Verify sample data
   - Test components

3. **Use Prompts**
   - Ready-to-use prompts included
   - Copy/paste into coding agents
   - Follow implementation instructions

---

## Troubleshooting

### File System Access

**Problem:** "File System Access API not supported"
- **Solution:** Use Chrome, Edge, or Opera browser
- **Fallback:** Files will download instead

**Problem:** "Permission denied"
- **Solution:** Click "Choose Project Folder" again
- **Solution:** Grant read/write permissions when prompted

**Problem:** "Folder not remembered after restart"
- **Solution:** Check browser settings for IndexedDB
- **Solution:** Ensure cookies/storage not cleared on exit

### AI Generation

**Problem:** "API key invalid"
- **Solution:** Check API key in settings
- **Solution:** Ensure key is active on OpenAI platform
- **Solution:** Check for extra spaces when pasting

**Problem:** "AI generation failed"
- **Solution:** Check internet connection
- **Solution:** Verify API key has credits
- **Solution:** Try different model

**Problem:** "AI suggestions not relevant"
- **Solution:** Add more detail to product overview
- **Solution:** Be more specific in roadmap
- **Solution:** Provide hints when generating

### General Issues

**Problem:** "New Project button not working"
- **Solution:** Refresh the page
- **Solution:** Check browser console for errors
- **Solution:** Clear browser cache

**Problem:** "Files not saving"
- **Solution:** Check folder permissions
- **Solution:** Ensure enough disk space
- **Solution:** Try different folder

**Problem:** "Components not rendering"
- **Solution:** Check browser console for errors
- **Solution:** Verify all dependencies installed
- **Solution:** Restart development server

---

## Support

- **Documentation:** [unslop.design/docs](https://unslop.design/docs)
- **GitHub Issues:** [github.com/unslopai/unslop/issues](https://github.com/unslopai/unslop/issues)
- **Email:** support@unslop.design

---

**Built with ❤️ by the Unslop AI team**

