# AI Integration

Design OS now includes AI-powered content generation to help you create professional, detailed product documentation.

## Setup

### 1. Get an OpenRouter API Key

1. Visit [OpenRouter](https://openrouter.ai/)
2. Sign up or log in
3. Go to [API Keys](https://openrouter.ai/keys)
4. Create a new API key

### 2. Configure Your Environment

Create a `.env` file in the project root:

```bash
VITE_OPENROUTER_API_KEY=your_api_key_here
```

Or copy the example file:

```bash
cp .env.example .env
# Then edit .env and add your API key
```

**Important**: Never commit your `.env` file to version control. It's already in `.gitignore`.

## How It Works

When AI is enabled, Design OS uses OpenRouter to enhance your input:

1. **You provide basic information** - Product name, brief descriptions, key points
2. **AI expands and improves** - Creates professional, detailed content
3. **You review and regenerate** - Adjust the model or regenerate if needed
4. **Download or copy** - Save the final result

## Available Forms with AI

### Product Vision Form
- **Input**: Product name, brief description, problem titles, feature names
- **AI Output**: Expanded descriptions, professional problem/solution statements, detailed features
- **Model**: Default is Gemini 3 Flash Preview (fast & free)

### Product Roadmap Form
- **Input**: Section titles and brief descriptions
- **AI Output**: Clear, professional one-sentence descriptions for each section
- **Model**: Default is Gemini 3 Flash Preview (fast & free)

### Data Model Form (Coming Soon)
- **Input**: Entity names and brief descriptions
- **AI Output**: Detailed entity descriptions and relationship suggestions

### Design Tokens Form
- No AI needed - uses dropdown selectors for colors and fonts

## Choosing AI Models

Design OS supports any model available on OpenRouter:

### Popular Models

- **Gemini 3 Flash Preview** (Default) - Fast, free, great for most tasks
- **Claude 3.5 Sonnet** - Excellent for detailed, nuanced content
- **GPT-4o** - Strong all-around performance
- **GPT-4o Mini** - Faster, more cost-effective
- **Llama 3.3 70B** - Open source, good performance

### Custom Models

You can use any model from [OpenRouter's model list](https://openrouter.ai/models):

1. Select "Custom Model ID..." from the dropdown
2. Enter the model ID (e.g., `anthropic/claude-3.5-sonnet`)
3. Generate content

## Features

### AI Toggle
- Enable/disable AI for each form
- When disabled, forms generate content directly from your input
- Useful if you want full control or don't have an API key

### Model Selection
- Choose from popular models or enter a custom model ID
- Different models have different strengths and costs
- Experiment to find what works best for your needs

### Regeneration
- After generating content, you can regenerate with the same or different model
- Useful for trying different approaches or refining output
- Your original input is preserved

### Error Handling
- Clear error messages if something goes wrong
- Automatic fallback to direct generation if AI fails
- No data loss - your input is always preserved

## Cost Considerations

- **Gemini 3 Flash Preview**: Free (default)
- **Other models**: Vary in cost - check [OpenRouter pricing](https://openrouter.ai/models)
- **Usage tracking**: Monitor your usage on the OpenRouter dashboard
- **Credits**: OpenRouter provides free credits for new users

## Privacy & Security

- **API Key**: Stored locally in `.env`, never committed to git
- **Your data**: Sent to OpenRouter/model provider for generation
- **No storage**: Design OS doesn't store your content on any server
- **Local first**: All generated content stays in your browser until you save it

## Troubleshooting

### "OpenRouter API key not configured"
- Make sure you created a `.env` file in the project root
- Check that the key starts with `VITE_OPENROUTER_API_KEY=`
- Restart the dev server after adding the `.env` file

### "Failed to generate content"
- Check your internet connection
- Verify your API key is valid on OpenRouter
- Try a different model
- Check the browser console for detailed error messages

### AI toggle doesn't appear
- Make sure you have a valid API key in `.env`
- Restart the dev server
- Check the browser console for errors

### Generated content is not what you expected
- Try a different AI model
- Provide more detailed input
- Regenerate with the same model (results can vary)
- Disable AI and use direct generation for full control

## Best Practices

1. **Start with defaults** - Gemini 3 Flash Preview works well for most cases
2. **Be specific** - More detailed input = better AI output
3. **Iterate** - Use regeneration to refine results
4. **Review carefully** - AI is a tool, not a replacement for your judgment
5. **Save your work** - Download or copy generated content before closing

## Examples

### Product Vision

**Your Input:**
- Name: TaskFlow
- Description: A task management app
- Problem: People forget tasks
- Solution: Reminders and notifications

**AI Output:**
```markdown
# TaskFlow

## Description
TaskFlow is a comprehensive task management application designed to help individuals and teams stay organized and productive. By combining intuitive task creation with smart reminders and real-time notifications, TaskFlow ensures that nothing falls through the cracks.

## Problems & Solutions

### Problem 1: Task Forgetfulness
TaskFlow solves the common problem of forgotten tasks through an intelligent reminder system that sends timely notifications across all your devices, ensuring you never miss an important deadline or commitment.

## Key Features
- Smart reminder system with customizable notification preferences
- Cross-device synchronization for seamless task management
- Intuitive task creation and organization interface
```

## Support

For issues or questions:
- Check the [OpenRouter documentation](https://openrouter.ai/docs)
- Review the browser console for error messages
- Disable AI and use direct generation as a fallback

