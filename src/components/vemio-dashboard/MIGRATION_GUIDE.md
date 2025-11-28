# Migration Guide

This guide will help you move the Vemio Dashboard components to a new project.

## Step 1: Copy Files

1. Copy the entire `vemio-dashboard` folder to your new project:
   ```bash
   cp -r src/components/vemio-dashboard /path/to/new-project/src/components/
   ```

## Step 2: Install Dependencies

Install the required npm package:

```bash
npm install flatpickr
# or
yarn add flatpickr
# or
pnpm add flatpickr
```

## Step 3: Import Flatpickr CSS

Add to your global CSS file (e.g., `app/globals.css` or `styles/globals.css`):

```css
@import "flatpickr/dist/flatpickr.min.css";
```

Or if using Next.js, add to your root layout:

```typescript
import 'flatpickr/dist/flatpickr.min.css';
```

## Step 4: Configure Tailwind Theme

Add the required color palette to your `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ecf3ff',
          100: '#dde9ff',
          200: '#c2d6ff',
          300: '#9cb9ff',
          400: '#7592ff',
          500: '#465fff',
          600: '#3641f5',
          700: '#2a31d8',
          800: '#252dae',
          900: '#262e89',
        },
        // Ensure you also have gray, success, error, and warning colors
      }
    }
  }
}
```

## Step 5: Verify Required Components

Ensure your project has these UI components (or install a UI library):

### Option A: Use Existing Components
Make sure these exist in your project:
- `@/components/ui/badge/Badge`
- `@/components/ui/button/Button`
- `@/components/form/Select`
- `@/components/progress-bar/ProgressBar`

### Option B: Install a UI Library
Or install a compatible UI library like:
- shadcn/ui
- Headless UI + Tailwind
- Your own component library

## Step 6: Handle Icons

Choose one of these options:

### Option A: Copy Icon Components
Copy your existing icon components to the new project.

### Option B: Replace with Icon Library
Replace icon imports with your preferred library:

```typescript
// Instead of:
import { AlertIcon } from "@/icons";

// Use (example with Heroicons):
import { ExclamationTriangleIcon as AlertIcon } from '@heroicons/react/24/outline';

// Or (example with Lucide):
import { AlertTriangle as AlertIcon } from 'lucide-react';
```

### Option C: Use Inline SVGs
Replace icon imports with inline SVG components.

## Step 7: Update Import Paths (if needed)

If your project uses a different path alias, update imports in the components:

```typescript
// Change from:
import Button from "@/components/ui/button/Button";

// To (example):
import Button from "~/components/ui/button/Button";
// or
import Button from "@components/ui/button/Button";
```

Use find and replace in your IDE:
- Find: `@/components`
- Replace: `your-path-alias/components`

## Step 8: Use in Your Application

Import and use the components:

```typescript
// In your page component
import {
  ReabastecimientoLayout,
  DashboardContent,
  OportunidadesContent,
} from '@/components/vemio-dashboard';

export default function InventoryPage() {
  return (
    <ReabastecimientoLayout
      dashboardContent={<DashboardContent />}
      oportunidadesContent={<OportunidadesContent />}
    />
  );
}
```

## Step 9: Replace Mock Data

The components currently use mock data. Replace with your API calls:

### Example: DashboardContent.tsx

```typescript
// Before (mock data):
const parameters: ParameterData[] = [
  {
    id: 1,
    title: "Días de Inventario",
    optimized: 45,
    actual: 52,
    // ...
  },
];

// After (with API):
const [parameters, setParameters] = useState<ParameterData[]>([]);

useEffect(() => {
  async function fetchData() {
    const response = await fetch('/api/parameters');
    const data = await response.json();
    setParameters(data);
  }
  fetchData();
}, []);
```

## Step 10: Test Everything

1. **Start your dev server:**
   ```bash
   npm run dev
   ```

2. **Check for errors in console**

3. **Verify styling looks correct**

4. **Test interactions:**
   - Navigation filters
   - Tab switching
   - Modal opening/closing
   - Date picker
   - Opportunity cards

## Troubleshooting

### Issue: Components don't render
**Solution:** Check that all required UI components (Badge, Button, etc.) exist in your project.

### Issue: Styling looks broken
**Solution:** 
1. Verify Tailwind is configured correctly
2. Check that theme colors are defined
3. Make sure global CSS imports Tailwind

### Issue: Icons don't show
**Solution:** 
1. Verify icon imports are correct
2. Replace with your icon library if needed

### Issue: DatePicker doesn't work
**Solution:**
1. Ensure flatpickr is installed
2. Check that flatpickr CSS is imported
3. Verify "use client" directive is present

### Issue: Type errors
**Solution:**
1. Check that all types are imported from `./types`
2. Verify your UI components match the expected interfaces
3. Update interfaces in `types.ts` if needed

## Customization

### Change Colors
Edit the color mappings in component logic:
```typescript
// In types or components
color: "error" | "warning" | "success" // Change to your color scheme
```

### Adjust Layout
Modify grid layouts in component JSX:
```typescript
// Change from:
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

// To:
<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
```

### Add Features
The components are designed to be extended. You can:
- Add new filters in NavigationFilters
- Add more KPI cards in DashboardContent
- Add opportunity types in OportunidadesContent
- Extend modal functionality in CoDisenoModal

## Support

For issues specific to your implementation:
1. Check the DEPENDENCIES.md file
2. Review the component source code
3. Check TypeScript types in types.ts
4. Refer to the README.md for component overview

## Next Steps

After successful migration:
1. Connect to your backend API
2. Add authentication/authorization
3. Implement real-time updates (WebSockets, polling)
4. Add error handling and loading states
5. Implement data export functionality
6. Add analytics tracking
7. Customize branding and styling




