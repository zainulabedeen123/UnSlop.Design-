# AI Assistant Instructions for Design OS

Design OS is a **product planning and design tool** that helps users define their product vision, structure their data model, design their UI, and prepare export packages for implementation in a separate codebase.

> **Important**: Design OS is a planning tool, not the end product codebase. The screen designs and components generated here are meant to be exported and integrated into your actual product's codebase.

---

## How to Use Design OS

Design OS can be used in **two ways**:

### Option 1: Interactive UI Forms (Recommended for All AI Editors)
The application provides interactive forms for each step of the planning process. Users can fill out forms directly in the browser, which generate the necessary markdown and JSON files.

**Workflow:**
1. User fills out a form in the UI
2. Form generates the appropriate markdown/JSON content
3. User downloads or copies the generated file
4. User saves the file to the correct location in `product/` directory
5. User refreshes the app to see the changes

**Available Forms:**
- Product Vision Form → `product/product-overview.md`
- Product Roadmap Form → `product/product-roadmap.md`
- Data Model Form → `product/data-model/data-model.md`
- Design Tokens Form → `product/design-system/colors.json` & `typography.json`
- (More forms available in the UI)

### Option 2: AI-Assisted File Creation
AI assistants can help users create the necessary files by:
1. Asking clarifying questions about the product
2. Generating the markdown/JSON content
3. Saving files directly to the `product/` directory (if the AI has file system access)
4. OR providing the content for the user to save manually

---

## Understanding Design OS Context

When working in Design OS, be aware of two distinct contexts:

### 1. Design OS Application
The React application that displays and manages planning files. When modifying the Design OS UI itself:
- Files live in `src/` (components, pages, utilities)
- Uses the Design OS design system (stone palette, DM Sans, etc.)
- Provides the interface for viewing specs, screen designs, exports, etc.

### 2. Product Design (Screen Designs & Exports)
The product you're planning and designing. When creating screen designs and exports:
- Screen design components live in `src/sections/[section-name]/` and `src/shell/`
- Product definition files live in `product/`
- Exports are packaged to `product-plan/` for integration into a separate codebase
- Follow the design requirements specified in each section's spec

---

## The Planning Flow

Design OS follows a structured planning sequence:

### 1. Product Overview
Define your product's core description, the problems it solves, and key features.
**Output:** `product/product-overview.md`

**Format:**
```markdown
# [Product Name]

## Description
[1-3 sentence description]

## Problems & Solutions

### Problem 1: [Title]
[How the product solves it]

### Problem 2: [Title]
[How the product solves it]

## Key Features
- [Feature 1]
- [Feature 2]
- [Feature 3]
```

### 2. Product Roadmap
Break your product into 3-5 development sections. Each section represents a self-contained area that can be designed and built independently.
**Output:** `product/product-roadmap.md`

**Format:**
```markdown
# Product Roadmap

## Sections

### 1. [Section Title]
[One sentence description]

### 2. [Section Title]
[One sentence description]

### 3. [Section Title]
[One sentence description]
```

### 3. Data Model
Define the core entities and relationships in your product.
**Output:** `product/data-model/data-model.md`

**Format:**
```markdown
# Data Model

## Entities

### [Entity Name]
[Description of what this entity represents]

### [Entity Name]
[Description]

## Relationships

- [Entity1] has many [Entity2]
- [Entity2] belongs to [Entity1]
```

### 4. Design System
Choose your color palette (from Tailwind) and typography (from Google Fonts).
**Output:** `product/design-system/colors.json`, `product/design-system/typography.json`

### 5. Application Shell
Design the persistent navigation and layout that wraps all sections.
**Output:** `product/shell/spec.md`, `src/shell/components/`

### 6. For Each Section:
- Define the specification
- Create sample data and types
- Create screen designs
- Capture screenshots (optional)

### 7. Export
Generate the complete export package with all components, types, and handoff documentation.
**Output:** `product-plan/`

---

## File Structure

```
product/                           # Product definition (portable)
├── product-overview.md            # Product description, problems/solutions, features
├── product-roadmap.md             # List of sections with titles and descriptions
│
├── data-model/                    # Global data model
│   └── data-model.md              # Entity descriptions and relationships
│
├── design-system/                 # Design tokens
│   ├── colors.json                # { primary, secondary, neutral }
│   └── typography.json            # { heading, body, mono }
│
├── shell/                         # Application shell
│   └── spec.md                    # Shell specification
│
└── sections/
    └── [section-name]/
        ├── spec.md                # Section specification
        ├── data.json              # Sample data for screen designs
        ├── types.ts               # TypeScript interfaces
        └── *.png                  # Screenshots
```

---

## Design Requirements

When creating screen designs, follow these guidelines:

