# Scaffold Auth

Generates a complete authentication system with login/signup functionality.

## Variants

### Modal (Default for gated apps)
Blocks content with a modal until user authenticates. Best for internal tools and dashboards.

```bash
npm run scaffold:auth ./my-app modal
```

**Features:**
- Auth modal that can't be dismissed
- Automatic display when user is not authenticated
- Login/Signup form toggle
- No page navigation required

### Page (Traditional web apps)
Dedicated login/signup pages with redirects. Best for public-facing apps with SEO needs.

```bash
npm run scaffold:auth ./my-app page
```

**Features:**
- `/login` and `/signup` pages
- Protected route redirects
- Return URL support
- Browser history friendly

### Hybrid (Both options)
Provides both modal and page approaches for maximum flexibility.

```bash
npm run scaffold:auth ./my-app hybrid
```

## What Gets Generated

All variants include:

```
src/
├── features/auth/
│   ├── context/
│   │   ├── auth.types.ts          # User & auth state types
│   │   ├── auth.context.ts        # React context
│   │   ├── auth.provider.tsx      # Context provider
│   │   └── use-auth.ts            # useAuth hook
│   └── components/
│       ├── login-form.tsx         # Login form component
│       ├── signup-form.tsx        # Signup form component
│       └── auth-form.module.css   # Form styles
└── api/
    └── auth.ts                    # Auth API (mock implementation)
```

**Modal variant adds:**
```
src/features/auth/components/
├── auth-modal.tsx                 # Modal wrapper
└── auth-modal.module.css          # Modal styles
```

**Page variant adds:**
```
src/pages/
├── login/
│   ├── login.page.tsx
│   └── auth-page.module.css
└── signup/
    ├── signup.page.tsx
    └── auth-page.module.css
src/features/auth/components/
└── protected-route.tsx              # For wrapping protected routes
```

## Usage

### After Scaffolding

1. **Update API endpoints** in `src/api/auth.ts`:
   ```typescript
   // Replace mock implementation with real API calls
   export async function login(email: string, password: string) {
     const response = await fetch('/api/auth/login', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ email, password }),
     });
     // ...
   }
   ```

2. **Use the `useAuth` hook** in your components:
   ```tsx
   import { useAuth } from './features/auth/context/use-auth';

   function MyComponent() {
     const { user, isAuthenticated, logout } = useAuth();

     if (!isAuthenticated) {
       return <div>Please log in</div>;
     }

     return (
       <div>
         <p>Welcome, {user.name}!</p>
         <button onClick={logout}>Logout</button>
       </div>
     );
   }
   ```

3. **Add routes** (for page/hybrid variants):
   ```tsx
   // In your routes/index.tsx
   import { LoginPage } from '../pages/login/login.page';
   import { SignupPage } from '../pages/signup/signup.page';

   export const router = createBrowserRouter([
     {
       path: '/login',
       Component: LoginPage,
     },
     {
       path: '/signup',
       Component: SignupPage,
     },
     // ... other routes
   ]);
   ```

4. **Protected routes** (for page/hybrid variants):
   ```tsx
   import { ProtectedRoute } from '../features/auth/components/protected-route';

   // Wrap protected routes
   {
     path: '/dashboard',
     element: (
       <ProtectedRoute>
         <DashboardPage />
       </ProtectedRoute>
     ),
   }
   ```

   The ProtectedRoute component will redirect to `/login?returnUrl=/dashboard` if the user is not authenticated, and automatically redirect back after login.

## Default Credentials (Mock API)

For testing the scaffold:
- Email: `demo@example.com`
- Password: `password`

## Removal

```bash
npm run unscaffold:auth ./my-app
```

Removes all auth-related files and reverts changes to `main.tsx`.

## Implementation

- Entry point: `scripts/scaffold/auth/up.ts`
- Templates: `templates/scaffold/auth/{shared,modal,page,hybrid}/`
- Removal: `scripts/scaffold/auth/down.ts`

## Notes

- Modal variant is best for SPAs with no SEO requirements
- Page variant is better for traditional web apps
- Hybrid gives you both options
- All variants use the same auth context/API
- Auth state is stored in localStorage (update for production)
