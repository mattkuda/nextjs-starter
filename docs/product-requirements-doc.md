PRD: Next.js Starter Kit
Overview
This project is a modern, batteries-included starter kit built with Next.js and TypeScript. It serves as a reusable foundation for future full-stack web apps. The goal is to eliminate setup time by pre-integrating key services and tools, while remaining clean and extensible.

Core Features
1. Authentication
Use Clerk for full-stack authentication.

Include prebuilt components for sign in, sign up, and user profile.

Protect routes using Clerk middleware.

2. Database
Use Supabase as the backend database.

Include a client wrapper (lib/supabase.ts) and an example of inserting/fetching data.

Support both server-side and client-side usage.

3. Payments
Integrate Stripe with support for:

Checkout sessions

Webhooks

Paid plans (monthly, yearly)

Include stripe.ts utility and example API route (/api/stripe/webhook.ts).

4. OpenAI Access
Add server-side API wrapper to call OpenAI’s chat/completions endpoint.

Include .env.example variable for OPENAI_API_KEY.

Provide a basic example of an AI chat or prompt generation feature.

5. UI + Styling
Use Shadcn UI with Tailwind CSS.

Preconfigure key components (button, card, input, dialog).

Create a base layout and page wrapper using Shadcn primitives.

Theming
Define primary and secondary colors using CSS variables in globals.css.

Use HSL format for full utility support (--primary: 220 90% 56%).

Extend Tailwind theme with primary, secondary, etc., in tailwind.config.ts.

Developer Experience
ESLint + Prettier setup

TypeScript strict mode

File-based routing with app/ directory

Environment variable support via .env and .env.example

Folder structure optimized for scalability (e.g., lib/, components/ui/, types/, hooks/)

Nice-to-Haves (if time permits)
useDebounce and useLocalStorage hooks

Toast notifications (via Shadcn)

Dark mode toggle

SEO config defaults (via next-seo)

npx-friendly setup using degit