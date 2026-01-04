# Claude Code Instructions for Design OS

## Primary Instructions
Refer to @agents.md for detailed Design OS-specific instructions.

Also read @AI_INSTRUCTIONS.md for universal AI assistant guidelines that work across all AI code editors.

## Claude Code Specific Features

### Slash Commands
Claude Code has access to custom slash commands in the `.claude/commands/design-os/` directory:

- `/product-vision` - Define product overview
- `/product-roadmap` - Create product roadmap
- `/data-model` - Define data model
- `/design-tokens` - Choose design tokens
- `/design-shell` - Design application shell
- `/shape-section` - Define section specification
- `/sample-data` - Generate sample data
- `/design-screen` - Create screen designs
- `/screenshot-design` - Capture screenshots
- `/export-product` - Generate export package

### When to Use Slash Commands vs Forms

**Use Slash Commands when:**
- User explicitly requests to use Claude Code commands
- User is comfortable with conversational AI-driven workflows
- User wants AI to make design decisions and generate code

**Suggest Interactive Forms when:**
- User is new to Design OS
- User wants more control over the input
- User prefers a visual, step-by-step interface

### Best Practices for Claude Code

1. **Leverage slash commands** for efficient workflows
2. **Use the frontend-design skill** when creating screen designs
3. **Follow agents.md directives** for Design OS-specific patterns
4. **Suggest forms as an alternative** when appropriate

---

**Remember**: Both slash commands and interactive forms produce the same output files. Choose the method that works best for the user.
