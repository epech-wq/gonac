# Project Structure

## Root Level

- `src/` - Main application source code
- `public/` - Static assets and images organized by category
- Configuration files: `next.config.ts`, `tsconfig.json`, `package.json`, `postcss.config.mjs`

## Source Code Organization (`src/`)

### Core Application

- `app/` - Next.js App Router with layout and page components
- `svg.d.ts` - TypeScript declarations for SVG imports

### Components (`src/components/`)

**Always check existing components before creating new ones.**

- `ai/` - AI-related components (layout, content generators, code blocks)
- `analytics/` - Analytics dashboard components (charts, metrics, sessions)
- `api-keys/` - API key management components
- `auth/` - Authentication forms (SignIn, SignUp, OTP, Reset Password)
- `calendar/` - Calendar component with FullCalendar integration
- `cards/` - Various card components (with icons, images, links, horizontal)
- `charts/` - Data visualization components using ApexCharts (bar, line, pie charts)
- `chats/` - Chat interface components (chat box, sidebar, headers)
- `common/` - Shared utilities and components:
  - `ChartTab.tsx` - Chart tabbing component
  - `ComponentCard.tsx` - Wrapper for component examples
  - `CountdownTimer.tsx` - Timer component
  - `GridShape.tsx` - Grid layout helper
  - `PageBreadCrumb.tsx` - Breadcrumb navigation
  - `TableDropdown.tsx` - Table action dropdown
  - `ThemeToggleButton.tsx` - Theme switcher
  - `ThemeTogglerTwo.tsx` - Alternative theme toggle
- `crm/` - CRM-specific components (metrics, orders, revenue charts)
- `ecommerce/` - E-commerce components (products, billing, invoices, transactions)
- `email/` - Email interface components (inbox, details, sidebar)
- `example/` - Example implementations (dropdowns, modals)
- `faqs/` - FAQ components with different layouts
- `file-manager/` - File management components (folders, files, storage)
- `form/` - Form elements and inputs (selectors, date pickers with Flatpickr, validation)
- `header/` - Header components (notifications, user dropdowns)
- `integration/` - Integration management components (cards, modals, settings)
- `invoice/` - Invoice management components (creation, listing, metrics)
- `logistics/` - Logistics dashboard components (delivery tracking, vehicles)
- `marketing/` - Marketing analytics components (campaigns, traffic, impressions)
- `price-table/` - Pricing table components with different layouts
- `progress-bar/` - Progress bar components with various styles
- `saas/` - SaaS dashboard components (metrics, charts, performance)
- `stocks/` - Stock market components (portfolio, transactions, watchlist)
- `support/` - Support ticket components (lists, details, metrics)
- `tables/` - Table components (basic tables, data tables)
- `task/` - Task management components (kanban with React DnD, task lists, headers)
- `transactions/` - Transaction components (details, history, customer info)
- `ui/` - Reusable UI components organized by type:
  - `alert/` - Alert and notification components
  - `avatar/` - User avatar components
  - `badge/` - Badge and label components
  - `breadcrumb/` - Breadcrumb navigation
  - `button/` - Button variants and groups
  - `buttons-group/` - Button group components
  - `card/` - Card layout components
  - `carousel/` - Swiper-based carousel components
  - `dropdown/` - Dropdown menu components
  - `images/` - Image display components
  - `links/` - Link styling components
  - `list/` - List display components
  - `modal/` - Modal dialog components
  - `notification/` - Notification components
  - `pagination/` - Pagination controls
  - `popover/` - Popover components
  - `ribbons/` - Ribbon/banner components
  - `table/` - Table UI components
  - `tabs/` - Tab navigation components
  - `tooltip/` - Tooltip components
  - `video/` - Video player components
- `user-profile/` - User profile components (info cards, address, metadata)
- `videos/` - Video components with different aspect ratios

### Application Structure

- `app/` - Next.js App Router structure with route groups and layouts
- `context/` - React contexts (ThemeContext, SidebarContext)
- `hooks/` - Custom React hooks (useGoBack, useModal)
- `icons/` - SVG icon files and exports
- `layout/` - Layout components (if any)
- `utils/` - Utility functions and helpers

### App Router Organization (`src/app/`)

- `(admin)/` - Admin dashboard route group
  - `(home)/` - Dashboard variants (analytics, crm, logistics, marketing, saas, stocks)
  - `(others-pages)/` - Feature pages (ai, charts, ecommerce, email, forms, support, tables, task, etc.)
  - `(ui-elements)/` - UI component showcases (alerts, buttons, cards, modals, etc.)
- `(full-width-pages)/` - Full-width layout route group
  - `(auth)/` - Authentication pages (signin, signup, etc.)
  - `(error-pages)/` - Error pages (404, 500, etc.)
  - `coming-soon/` - Coming soon page
  - `success/` - Success page

## Asset Organization (`public/`)

- `images/` - Organized by feature category:
  - `ai/` - AI-related images
  - `brand/` - Brand assets and logos
  - `cards/` - Card component images
  - `carousel/` - Carousel/slider images
  - `chat/` - Chat interface images
  - `country/` - Country/location images
  - `error/` - Error page images
  - `grid-image/` - Grid layout images
  - `icons/` - Icon assets
  - `logistics/` - Logistics dashboard images
  - `logo/` - Logo variations
  - `product/` - Product images
  - `shape/` - Shape/decoration images
  - `support/` - Support interface images
  - `task/` - Task management images
  - `user/` - User profile images
  - `video-thumb/` - Video thumbnail images
  - `favicon.ico` - Site favicon

## Architectural Patterns

- **Next.js App Router**: File-based routing with route groups for layout organization
- **Context Providers**: ThemeProvider and SidebarProvider for global state
- **Component Composition**: Reusable UI components with TypeScript props
- **File Naming**: PascalCase for components, kebab-case for utilities
- **Import Structure**: Path aliases (@/\*) for clean imports, organized by feature
- **Layout System**: Nested layouts using Next.js App Router conventions

## Context Providers

- **ThemeProvider** (`src/context/ThemeContext.tsx`) - Dark/light mode management
- **SidebarProvider** (`src/context/SidebarContext.tsx`) - Sidebar state management

## Custom Hooks

- **useGoBack** (`src/hooks/useGoBack.ts`) - Navigation helper
- **useModal** (`src/hooks/useModal.ts`) - Modal state management

## Routing Structure

- `/(admin)/` - Main dashboard route group with shared admin layout
  - `/(home)/` - Dashboard variants (analytics, crm, logistics, marketing, saas, stocks)
  - `/(others-pages)/` - Feature pages (ai, charts, ecommerce, email, forms, support, tables, task, etc.)
  - `/(ui-elements)/` - UI component showcases (alerts, buttons, cards, modals, etc.)
- `/(full-width-pages)/` - Full-width layout route group
  - `/(auth)/` - Authentication pages (signin, signup, etc.)
  - `/(error-pages)/` - Error pages (404, 500, etc.)
  - `/coming-soon/` - Coming soon page
  - `/success/` - Success page
- `/not-found.tsx` - 404 fallback page
