# Festival Homepage Project

## Overview

This is a mobile-first festival homepage application built with React, Express, and TypeScript. The application showcases a multilingual (Korean, English, Chinese, Japanese) festival information page with sections for gallery, food zones, location, programs, and merchandise. The design follows a custom design system with specific color palettes, typography (Pretendard font), and glassmorphism effects. The application features sticky navigation tabs, horizontal scrolling galleries, and downloadable PDF pamphlets.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build Tools:**
- React 18 with TypeScript for the UI layer
- Vite as the build tool and development server
- Wouter for client-side routing (lightweight alternative to React Router)
- Mobile-first responsive design approach

**State Management:**
- TanStack Query (React Query) for server state management
- Local React state (useState) for UI state like language selection and active tab tracking
- IntersectionObserver API for tab activation based on scroll position

**Component Structure:**
- Component-based architecture with shadcn/ui as the base UI library (New York style variant)
- Radix UI primitives for accessible, unstyled components
- Custom festival-specific components built on top of shadcn/ui
- Path aliases configured: `@/` for client source, `@shared/` for shared types, `@assets/` for attached assets

**Styling System:**
- Tailwind CSS with custom configuration
- Custom color palette defined in tailwind.config.ts matching the design guidelines (gray-100 through gray-900, modu-red primary color)
- CSS variables for theme consistency
- Pretendard web font loaded from CDN
- Custom border radius values (lg: 9px, md: 6px, sm: 3px)

**Data Management:**
- Static data files stored in client-side (no database queries needed)
- Type-safe schemas defined using Zod in shared/schema.ts
- Multilingual content stored in translation objects with language keys (ko, en, zh, ja)

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript
- Minimal API surface - primarily serves static files and PDF downloads
- Vite middleware integration for development hot module replacement

**API Endpoints:**
- `/api/download-pamphlet` - Downloads festival pamphlet PDF
- `/api/programs/pamphlet` - Downloads full timetable PDF
- `/api/programs/:id/pamphlet` - Downloads individual program pamphlet

**Server Configuration:**
- Development mode uses Vite's middleware mode for HMR
- Production mode serves pre-built static assets
- Logging middleware for API request tracking
- Error handling middleware for consistent error responses

### Data Storage Solutions

**Current Implementation:**
- No active database - all festival data is static and client-side
- Drizzle ORM configured with PostgreSQL dialect for future extensibility
- Schema definitions exist in shared/schema.ts using Zod validators
- Storage interface defined but not implemented (MemStorage placeholder)

**Rationale:**
The festival homepage displays static, read-only content that doesn't require dynamic updates. Keeping data client-side eliminates database overhead and improves performance. The Drizzle configuration provides a migration path if dynamic content management is needed in the future.

### Key Design Patterns

**Mobile-First Responsive Design:**
- 100vh hero section with full-viewport poster
- Horizontal scroll containers for galleries and navigation tabs
- Sticky tab navigation that becomes fixed on scroll
- Touch-friendly UI elements sized appropriately for mobile interaction

**Internationalization (i18n):**
- Language selection stored in component state
- Translation lookup via getTranslation helper function
- All content objects use language keys (ko, en, zh, ja)
- Language selector prominently displayed after hero section

**Intersection Observer Pattern:**
- Automatic tab highlighting based on visible section
- Smooth scroll behavior when clicking tab navigation
- Optimized scroll detection with appropriate root margins

**Component Composition:**
- Page-level component (Festival.tsx) orchestrates all sections
- Section components are self-contained and receive language as prop
- UI components from shadcn/ui provide consistent styling
- Callbacks passed down for actions (PDF downloads, AI call button)

### External Dependencies

**Third-Party UI Libraries:**
- shadcn/ui component library (New York variant)
- Radix UI primitives (@radix-ui/*) for accessible components
- Embla Carousel for potential carousel functionality
- Lucide React for iconography

**Styling & Design:**
- Tailwind CSS for utility-first styling
- class-variance-authority (CVA) for component variant management
- clsx and tailwind-merge for className composition

**Form & Validation:**
- React Hook Form for form handling
- Zod for schema validation
- @hookform/resolvers for Zod integration with React Hook Form

**Development Tools:**
- Replit-specific Vite plugins for development banner and cartographer
- Runtime error overlay for better DX
- TypeScript for type safety across the stack

**Database & ORM (configured but not actively used):**
- Drizzle ORM with PostgreSQL dialect
- @neondatabase/serverless for Neon database compatibility
- Migration setup via drizzle-kit

**Fonts:**
- Pretendard web font loaded from jsdelivr CDN
- Preconnect configured for CDN optimization

**Build & Bundling:**
- esbuild for server-side bundling in production
- Vite for client-side bundling and development server
- TypeScript compiler for type checking (noEmit mode)