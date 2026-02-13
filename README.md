# Smart Bookmarks - Real-time Bookmark Manager

A modern, production-ready bookmark management application built with Next.js 15, Supabase, and TypeScript. Features real-time synchronization across multiple browser tabs, Google OAuth authentication, and a beautiful, responsive UI.

## Live Demo

[Your Vercel deployment URL will go here]

## Features

### Core Functionality
- **Google OAuth Authentication** - Secure sign-in with Google (no password required)
- **Real-time Sync** - Bookmarks instantly sync across all open browser tabs using Supabase Realtime
- **CRUD Operations** - Add, view, and delete bookmarks with ease
- **Private & Secure** - Each user's bookmarks are completely private with Row Level Security (RLS)

### UI/UX Highlights
- **Beautiful Gradient Design** - Modern blue-to-indigo gradient background with glassmorphism effects
- **Responsive Layout** - Works seamlessly on desktop, tablet, and mobile devices
- **Professional Landing Page** - Feature highlights and clear call-to-action for non-authenticated users
- **Empty States** - Helpful messages when no bookmarks exist
- **Loading States** - User feedback during async operations
- **Toast Notifications** - Success/error messages for all actions
- **Smooth Animations** - Card hover effects and transitions
- **Bookmark Metadata** - Display favicon, creation date, and URL preview
- **One-Click Actions** - Open in new tab, copy URL, delete bookmark

### Technical Features
- **URL Validation** - Ensures URLs start with http:// or https://
- **Keyboard Support** - Enter to submit forms
- **Auto-focus** - Title input automatically focused after adding bookmark
- **Optimistic UI** - Instant feedback with real-time confirmation
- **Error Handling** - Comprehensive error handling with user-friendly messages

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database & Auth**: Supabase (PostgreSQL with RLS)
- **Real-time**: Supabase Realtime (postgres_changes)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Icons**: Lucide React
- **Toast Notifications**: Sonner
- **Deployment**: Vercel

## Database Schema

### Bookmarks Table
```sql
CREATE TABLE bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  url text NOT NULL,
  created_at timestamptz DEFAULT now()
);
```

### Row Level Security Policies
- **SELECT**: Users can only view their own bookmarks (`user_id = auth.uid()`)
- **INSERT**: Users can only create bookmarks with their own `user_id`
- **DELETE**: Users can only delete their own bookmarks

## Getting Started

### Prerequisites
- Node.js 18+ installed
- A Supabase account and project
- Google OAuth credentials configured in Supabase

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd smart-bookmarks
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Configure Google OAuth in Supabase**
   - Go to your Supabase project dashboard
   - Navigate to Authentication > Providers
   - Enable Google provider
   - Add your Google OAuth credentials
   - Add authorized redirect URLs:
     - Development: `http://localhost:3000/auth/callback`
     - Production: `https://your-domain.vercel.app/auth/callback`

5. **Run database migrations**
   - The database schema is already set up via the Supabase migration
   - Verify the `bookmarks` table exists in your Supabase project

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   - Navigate to `http://localhost:3000`
   - Sign in with Google
   - Start adding bookmarks!

### Testing Real-time Sync
1. Open the app in two different browser tabs
2. Add a bookmark in one tab
3. Watch it instantly appear in the other tab without refreshing

## Project Structure

```
project/
├── app/
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts          # OAuth callback handler
│   ├── layout.tsx                # Root layout with metadata
│   └── page.tsx                  # Main page (landing + dashboard)
├── components/
│   ├── AuthButton.tsx            # Sign in/out button with user info
│   ├── BookmarkForm.tsx          # Form to add new bookmarks
│   └── BookmarkList.tsx          # Real-time bookmark list
├── lib/
│   ├── supabase.ts               # Client-side Supabase client
│   └── supabase-server.ts        # Server-side Supabase client
├── .env.example                  # Example environment variables
└── README.md                     # This file
```

## Deployment to Vercel

1. **Push your code to GitHub**

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Add environment variables**
   - In Vercel project settings, add:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. **Deploy**
   - Vercel will automatically build and deploy
   - Update your Supabase OAuth redirect URLs with your Vercel domain

5. **Test**
   - Visit your deployed URL
   - Sign in with Google
   - Verify all features work in production

## Problems Encountered & Solutions

### 1. Next.js 15 Server/Client Component Separation
**Problem**: Initially tried to import `cookies()` from `next/headers` in a file that was used by client components, causing a build error.

**Solution**: Separated Supabase client utilities into two files:
- `lib/supabase.ts` - Client-side only (uses `createBrowserClient`)
- `lib/supabase-server.ts` - Server-side only (uses `createServerClient` with cookies)

### 2. TypeScript Type Inference with Supabase
**Problem**: TypeScript couldn't properly infer the database schema types, causing errors when inserting data.

**Solution**: Used explicit type assertions (`as any`) for insert operations while maintaining type safety elsewhere.

### 3. Real-time Subscription Filter
**Challenge**: Ensuring real-time subscriptions only listen to the current user's bookmarks.

**Solution**: Applied `filter: user_id=eq.${userId}` to the postgres_changes subscription to only receive relevant events.

### 4. Duplicate Real-time Events
**Challenge**: Preventing duplicate bookmarks when real-time events fire for user's own actions.

**Solution**: Check if bookmark already exists in local state before adding it from real-time event.

### 5. OAuth Callback Handling
**Challenge**: Properly exchanging OAuth code for session in Next.js 15 App Router.

**Solution**: Created a dedicated route handler at `/auth/callback/route.ts` that uses `exchangeCodeForSession()` and properly sets cookies.

## Key Implementation Details

### Real-time Subscription
The BookmarkList component subscribes to postgres_changes for INSERT and DELETE events:
```typescript
const channel = supabase
  .channel('bookmarks-changes')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'bookmarks',
    filter: `user_id=eq.${userId}`,
  }, (payload) => {
    // Add new bookmark to state
  })
  .subscribe();
```

### Row Level Security
Supabase RLS ensures data isolation:
```sql
CREATE POLICY "Users can view own bookmarks"
  ON bookmarks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
```

### Server-Side Rendering with Fresh Auth State
The main page uses `dynamic = 'force-dynamic'` to ensure fresh auth state on every request:
```typescript
export const dynamic = 'force-dynamic';
```

## Performance Optimizations

- Server-side rendering for initial page load
- Real-time subscriptions only for authenticated users
- Optimistic UI updates for instant feedback
- Lazy loading of bookmark favicons
- Efficient database indexes on `user_id` and `created_at`

## Security Considerations

- Google OAuth for authentication (no passwords to leak)
- Row Level Security (RLS) enforces data isolation
- Environment variables for sensitive credentials
- No server-side secrets exposed to client
- HTTPS enforced in production
- Proper CORS configuration for Supabase

## Future Enhancements

- [ ] Bookmark tags/categories
- [ ] Search and filter functionality
- [ ] Bulk delete operations
- [ ] Import bookmarks from browser
- [ ] Export bookmarks to JSON/CSV
- [ ] Bookmark folders/collections
- [ ] Shared bookmarks with other users
- [ ] Browser extension
- [ ] Dark mode toggle

## License

MIT

## Author

Built as a take-home assignment demonstrating:
- Modern React/Next.js patterns
- Real-time functionality with Supabase
- TypeScript best practices
- Production-ready code quality
- Comprehensive error handling
- Professional UI/UX design

---

**Note**: This is a demonstration project showcasing technical skills in modern web development. It implements real-time features, authentication, database management, and responsive design.
