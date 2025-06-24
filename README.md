# Next.js SaaS Starter

This is a starter template for building a SaaS application using **Next.js** with support for Clerk authentication, Supabase database, Stripe payments, OpenAI integration, and a comprehensive dashboard for users.

![Dashboard Screenshot](public/dashboard-screenshot-dark.png)

## Features

- Marketing landing page (`/`) with hero section and feature highlights
- Pricing page with Stripe integration
- Dashboard pages with AI chat and coaching features
- User authentication and management with Clerk
- Subscription management and billing
- Account settings and user profiles
- Responsive design with dark/light mode support
- Webhook handling for real-time updates

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Database**: [Supabase](https://supabase.com/)
- **Authentication**: [Clerk](https://clerk.com/)
- **Payments**: [Stripe](https://stripe.com/)
- **AI**: [OpenAI](https://openai.com/)
- **UI Library**: [shadcn/ui](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## Prerequisites

Before you begin, ensure you have the following installed and set up:

### Required Software
- **Node.js** (v18 or higher): Download from [nodejs.org](https://nodejs.org/)
- **Git**: Download from [git-scm.com](https://git-scm.com/)
- **Code Editor**: We recommend [VS Code](https://code.visualstudio.com/) with the following extensions:
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense
  - ES7+ React/Redux/React-Native snippets

### Required Accounts
- **Clerk**: Sign up at [clerk.com](https://clerk.com/) (for authentication)
- **Supabase**: Sign up at [supabase.com](https://supabase.com/) (for database)
- **OpenAI**: Sign up at [platform.openai.com](https://platform.openai.com/) (for AI features)
- **Stripe**: Sign up at [stripe.com](https://stripe.com/) (for payments)

## Getting Started

```bash
git clone https://github.com/mattkuda/nextjs-starter.git
cd nextjs-starter
npm install
```

## Running Locally

### 1. Set Up Environment Variables

Create a `.env.local` file in the root of your project and add the following:

```env
NEXT_PUBLIC_CLERK_FRONTEND_API=your_clerk_frontend_api_key
CLERK_API_KEY=your_clerk_backend_api_key
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=your_openai_api_key
NGROK_URL=your_ngrok_public_url
```

### 2. Configure Clerk

1. Go to your [Clerk Dashboard](https://dashboard.clerk.com/) and create a new application
2. Add a webhook for `user.created` and `user.updated` events with the URL `http://localhost:3000/api/auth/webhook`
3. Copy your API keys to the `.env.local` file

### 3. Configure Supabase

1. Log in to [Supabase](https://supabase.com/) and create a new project
2. In the SQL editor, create a users table with columns such as `id`, `clerk_user_id`, `email`, and other relevant fields
3. Add triggers and policies for updating timestamps and managing data securely
4. Copy your project URL and service role key to the `.env.local` file

### 4. Configure OpenAI

1. Sign up for an [OpenAI account](https://platform.openai.com/)
2. Generate an API key from your OpenAI dashboard
3. Copy your API key to the `.env.local` file as `OPENAI_API_KEY`

### 5. Set Up Webhook Testing with Ngrok

Start your local server:

```bash
npm run dev
```

In a separate terminal, run Ngrok:

```bash
ngrok http 3000
```

Update your Clerk webhook URL with the public URL provided by Ngrok.

### 6. Start the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app in action.

## Testing the Setup

1. Use the sign-up page to register a new user
2. Confirm the user is created in Clerk and synced to Supabase via webhooks
3. Verify webhook events in Ngrok's dashboard at [http://localhost:4040](http://localhost:4040)
4. Test the dashboard features and subscription flows

## Going to Production

When you're ready to deploy your SaaS application to production, follow these steps:

### Set up production webhooks

1. Go to the Clerk Dashboard and update your webhook URL to your production domain
2. Configure Stripe webhooks for your production environment
3. Update webhook secrets in your production environment variables

### Deploy to Vercel

1. Push your code to a GitHub repository
2. Connect your repository to [Vercel](https://vercel.com/) and deploy it
3. Follow the Vercel deployment process

### Add environment variables

In your Vercel project settings, add all the necessary environment variables for production:

1. `NEXT_PUBLIC_CLERK_FRONTEND_API`: Your production Clerk frontend API key
2. `CLERK_API_KEY`: Your production Clerk backend API key  
3. `CLERK_WEBHOOK_SECRET`: Your production Clerk webhook secret
4. `NEXT_PUBLIC_SUPABASE_URL`: Your production Supabase project URL
5. `SUPABASE_SERVICE_ROLE_KEY`: Your production Supabase service role key
6. `OPENAI_API_KEY`: Your production OpenAI API key

## Other Tips

- Set your brand colors in `tailwind.config.ts`
- Add your logo in `public/` directory and update references
- Update your app PRD in [`docs/product-requirements-doc.md`](docs/product-requirements-doc.md)
- Review database design in [`docs/db-design.md`](docs/db-design.md)
- Customize the landing page components in `src/components/landing/`
