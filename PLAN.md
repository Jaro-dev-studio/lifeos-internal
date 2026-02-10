# LifeOS Implementation Plan

## Overview

LifeOS is a personal life operating system - a comprehensive dashboard that integrates all aspects of life including finances (banking), health monitoring, workflows (cron, webhook, manual), and AI-powered interactions. The system is designed to be extensible from within itself, allowing users to create custom tools and workflows.

## Architecture

### Tech Stack
- **Frontend**: Next.js 16+ with App Router, React 19, TailwindCSS, ShadCN UI
- **Backend**: Next.js API Routes + Server Actions
- **Database**: NeonDB (PostgreSQL) with Prisma ORM
- **Authentication**: NextAuth.js (Auth.js v5)
- **AI Integration**: OpenAI API for chat and tool execution
- **Real-time**: Server-Sent Events for live updates

### Key Architectural Choices
1. **Server Components First**: Leverage Next.js SSR for performance
2. **Modular Widget System**: Each dashboard widget is self-contained
3. **Plugin Architecture**: Extensible system for adding new integrations
4. **Event-Driven Workflows**: Support for cron, webhook, and manual triggers
5. **AI Tool System**: Define custom tools that AI can execute

### Data Flow
```
User -> NextAuth Session -> Server Components -> Prisma -> NeonDB
AI Chat -> Tool Definition -> Tool Execution -> Database/External APIs
Workflows -> Trigger (Cron/Webhook/Manual) -> Actions -> Logging
```

## Implementation Steps

### Phase 1: Foundation Setup
1. [x] Initialize project structure (existing)
2. [x] Configure Prisma with NeonDB connection
3. [x] Set up NextAuth.js authentication
4. [x] Create base database schema (Users, Sessions, Accounts)
5. [x] Build authentication UI (sign-in, sign-out)

### Phase 2: Core Dashboard
6. [x] Update branding and layout for LifeOS
7. [x] Create widget system architecture
8. [x] Build dashboard widget grid layout
9. [x] Create metric card components
10. [ ] Add user preferences/settings storage (theme, widget layout persistence)

### Phase 3: Metrics & Data
11. [x] Design metrics schema (flexible key-value with types)
12. [x] Build metric input/tracking UI
13. [x] Create metric visualization components (cards with trends)
14. [ ] Implement metric history and trends (charts, time-series graphs)

### Phase 4: Workflows
15. [x] Design workflow schema (triggers, actions, conditions)
16. [x] Build workflow editor UI
17. [ ] Implement cron job scheduler (external scheduler integration)
18. [x] Create webhook endpoint system
19. [x] Add manual trigger execution

### Phase 5: AI Integration
20. [x] Set up OpenAI integration
21. [x] Build chat interface (text)
22. [ ] Implement speech-to-text input
23. [ ] Create AI tool definition system
24. [ ] Build tool execution engine
25. [x] Add conversation history storage

### Phase 6: Integrations
26. [x] Design integration plugin system
27. [x] Create integration settings UI
28. [ ] Build banking integration (Plaid)
29. [ ] Build health data integration (Fitbit/Apple Health)
30. [ ] Create custom integration builder

### Phase 7: Self-Extension
31. [ ] Build code editor component
32. [ ] Create custom widget builder
33. [ ] Implement custom tool creator
34. [ ] Add workflow template system

## File Structure

```
/workspace
├── PLAN.md                              # This file
├── middleware.ts                         # Auth middleware (Edge Runtime)
├── prisma/
│   └── schema.prisma                    # Database schema
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx                   # Minimal auth layout (no sidebar)
│   │   └── sign-in/page.tsx             # Sign in page
│   ├── (dashboard)/
│   │   ├── layout.tsx                   # Dashboard shell layout (sidebar + header)
│   │   ├── page.tsx                     # Dashboard home with real DB data
│   │   ├── metrics/page.tsx             # Metrics CRUD with tracking
│   │   ├── chat/page.tsx                # AI chat with OpenAI
│   │   ├── workflows/page.tsx           # Workflow management with CRUD
│   │   ├── integrations/page.tsx        # Integration management
│   │   ├── health/page.tsx              # Health metrics (DB-backed)
│   │   ├── finance/page.tsx             # Finance metrics (DB-backed)
│   │   ├── activity/page.tsx            # Activity log (DB-backed)
│   │   └── settings/page.tsx            # User settings with save
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts  # NextAuth API routes
│   │   ├── webhooks/[id]/route.ts       # Webhook endpoints
│   │   └── chat/route.ts               # AI chat API (OpenAI)
│   ├── layout.tsx                       # Root layout (HTML + SessionProvider)
│   └── globals.css                      # Global styles with CSS variables
├── components/
│   ├── auth/
│   │   ├── session-provider.tsx         # NextAuth session wrapper
│   │   ├── sign-in-form.tsx             # Sign-in form component
│   │   └── user-button.tsx              # User avatar dropdown
│   ├── chat/
│   │   └── chat-interface.tsx           # Full chat UI with streaming
│   ├── metrics/
│   │   ├── create-metric-form.tsx       # Create metric form
│   │   ├── log-entry-form.tsx           # Log metric entry form
│   │   └── metrics-client.tsx           # Metrics page client wrapper
│   ├── workflows/
│   │   └── workflows-client.tsx         # Workflows page client wrapper
│   ├── settings/
│   │   └── settings-client.tsx          # Settings page client wrapper
│   ├── layout/
│   │   ├── dashboard-shell.tsx          # Shell with sidebar + header
│   │   ├── header.tsx                   # Dashboard header
│   │   └── sidebar.tsx                  # Sidebar navigation
│   └── ui/                              # UI primitives
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── skeleton.tsx
├── lib/
│   ├── auth.ts                          # NextAuth config (with Prisma adapter)
│   ├── auth.config.ts                   # Edge-compatible auth config (no Prisma)
│   ├── prisma.ts                        # Prisma client singleton
│   ├── utils.ts                         # Utility functions (cn)
│   ├── ai/
│   │   └── openai.ts                    # OpenAI client (lazy-init)
│   └── actions/
│       ├── metrics.ts                   # Metrics server actions (CRUD + entries)
│       ├── workflows.ts                 # Workflows server actions (CRUD + run)
│       ├── chat.ts                      # Chat server actions (conversations)
│       └── settings.ts                  # Settings server actions (profile)
└── types/
    └── next-auth.d.ts                   # NextAuth type extensions
```

