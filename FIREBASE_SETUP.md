# Firebase Setup Guide for AI Student Hub

## Prerequisites

- A Firebase account
- Node.js and npm installed

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "ai-student-hub")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable the following providers:
   - **Email/Password**: Click "Enable" and save
   - **Google**: Click "Enable", add your authorized domain, and save

## Step 3: Get Firebase Configuration

1. In your Firebase project, click the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (</>)
5. Register your app with a nickname (e.g., "AI Student Hub Web")
6. Copy the configuration object

## Step 4: Set Environment Variables

Create a `.env.local` file in your project root and add your Firebase configuration:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBM6SixD4DF1Cf5xxfVBx35NsEGYvyxlG0
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=companion-ai-e4abe.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=companion-ai-e4abe
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=companion-ai-e4abe.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=594495937257
NEXT_PUBLIC_FIREBASE_APP_ID=1:594495937257:web:6f235bafb05d98ecd82e78
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-3LNHYNJBN4
```

These are your actual Firebase configuration values.

## Step 5: Configure Authorized Domains

1. In Firebase Console, go to Authentication > Settings
2. Add your domain to "Authorized domains":
   - For development: `localhost`
   - For production: your actual domain

## Step 6: Test the Setup

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:3001`
3. Try signing up/signing in with email or Google

## Features Included

### Authentication

- ✅ Email/Password authentication
- ✅ Google OAuth authentication
- ✅ User state management
- ✅ Sign out functionality
- ✅ Responsive auth modal

### Landing Page Features

- ✅ Responsive design (mobile-first)
- ✅ Animated flashing cards with staggered animations
- ✅ Blue to green gradient background
- ✅ Smooth scrolling navigation
- ✅ Interactive tool selection
- ✅ Testimonials carousel
- ✅ Statistics display
- ✅ Call-to-action sections

### UI Components

- ✅ Glassmorphism effects with backdrop blur
- ✅ Hover animations and transitions
- ✅ Gradient buttons and cards
- ✅ Mobile-responsive navigation
- ✅ Loading states
- ✅ Error handling

## Customization

### Colors and Gradients

The landing page uses a blue-to-green gradient theme. You can customize the colors by modifying:

- Background gradient: `bg-gradient-to-br from-blue-600 via-blue-500 to-green-500`
- Card gradients: Various gradient classes in the tools array
- Button gradients: `bg-gradient-to-r from-blue-500 to-green-500`

### Adding New Tools

To add new AI tools, modify the `tools` array in `app/(root)/page.tsx`:

```typescript
{
  id: "new-tool",
  title: "New Tool",
  description: "Description of the new tool",
  icon: YourIcon,
  color: "text-color-500",
  bgColor: "bg-color-50 dark:bg-color-950",
  features: ["Feature 1", "Feature 2", "Feature 3"],
  gradient: "from-color-500 to-color-500"
}
```

### Adding Real AI Functionality

To connect real AI services:

1. Add your API keys to `.env.local`
2. Create API routes in `app/api/` directory
3. Replace mock responses with actual API calls
4. Add proper error handling and rate limiting

## Troubleshooting

### Common Issues

1. **Authentication not working**

   - Check that all environment variables are set correctly
   - Verify that Email/Password and Google auth are enabled in Firebase
   - Ensure your domain is in the authorized domains list

2. **Styling issues**

   - Make sure Tailwind CSS is properly configured
   - Check that all UI components are imported correctly

3. **Build errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check for TypeScript errors in the console

### Support

If you encounter any issues, check the Firebase documentation or create an issue in the project repository.

## Next Steps

1. **Add Real AI Integration**: Connect to OpenAI, Anthropic, or other AI services
2. **Database Integration**: Add Firestore for user data and tool usage tracking
3. **Analytics**: Implement Firebase Analytics for user behavior tracking
4. **Deployment**: Deploy to Vercel, Netlify, or your preferred platform
5. **Custom Domains**: Set up custom domains and SSL certificates
