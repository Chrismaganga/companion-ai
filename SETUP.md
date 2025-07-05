# AI Student Hub - Setup Guide

## Overview

This is a comprehensive AI-powered toolkit designed specifically for students, programmers, and graphic designers. It includes tools for code generation, image creation, resume building, writing assistance, and learning support.

## Features

- **Code Assistant**: Generate, debug, and review code in multiple languages
- **Image Generator**: Create stunning graphics using DALL-E 3
- **Resume Builder**: Generate professional resumes with AI assistance
- **Writing Assistant**: Enhance writing with grammar checks and style improvements
- **Study Assistant**: Create flashcards, quizzes, and study plans
- **Data Analysis**: Analyze and visualize data (coming soon)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory with the following variables:

```env
# OpenAI API Key (Required for all AI features)
OPENAI_API_KEY=your_openai_api_key_here

# Optional: Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Optional: Database
DATABASE_URL=your_database_url

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and add it to your `.env.local` file

### 4. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Usage

### Code Assistant

- Select "Code Assistant" from the tools grid
- Choose the type: Generate, Debug, or Review
- Select your programming language
- Enter your prompt or paste code
- Click "Generate with AI"

### Image Generator

- Select "Image Generator" from the tools grid
- Choose the style: Realistic, Artistic, Cartoon, or Abstract
- Select image size
- Describe the image you want to create
- Click "Generate Image"

### Resume Builder

- Select "Resume Builder" from the tools grid
- Enter your name and email
- Describe your experience and skills
- Click "Generate Resume"
- Download the HTML file and convert to PDF

### Writing Assistant

- Select "Writing Assistant" from the tools grid
- Choose the type: Write Content, Grammar Check, or Improve Style
- Enter your text or describe what you want to write
- Click "Enhance with AI"

### Study Assistant

- Select "Study Assistant" from the tools grid
- Choose the type: Flashcards, Quiz, or Study Plan
- Enter the subject and your study material
- Click "Create Study Materials"

## API Endpoints

The application includes the following API endpoints:

- `POST /api/ai/code` - Code generation and assistance
- `POST /api/ai/image` - Image generation using DALL-E 3
- `POST /api/ai/resume` - Resume generation
- `POST /api/ai/writing` - Writing assistance
- `POST /api/ai/learning` - Learning tools

## Technologies Used

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **AI**: OpenAI GPT-4 and DALL-E 3
- **Icons**: Lucide React
- **State Management**: React hooks

## Customization

### Adding New Tools

1. Add the tool configuration to the `tools` array in `app/(root)/page.tsx`
2. Create a new API route in `app/api/ai/[tool-name]/route.ts`
3. Add the tool interface logic to `components/ai-tool-interface.tsx`

### Styling

The application uses Tailwind CSS with shadcn/ui components. You can customize the styling by:

- Modifying the Tailwind configuration in `tailwind.config.js`
- Updating component styles in the UI components
- Adding custom CSS in `app/globals.css`

## Troubleshooting

### Common Issues

1. **API Key Error**: Make sure your OpenAI API key is correctly set in `.env.local`
2. **CORS Issues**: Ensure your API routes are properly configured
3. **Image Generation Fails**: Check if your OpenAI account has access to DALL-E 3
4. **Rate Limiting**: OpenAI has rate limits; consider implementing caching

### Getting Help

- Check the browser console for error messages
- Verify your environment variables are loaded correctly
- Ensure all dependencies are installed
- Check the OpenAI API status page for service issues

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.
