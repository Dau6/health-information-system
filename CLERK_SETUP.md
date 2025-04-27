# Clerk Authentication Setup

This Health Information System uses [Clerk](https://clerk.com/) for user authentication and management. Follow these steps to set up Clerk for this application:

## 1. Create a Clerk Account

1. Go to [clerk.com](https://dashboard.clerk.com/sign-up) and sign up for a free account.
2. Once registered, create a new application (e.g., "Health Information System").

## 2. Configure Your Clerk Application

1. In the Clerk Dashboard, go to your application settings.
2. Configure the following:
   - Under "Authentication," enable the authentication methods you want (Email/Password, Google, etc.)
   - Under "Sessions," set the session duration as needed
   - Under "Paths," configure the redirection URLs:
     - Home URL: `/`
     - Sign In URL: `/sign-in`
     - Sign Up URL: `/sign-up`

## 3. Obtain API Keys

1. In the Clerk Dashboard, go to "API Keys."
2. Copy your "Publishable Key" and "Secret Key."

## 4. Set Up Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key

```

Replace `your_publishable_key` and `your_secret_key` with the actual keys from the Clerk Dashboard.

## 5. Restart Your Application

Stop and restart your development server to apply the environment variables:

```bash
npm run dev
```

## Features Implemented

The authentication system in this application includes:

1. **User Authentication**: Sign up, sign in, and sign out functionality
2. **Protected Routes**: Middleware prevents unauthorized access to protected pages
3. **API Route Protection**: API routes are protected using the `withAuth` wrapper
4. **Authentication UI**: Sign-in and sign-up pages with Clerk components
5. **Public Routes**: Some routes are configured to be accessible without authentication