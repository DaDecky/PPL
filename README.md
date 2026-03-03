# PPL Salman

Next.js 16 + Prisma + Better Auth starter with email/password auth pages (`/sign-in`, `/sign-up`), session-aware homepage, shadcn/ui, and Sonner toasts.

## Developer Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create `.env` in project root:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB_NAME
BETTER_AUTH_SECRET=your-32-plus-char-secret
BETTER_AUTH_URL=http://localhost:3000
```

3. Generate Prisma client:

```bash
npx prisma generate
```

4. Apply migrations:

```bash
npx prisma migrate dev
```

5. Run dev server:

```bash
npm run dev
```

6. Open `http://localhost:3000`.

## Auth Flow

- Sign up: `http://localhost:3000/sign-up`
- Sign in: `http://localhost:3000/sign-in`
- Homepage (`/`) shows:
  - `Sign in` / `Sign up` buttons when logged out
  - user email + `Log out` button when logged in

## Notes for Developers

- Better Auth server config: `src/lib/auth.ts`
- Better Auth client helpers: `src/lib/auth-client.ts`
- Toast wrapper (info/warning/success/error): `src/lib/toast.ts`
- Sonner toaster styling: `src/components/ui/sonner.tsx`

Prisma client is also generated automatically on `npm install` via `postinstall`.

If you change Prisma schema (including Better Auth tables), run:

```bash
npx prisma generate
```

If you change Prisma schema and need to update the database structure, create a migration with a clear message:

```bash
npx prisma migrate dev --name your_migration_message
```

Examples:

```bash
npx prisma migrate dev --name add_profile_table
npx prisma migrate dev --name add_email_verified_index
```

If you see error like `Model user does not exist in the database`, usually fix with:

```bash
npx prisma generate
npm run dev
```
