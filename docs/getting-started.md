# Getting Started

## Clone the Repository

```bash
git clone https://github.com/buildermethods/design-os.git my-project-design
cd my-project-design
```

Replace `my-project-design` with whatever you want to name your design workspace.

## Remove the Original Remote

```bash
git remote remove origin
```

Now you have a clean local instance ready to use.

## Install Dependencies

```bash
npm install
```

## Start the Dev Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Choose Your Workflow

Design OS works in **two ways**:

### Option 1: Interactive UI Forms (Recommended)

Use the forms directly in the web application:

1. Navigate through the app using the phase navigation
2. Click "Use Interactive Form" when you see an empty state
3. Fill out the form with your product details
4. Download or copy the generated file
5. Save it to the specified location in the `product/` directory
6. Refresh the app to see your changes

**Best for**: Visual learners, those who prefer step-by-step guidance, or anyone new to Design OS.

### Option 2: AI-Assisted Workflow

Use your preferred AI code editor to help create files:

**With Claude Code:**
```bash
claude
```
Then run commands like `/product-vision`, `/product-roadmap`, etc.

**With Cursor AI, Augment Code, Windsurf, or Cline:**
Open your AI assistant and ask it to help you create the necessary files. For example:
- "Help me create a product overview for Design OS"
- "I need to define my product roadmap"
- "Create a data model for my app"

The AI will ask clarifying questions and generate the properly formatted files.

**Best for**: Those comfortable with AI assistants, developers who prefer conversational workflows, or users who want AI to help with design decisions.

## You're Ready!

Start with the Product Overview page and work your way through the planning flow. The app will guide you through each step.

---

## Optional: Save as Your Own Template

If you want to reuse Design OS for future projects:

1. Push to your own GitHub repository:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

2. Go to your repository on GitHub, click **Settings**, and check **Template repository**.

Now you can create new instances using GitHub's "Use this template" button.
