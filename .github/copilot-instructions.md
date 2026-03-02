# Skhool - Copilot Instructions

## Project Overview

Skhool is a Next.js-based school management system with role-based modules for students, teachers, and admins. The app uses AI (Google Generative AI) for features like schedule generation, tutoring, and content filtering.

**Tech Stack**: Next.js 15 (App Router), React 19, TypeScript, TailwindCSS, React Query, Ant Design, Axios, Google GenAI

## Architecture & Key Patterns

### 1. Component Structure (`src/app/components/`)

- **Page-level components**: `src/app/[role]/page.tsx` (student, teacher, admin)
- **Shared components**: `common/` folder (Button.tsx, Modal.tsx, Table.tsx, etc.)
- **Feature-specific components**: Grouped by feature (exams/, grades/, attendance/)
- **Context providers**: `CommandPalleteContext.tsx`, `providers.tsx` for global state

**Pattern**: Components are functional with React hooks. Use `"use client"` for client-side features (modals, forms, real-time updates).

### 2. Data Fetching & State Management

- **React Query**: All server calls use `useQuery`/`useMutation` from `@tanstack/react-query`
  - Queries keyed by resource: `["subjects"]`, `["classes"]`, `["teachers"]`
  - Placeholder data prevents layout shift: `placeholderData: []`
- **Axios Instance**: Centralized at `src/app/lib/axiosInstance.tsx`
  - Auto-injects Bearer token from localStorage
  - Base URL from `process.env.API_URL`
- **Example**: See [schedule/page.tsx](src/app/admin/manage/schedule/page.tsx#L80-L110) for multi-query pattern

### 3. API Routes (`src/app/api/`)

- **Server-side handlers**: `route.ts` files handle POST/GET requests
- **AI Integration**: `api/ai-filter/route.ts`, `api/ai-navigate/route.ts` - proxy AI calls server-side for security
- **Prompt Engineering**: Store system instructions in component state or env; validate/clean AI responses before use

### 4. Authentication & Middleware

- **Token Storage**: Tokens kept in localStorage, injected via axios interceptor
- **Middleware**: `src/middleware.ts` handles route protection (role-based redirects)
- **Auth Flow**: Login at `auth/login/page.tsx` → token → protected routes

### 5. Type System

- **Central types**: `src/app/types/types.ts` - define `User`, `Student`, `Teacher`, enums for `AttendanceStatus`, etc.
- **Import path**: Use absolute imports `@/app/types/types` or `@/app/components/X`
- **Pattern**: Interfaces for data models, enums for fixed values (attendance, grades)

### 6. Styling Conventions

- **TailwindCSS + Ant Design**: Mix Tailwind classes with Ant components (DatePicker, TimePicker, etc.)
- **Color system**: Use gradient classes for buttons (`bg-gradient-to-r from-blue-500 to-indigo-500`)
- **Responsive**: Mobile-first, use `sm:`, `md:`, `lg:` breakpoints
- **Example**: See [Button.tsx](src/app/components/common/Button.tsx) for reusable styled components

### 7. AI Feature Pattern

- **Model**: `gemini-2.5-flash-lite` via `@google/genai`
- **System Instruction**: Define strict output format (JSON) in system prompt
- **Validation**: Always validate AI JSON response before setState:
  - Clean response: remove markdown, extra whitespace
  - Parse JSON safely with try-catch
  - Validate structure (fields, enums, array lengths)
  - Example: [schedule/page.tsx#L180-L220](src/app/admin/manage/schedule/page.tsx#L180-L220)
- **Error Handling**: Toast notifications for user feedback

## Critical Files & Workflows

### Route Structure

```
src/app/
├── admin/page.tsx → Dashboard
│   ├── exams/ → Exam management
│   ├── manage/schedule/ → AI-powered timetable generation
│   ├── students/ → Student directory
│   └── teachers/ → Teacher management
├── student/ → Student portal (grades, attendance, resources)
├── teacher/ → Teacher portal (student tracking, grading)
├── api/ → Backend routes (AI proxying, data operations)
└── auth/login/ → Authentication
```

### Data Flow Example: Schedule Generation

1. User selects class + triggers AI generation
2. Component queries subjects, classes, teachers via React Query
3. Builds prompt with constraints (no double-booking, rest periods, etc.)
4. Posts to AI with system instruction expecting JSON output
5. Validates JSON structure and business rules
6. Updates state and displays in table
7. User saves via API endpoint

## Development Commands

```bash
yarn dev          # Start dev server with Turbopack (port 3000)
yarn build        # Production build
yarn lint         # ESLint check
yarn start        # Run production build
```

## Common Patterns & Gotchas

### 1. useState vs React Query

- Use `useState` for UI state (modals, forms, local filters)
- Use `useQuery` for server state (data from API)
- Don't duplicate server state in local state

### 2. Toast Notifications

- Import: `import { toast } from "react-toastify"`
- Usage: `toast.success("message", { position: "bottom-right" })`
- Always show feedback for AI operations (generating, saving)

### 3. Time & Date Handling

- Import `dayjs` for formatting: `dayjs(time, "HH:mm").format("HH:mm")`
- Use Ant Design `TimePicker` for UI inputs
- Store times as "HH:mm" strings in state

### 4. Modal/Form Pattern

- Create modal component wrapping `Modal.tsx` (from common/)
- Pass `onSubmit` callback that calls mutation or action
- Lift state to parent if multiple modals share data

### 5. Error Handling

- Wrap API calls in try-catch within mutation callbacks
- Show user-friendly error toast: `toast.error(error.message || "Operation failed")`
- Log detailed errors to console for debugging

## Environment Variables

- `NEXT_PUBLIC_GOOGLE_STUDIO_API_KEY` - Google Generative AI key (must have NEXT*PUBLIC* prefix for browser access)
- `API_URL` - Backend API base URL

## Testing & Debugging

- No test framework detected; add Jest/React Testing Library if needed
- Use browser DevTools (React DevTools, Network tab) for debugging
- Check `Console` for validation errors (especially AI response parsing)
- React Query DevTools: Install `@tanstack/react-query-devtools` for query state inspection

## Code Review Checklist

- [ ] Component uses `"use client"` for interactive features
- [ ] Data fetching via React Query with proper keys
- [ ] Types imported from `@/app/types/types`
- [ ] Error handling with toast feedback
- [ ] AI responses validated before use
- [ ] Accessibility: buttons have aria labels, forms have labels
- [ ] Responsive: tested on mobile breakpoints