- **Mobile Responsive**: Use Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`) to ensure layouts adapt properly across screen sizes.

- **Light & Dark Mode**: Use `dark:` variants for all colors. Test that all UI elements are visible and readable in both modes.

- **Use Design Tokens**: When design tokens are defined, apply the product's color palette and typography. Otherwise, fall back to `stone` for neutrals and `lime` for accents.

- **Props-Based Components**: All screen design components must accept data and callbacks via props. Never import data directly in exportable components.

- **No Navigation in Section Screen Designs**: Section screen designs should not include navigation chrome. The shell handles all navigation.

---

## Tailwind CSS Directives

These rules apply to both the Design OS application and all screen designs/components it generates:

- **Tailwind CSS v4**: We always use Tailwind CSS v4 (not v3). Do not reference or create v3 patterns.

- **No tailwind.config.js**: Tailwind CSS v4 does not use a `tailwind.config.js` file. Never reference, create, or modify one.

- **Use Built-in Utility Classes**: Avoid writing custom CSS. Stick to using Tailwind's built-in utility classes for all styling.

- **Use Built-in Colors**: Avoid defining custom colors. Use Tailwind's built-in color utility classes (e.g., `stone-500`, `lime-400`, `red-600`).

---

## The Four Pillars

Design OS is organized around four main areas:

1. **Product Overview** — The "what" and "why"
   - Product name and description
   - Problems and solutions
   - Key features
   - Sections/roadmap

2. **Data Model** — The "nouns" of the system
   - Core entity names and descriptions
   - Relationships between entities
   - Minimal — leaves room for implementation

3. **Design System** — The "look and feel"
   - Color palette (Tailwind colors)
   - Typography (Google Fonts)

4. **Application Shell** — The persistent chrome
   - Global navigation structure
   - User menu
   - Layout pattern

Plus **Sections** — The individual features, each with spec, data, screen designs.

---

## Export & Handoff

The export process generates a complete handoff package:

- **Ready-to-use prompts**: Pre-written prompts to copy/paste into coding agents
  - `one-shot-prompt.md`: For full implementation in one session
  - `section-prompt.md`: Template for section-by-section implementation
- **Implementation instructions**: Detailed guides for each milestone
  - `product-overview.md`: Always provide for context
  - `one-shot-instructions.md`: All milestones combined
  - Incremental instructions in `instructions/incremental/`
- **Test instructions**: Each section includes `tests.md` with TDD specs
- **Portable components**: Props-based, ready for any React setup

The prompts guide the implementation agent to ask clarifying questions about authentication, user modeling, and tech stack before building. Test instructions are framework-agnostic and include user flows, empty states, and edge cases.

---

## Design System (Design OS Application)

The Design OS application itself uses a "Refined Utility" aesthetic:

- **Typography**: DM Sans for headings and body, IBM Plex Mono for code
- **Colors**: Stone palette for neutrals (warm grays), lime for accents
- **Layout**: Maximum 800px content width, generous whitespace
- **Cards**: Minimal borders (1px), subtle shadows, generous padding
- **Motion**: Subtle fade-ins (200ms), no bouncy animations

---

## AI Assistant Guidelines

When helping users with Design OS:

1. **Understand the current step**: Check which files already exist in `product/` to determine where the user is in the planning flow.

2. **Suggest the interactive form first**: For steps that have forms (Product Vision, Roadmap, Data Model), suggest using the interactive form in the UI.

3. **Provide file creation assistance**: If the user prefers AI assistance, help them create the files by:
   - Asking clarifying questions
   - Generating properly formatted markdown/JSON
   - Saving files to the correct locations (if you have file system access)
   - OR providing clear instructions on where to save the files

4. **Follow the sequence**: Guide users through the planning flow in order. Don't skip ahead.

5. **Be conversational**: Ask follow-up questions when answers are vague. Help users think through their product.

6. **Keep it minimal**: For data models and specs, focus on high-level concepts. Leave detailed implementation to the coding phase.

7. **Validate file formats**: Ensure generated markdown follows the exact format shown in this document.

---

## Common Tasks

### Creating Product Overview
1. Ask about product name, description, problems it solves, and key features
2. Generate markdown in the format shown above
3. Save to `product/product-overview.md`

### Creating Product Roadmap
1. Ask user to break down their product into 3-5 main sections
2. For each section, get a title and one-sentence description
3. Generate markdown in the format shown above
4. Save to `product/product-roadmap.md`

### Creating Data Model
1. Ask about the main entities (nouns) in the system
2. For each entity, get a name and description
3. Ask about relationships between entities
4. Generate markdown in the format shown above
5. Create directory `product/data-model/` if it doesn't exist
6. Save to `product/data-model/data-model.md`

### Creating Design Tokens
1. Ask user to choose a primary color (from Tailwind palette)
2. Ask for secondary and neutral colors
3. Ask for font preferences (from Google Fonts)
4. Generate `colors.json` and `typography.json`
5. Create directory `product/design-system/` if it doesn't exist
6. Save both files to `product/design-system/`

---

## Editor-Specific Notes

This file works with all AI code editors including:
- **Claude Code**: Can use slash commands from `.claude/commands/` directory
- **Cursor AI**: Reads `.cursorrules` file for additional context
- **Augment Code**: Follows instructions from this file
- **Windsurf**: Reads `.windsurfrules` file for additional context
- **Cline**: Follows instructions from this file
- **Other AI editors**: Follow the guidelines in this file

For editor-specific features, check if corresponding instruction files exist (`.cursorrules`, `.windsurfrules`, etc.).