## Database Schema Overview

### Core Tables
- **User**: User accounts (managed by NextAuth)
- **Account**: OAuth accounts (managed by NextAuth)
- **Session**: User sessions (managed by NextAuth)
- **VerificationToken**: Email verification (managed by NextAuth)

### Application Tables
- **Metric**: User metrics with flexible schema
- **MetricEntry**: Historical metric values
- **Workflow**: Workflow definitions
- **WorkflowRun**: Workflow execution history
- **ChatConversation**: AI chat conversations
- **ChatMessage**: Individual chat messages
- **Integration**: Connected services
- **CustomTool**: User-defined AI tools
- **DashboardWidget**: User dashboard configuration

## Key Decisions

### 1. Authentication Strategy
**Decision**: Use NextAuth.js with JWT sessions + Prisma adapter
**Rationale**: 
- Industry standard for Next.js authentication
- JWT sessions allow Edge Runtime middleware
- Separate auth.config.ts for middleware (Edge-compatible)
- Full auth.ts with Prisma adapter for server-side DB operations
- Supports multiple providers (email, OAuth)

### 2. Route Group Architecture
**Decision**: Use Next.js route groups `(auth)` and `(dashboard)`
**Rationale**:
- `(auth)` group: Minimal layout without sidebar/header for sign-in pages
- `(dashboard)` group: Full DashboardShell layout with sidebar/header
- Root layout only provides HTML shell and SessionProvider
- Clean separation of authenticated vs unauthenticated layouts

### 3. Database Choice
**Decision**: NeonDB (Serverless PostgreSQL) with Prisma
**Rationale**:
- Serverless scales automatically
- PostgreSQL provides JSONB for flexible metric storage
- Prisma provides type-safe database access
- Easy to self-host PostgreSQL if needed later

### 4. AI Chat Architecture
**Decision**: API route with lazy OpenAI client + conversation history
**Rationale**:
- API route for non-blocking chat requests
- Lazy OpenAI initialization to gracefully handle missing API key
- Conversation history stored in DB for context
- User metrics injected as system context for personalized responses

### 5. Server Actions for CRUD
**Decision**: Server actions for all CRUD operations
**Rationale**:
- Type-safe with TypeScript
- Automatic revalidation with revalidatePath
- Built-in auth checking in each action
- No need for separate API routes for standard operations

### 6. Workflow Triggers
**Decision**: Support cron, webhook, manual, and event triggers
**Rationale**:
- Cron: Scheduled tasks (daily reports, etc.)
- Webhook: External service integrations (with dedicated API route)
- Manual: User-initiated workflows
- Event: Triggered by internal system events
- All use same action execution system

## Environment Variables Required

```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# OAuth Providers (optional)
GITHUB_ID=""
GITHUB_SECRET=""
GOOGLE_ID=""
GOOGLE_SECRET=""

# AI
OPENAI_API_KEY=""

# Integrations (future)
PLAID_CLIENT_ID=""
PLAID_SECRET=""
```

## Current Progress

- [x] Base Next.js 16 project structure with App Router
- [x] TailwindCSS 4 configuration with CSS variable theming
- [x] Basic UI components (Button, Card, Input, Badge, Avatar, Skeleton)
- [x] Route group architecture: (auth) and (dashboard) layouts
- [x] Sign-in page renders outside dashboard (no sidebar/header)
- [x] Dashboard layout with sidebar navigation and header
- [x] Prisma setup with NeonDB PostgreSQL + driver adapter
- [x] NextAuth configuration with credentials and OAuth providers
- [x] Edge-compatible middleware for auth route protection
- [x] Database schema (User, Account, Session, Metric, Workflow, Chat, Integration, CustomTool, DashboardWidget)
- [x] Authentication flow (sign-in page, user button, session provider)
- [x] LifeOS branding and navigation
- [x] Dashboard page with real DB data (metrics count, workflow count, recent entries)
- [x] Metrics page - full CRUD (create, delete, log entries with dates/notes)
- [x] AI Chat page - full chat interface with OpenAI integration and conversation history
- [x] Workflows page - full CRUD (create, toggle, run, delete with trigger types)
- [x] Integrations page - integration catalog with DB-backed status
- [x] Health tracking page - DB-backed health metrics
- [x] Finance tracking page - DB-backed finance metrics
- [x] Activity log page - real activity from metric entries and workflow runs
- [x] Settings page - profile editing with save to DB
- [x] Server actions for metrics, workflows, chat, and settings
- [x] Chat API route with OpenAI (graceful fallback when no API key)
- [x] Webhook API endpoint for external integrations
- [x] Build verification passed
