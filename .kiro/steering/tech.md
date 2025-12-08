# Technology Stack

## Core Technologies

- **Next.js 15.4.3** - React framework with App Router
- **React 19** - Latest React with modern patterns
- **TypeScript 5** - Type-safe JavaScript development
- **Tailwind CSS v4** - Utility-first CSS framework with custom theme
- **PostCSS** - CSS processing with Tailwind integration

## Key Libraries

- **ApexCharts** (`react-apexcharts`) - Data visualization and charts
- **FullCalendar** - Calendar component with drag-and-drop scheduling
- **React Vector Maps** (`@react-jvectormap`) - Interactive world maps
- **React DnD** - Drag and drop functionality for task management
- **React Dropzone** - File upload handling
- **Flatpickr** - Advanced date picker component
- **Swiper** - Touch slider component for carousels
- **SimpleBar React** - Custom scrollbar component
- **PrismJS** - Syntax highlighting for code blocks
- **Clsx & Tailwind Merge** - Conditional CSS class utilities

## UI Framework

- **Custom Design System** - Built on Tailwind CSS v4 with:
  - Custom color palette (brand, gray, success, error, warning)
  - Custom typography scale and spacing
  - Dark mode support with theme context
  - Custom utility classes for menu items and components
  - Responsive breakpoints including 2xsm (375px) and 3xl (2000px)

## Development Tools

- **ESLint** - Code linting with Next.js and TypeScript rules
- **SVGR** - SVG to React component conversion via Webpack
- **TypeScript** - Strict configuration with path mapping (@/\*)
- **Outfit Font** - Google Fonts integration

## Build Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Configuration Notes

- Uses Next.js App Router with route groups for layout organization
- SVG files automatically converted to React components via SVGR
- Tailwind CSS v4 with custom theme and utility classes
- TypeScript with strict configuration and path aliases
- ESLint configured for Next.js 15 and React 19
- Custom CSS utilities for menu systems, scrollbars, and third-party integrations
- Dark mode implementation with context providers
