## NextJS Starter Setup Instructions

This guide walks you through setting up NextJS Starter, including Clerk for authentication, Supabase as the database, and Ngrok for webhook testing. Follow these steps to get the app running locally and deployed.

### 1. Prerequisites
- Ensure you have the following installed:
  - Node.js (v16 or higher): Download from the Node.js website.
  - npm or yarn: Comes with Node.js.
  - Supabase Account: Sign up at Supabase.
  - Clerk Account: Sign up at Clerk.
  - Ngrok: Download Ngrok for local webhook testing.

### 2. Clone the Repository
- Run git clone <repository-url> in your terminal.
- Navigate to the project directory with cd nextjs-starter.

### 3. Install Dependencies
- Install required packages by running npm install.

### 4. Set Up Environment Variables
- Create a .env.local file in the root of your project.
- Add the following environment variables:
  - NEXT_PUBLIC_CLERK_FRONTEND_API: Your Clerk frontend API key.
  - CLERK_API_KEY: Your Clerk backend API key.
  - CLERK_WEBHOOK_SECRET: Your Clerk webhook secret.
  - NEXT_PUBLIC_SUPABASE_URL: Your Supabase project URL.
  - SUPABASE_SERVICE_ROLE_KEY: Your Supabase service role key.
  - NGROK_URL: Your Ngrok public URL (for local webhook testing).

### 5. Configure Clerk
- Go to your Clerk Dashboard and create a new application.
- Add a webhook for user.created and user.updated events with the URL http://localhost:3000/api/auth/webhook.

### 6. Configure Supabase
Log in to Supabase and create a new project.
- In the SQL editor, create a users table with columns such as id, clerk_user_id, email, and other relevant fields.
- Add triggers and policies for updating timestamps and managing data securely.

### 7. Run Ngrok for Webhook Testing
- Start your local server with npm run dev.
- Run Ngrok in a separate terminal with ngrok http 3000.
- Update your Clerk webhook URL with the public URL provided by Ngrok.

### 8. Start the Application
- Run the development server using npm run dev.
- Access your app at http://localhost:3000.

### 9. Test the Setup
Use the <SignUp /> component to register a new user.
- Confirm the user is created in Clerk and synced to Supabase via webhooks.
- Verify webhook events in Ngrok’s dashboard (http://localhost:4040).

### 10. Deployment
- Push your code to a GitHub repository.
- Deploy the application to Vercel or another hosting platform.
- Update environment variables in the hosting platform for production use.
