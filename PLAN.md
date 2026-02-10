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
2. [ ] Configure Prisma with NeonDB connection
3. [ ] Set up NextAuth.js authentication
4. [ ] Create base database schema (Users, Sessions, Accounts)
5. [ ] Build authentication UI (sign-in, sign-out)

### Phase 2: Core Dashboard
6. [ ] Update branding and layout for LifeOS
7. [ ] Create widget system architecture
8. [ ] Build dashboard widget grid layout
9. [ ] Create metric card components
10. [ ] Add user preferences/settings storage

### Phase 3: Metrics & Data
11. [ ] Design metrics schema (flexible key-value with types)
12. [ ] Build metric input/tracking UI
13. [ ] Create metric visualization components (charts, graphs)
14. [ ] Implement metric history and trends

### Phase 4: Workflows
15. [ ] Design workflow schema (triggers, actions, conditions)
16. [ ] Build workflow editor UI
17. [ ] Implement cron job scheduler
18. [ ] Create webhook endpoint system
19. [ ] Add manual trigger execution

### Phase 5: AI Integration
20. [ ] Set up OpenAI integration
21. [ ] Build chat interface (text)
22. [ ] Implement speech-to-text input
23. [ ] Create AI tool definition system
24. [ ] Build tool execution engine
25. [ ] Add conversation history storage

### Phase 6: Integrations
26. [ ] Design integration plugin system
27. [ ] Create integration settings UI
28. [ ] Build banking integration placeholder
29. [ ] Build health data integration placeholder
30. [ ] Create custom integration builder

### Phase 7: Self-Extension
31. [ ] Build code editor component
32. [ ] Create custom widget builder
33. [ ] Implement custom tool creator
34. [ ] Add workflow template system

## File Structure

```
/workspace
├── PLAN.md                          # This file
├── prisma/
│   └── schema.prisma                # Database schema
├── app/
│   ├── (auth)/
│   │   ├── sign-in/page.tsx         # Sign in page
│   │   └── sign-out/page.tsx        # Sign out page
│   ├── api/
│   │   ├── auth/[...nextauth]/      # NextAuth API routes
│   │   ├── webhooks/[id]/           # Webhook endpoints
│   │   ├── metrics/                 # Metrics CRUD API
│   │   ├── workflows/               # Workflows API
│   │   └── chat/                    # AI chat API
│   ├── dashboard/                   # Main dashboard (rename from /)
│   ├── metrics/                     # Metrics tracking
│   ├── workflows/                   # Workflow management
│   ├── chat/                        # AI chat interface
│   ├── integrations/                # Integration settings
│   ├── settings/                    # User settings
│   ├── layout.tsx                   # Root layout with auth
│   ├── page.tsx                     # Home/landing or redirect
│   └── globals.css                  # Global styles
├── components/
│   ├── auth/
│   │   └── auth-button.tsx          # Auth button component
│   ├── dashboard/
│   │   ├── widget-grid.tsx          # Widget grid layout
│   │   ├── metric-card.tsx          # Metric display card
│   │   └── quick-actions.tsx        # Quick action buttons
│   ├── chat/
│   │   ├── chat-interface.tsx       # Main chat UI
│   │   ├── message-bubble.tsx       # Chat message
│   │   └── voice-input.tsx          # Speech input
│   ├── workflows/
│   │   ├── workflow-editor.tsx      # Workflow builder
│   │   └── workflow-card.tsx        # Workflow display
│   ├── layout/                      # Existing layout components
│   └── ui/                          # Existing UI components
├── lib/
│   ├── auth.ts                      # NextAuth configuration
│   ├── prisma.ts                    # Prisma client
│   ├── ai/
│   │   ├── openai.ts                # OpenAI client
│   │   └── tools.ts                 # AI tool definitions
│   └── utils.ts                     # Utility functions
└── types/
    ├── index.ts                     # Shared types
    ├── metrics.ts                   # Metric types
    └── workflows.ts                 # Workflow types
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

## Key Decisions

### 1. Authentication Strategy
**Decision**: Use NextAuth.js with database sessions
**Rationale**: 
- Industry standard for Next.js authentication
- Supports multiple providers (email, OAuth)
- Database sessions allow for server-side session management
- Easy to add new providers later

### 2. Database Choice
**Decision**: NeonDB (Serverless PostgreSQL) with Prisma
**Rationale**:
- Serverless scales automatically
- PostgreSQL provides JSONB for flexible metric storage
- Prisma provides type-safe database access
- Easy to self-host PostgreSQL if needed later

### 3. AI Tool Execution
**Decision**: Server-side tool execution with defined schemas
**Rationale**:
- Security: Tools run on server, not client
- Control: Can limit what tools AI can execute
- Extensibility: Users can define new tools with JSON schemas

### 4. Widget System
**Decision**: React Server Components with client interactivity
**Rationale**:
- Server-side data fetching for performance
- Client components only where needed (interactions)
- Easy to add new widget types

### 5. Workflow Triggers
**Decision**: Support cron, webhook, and manual triggers
**Rationale**:
- Cron: Scheduled tasks (daily reports, etc.)
- Webhook: External service integrations
- Manual: User-initiated workflows
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

- [x] Base Next.js project structure
- [x] TailwindCSS configuration
- [x] Basic UI components (Button, Card, Input, etc.)
- [x] Dashboard layout with sidebar
- [x] Prisma setup with NeonDB PostgreSQL schema
- [x] NextAuth configuration with credentials and OAuth providers
- [x] Database schema (User, Account, Session, Metric, Workflow, Chat, Integration, CustomTool)
- [x] Authentication flow (sign-in page, user button, session provider)
- [x] LifeOS branding and navigation
- [x] Dashboard page with metrics overview
- [x] Metrics page placeholder
- [x] AI Chat page placeholder
- [x] Workflows page placeholder
- [x] Integrations page placeholder
- [x] Health tracking page placeholder
- [x] Finance tracking page placeholder
- [x] Activity log page placeholder
- [x] Settings page placeholder
- [x] Build verification passed
