# Data Model

## Entities

### User
Represents the primary actors within the platform. Users can be designers, stakeholders, or developers. This entity stores authentication details, profile information, and preferences for the design environment.

### Workspace
A logical container for organizing projects, brand assets, and team members. Workspaces allow for isolated environments for different clients or internal departments, managing billing and high-level configuration.

### BrandIdentity
A collection of design constraints that the AI uses for "Context-Aware Style Transfer." This includes color palettes (hex codes), typography scales, spacing rules (grids), and logo assets. It serves as the "source of truth" for consistent design generation.

### Project
A specific design initiative within a workspace (e.g., "Q4 Marketing Campaign" or "Mobile App Redesign"). Projects group related design files and maintain a history of the AI's creative direction.

### DesignFile
A structured, multi-layer document produced by the AI. Unlike flat images, this entity stores the hierarchical structure of design elements in formats like JSON or SVG, enabling the "Autonomous Multi-Layer Editing" feature.

### DesignElement
A specific component within a DesignFile, such as a button, card, icon, or text block. Attributes include coordinates, dimensions, CSS-like styling properties, and layer ordering.

### PromptSession
A threaded conversation between the user and the AI agent. It captures the natural language inputs and the resulting AI actions, providing the context for "Natural Language Design Systems" and iterative refinements.

### VersionHistory
A snapshot of a DesignFile at a specific point in time. This enables the "Iteration Bottleneck" solution by allowing users to instantly revert to previous states or compare branches created during the feedback loop.

### ExportAsset
The production-ready output generated from a DesignFile. This includes various formats (PNG, SVG, Figma-compatible files) and specific resolutions required for multi-platform deployment.

## Relationships

- **Workspace** has many **Users** (and a User can belong to many Workspaces).
- **Workspace** has many **BrandIdentities**.
- **Workspace** has many **Projects**.
- **Project** has many **DesignFiles**.
- **Project** has many **PromptSessions**.
- **DesignFile** belongs to a **BrandIdentity** (to ensure style alignment).
- **DesignFile** has many **DesignElements**.
- **DesignFile** has many **VersionHistory** entries.
- **DesignFile** produces many **ExportAssets**.
- **PromptSession** generates many **VersionHistory** entries (tracking how prompts modified the design).
- **DesignElement** can be a part of a **DesignSystem** (a specialized project type for reusable components).