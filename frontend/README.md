# Frontend - Next.js App Router

**Task**: T002, T010-T013
**Spec**: 002-authentication

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **State**: React Server Components + client state

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment**:
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Access application**:
   - Frontend: http://localhost:3000
   - API (backend must be running): http://localhost:8000

## Project Structure

```
frontend/
├── app/                  # App Router pages and layouts
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   ├── login/           # Login page
│   ├── signup/          # Signup page
│   └── tasks/           # Tasks pages (protected)
├── components/          # Reusable React components
│   └── AuthGuard.tsx
├── lib/                 # Utility functions
│   └── api.ts          # API client
├── types/               # TypeScript type definitions
│   └── auth.ts
└── package.json         # Dependencies
```

## Scripts

- `npm run dev` - Start development server (port 3000)
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - TypeScript type checking

## Environment Variables

Required in `.env.local`:
- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:8000/api/v1)
- `NEXT_PUBLIC_APP_URL` - Frontend URL (default: http://localhost:3000)

See `.env.local.example` for details.

## Testing

```bash
npm test
```

## Key Rules

- **App Router only** (NOT Pages Router)
- **TypeScript strict mode** (no `any` types)
- **Tailwind CSS** (NO inline styles)
- **API calls through** `lib/api.ts` only
- **JWT attached** to every protected request
- **Follow specs** in `@specs/ui/*`
