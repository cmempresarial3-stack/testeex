# Overview

This is a full-stack Christian mobile application designed to provide spiritual guidance and community connection. The project combines a React-based web frontend with an Express.js backend, featuring daily devotionals, Bible study tools, hymnal access, note-taking capabilities, and an integrated store for Christian products. The core message is "Você não está sozinho, viva com propósito" (You are not alone, live with purpose).

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client is built with **React 18** and **TypeScript**, utilizing a mobile-first responsive design approach:
- **Vite** for fast development and optimized builds
- **Wouter** for lightweight client-side routing
- **Tailwind CSS** with **shadcn/ui** components for consistent styling
- **TanStack Query** for server state management and caching
- **Context API** for global application state (user profile, settings, notes)
- **Local Storage** integration for offline-first data persistence

The application follows a tab-based navigation pattern optimized for mobile devices with dedicated pages for home, Bible study, hymnal, notes, store, and settings.

## Backend Architecture
The server uses **Express.js** with **TypeScript** in a RESTful API design:
- **Express** framework for HTTP server and middleware
- **ESM modules** for modern JavaScript module system
- **Memory-based storage** for development (designed to be extended with database)
- **Type-safe schemas** using Zod for data validation
- **Vite integration** for seamless development experience

The backend is structured to support future database integration while maintaining simple in-memory storage for immediate functionality.

## Data Storage Solutions
**PostgreSQL with Drizzle ORM**:
- **Drizzle ORM** configured for PostgreSQL dialect
- **Neon Database** integration via connection string
- **Shared schema definitions** between client and server using Zod
- **Migration system** with drizzle-kit for database versioning
- **Local storage fallback** for client-side data persistence

The database schema supports user profiles, notes, Bible content, devotionals, and hymns with proper typing and validation.

## Component Architecture
**Modular UI system** built on shadcn/ui foundation:
- **Radix UI primitives** for accessible, unstyled components
- **Custom mobile container** for consistent mobile viewport handling
- **Responsive design patterns** with mobile-first approach
- **Theme system** supporting light/dark modes with CSS custom properties
- **Reusable form components** with proper validation and error handling

## Authentication & User Management
**Local-first approach** with future extensibility:
- **Client-side user profiles** stored in localStorage
- **No authentication required** for core functionality
- **User onboarding flow** for name and profile setup
- **Settings persistence** across app sessions

# External Dependencies

## UI and Styling
- **@radix-ui/react-*** - Comprehensive set of accessible UI primitives for dialogs, forms, navigation, and interactive components
- **tailwindcss** - Utility-first CSS framework for responsive design
- **class-variance-authority** & **clsx** - Type-safe component styling with conditional classes
- **lucide-react** - Modern icon library with consistent design language

## State Management and Data Fetching
- **@tanstack/react-query** - Server state management with caching, background updates, and error handling
- **wouter** - Lightweight client-side routing alternative to React Router

## Database and ORM
- **drizzle-orm** - Type-safe SQL ORM with excellent TypeScript integration
- **@neondatabase/serverless** - Serverless PostgreSQL database connection for modern deployment
- **drizzle-kit** - Database migration and introspection toolkit

## Development and Build Tools
- **vite** - Fast build tool with hot module replacement and optimized production builds
- **@vitejs/plugin-react** - Official React integration for Vite
- **typescript** - Static type checking for enhanced developer experience
- **@replit/vite-plugin-runtime-error-modal** - Development error handling specific to Replit environment

## Form Handling and Validation
- **@hookform/resolvers** - Validation library integrations for React Hook Form
- **zod** - TypeScript-first schema validation for runtime type checking

## Payment Integration (Future)
- **@stripe/stripe-js** & **@stripe/react-stripe-js** - Payment processing for store functionality
- **connect-pg-simple** - PostgreSQL session store for user sessions