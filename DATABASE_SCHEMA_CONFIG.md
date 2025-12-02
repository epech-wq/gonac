# Database Schema Configuration

## Overview

All database repositories in this project now support configurable schema names via environment variables. This allows you to easily switch between different database schemas without modifying code.

## Configuration

### Environment Variable

Set the `DB_SCHEMA` environment variable in your `.env.local` file:

```bash
DB_SCHEMA=gonac
```

### Default Value

If the environment variable is not set, the default schema name is `gonac`.

### Environment Variable Priority

The system checks for schema configuration in the following order:
1. `DB_SCHEMA` environment variable
2. `NEXT_PUBLIC_DB_SCHEMA` environment variable
3. Default value: `gonac`

## Setup Instructions

1. Create a `.env.local` file in the project root (if it doesn't exist):
   ```bash
   touch .env.local
   ```

2. Add the database schema configuration:
   ```bash
   DB_SCHEMA=your_schema_name
   ```

3. Restart your development server to apply the changes.

## Files Modified

All repository files have been updated to use the `getDbSchema()` utility function:

- `src/repositories/acciones.repository.ts`
- `src/repositories/accionReabasto.repository.ts`
- `src/repositories/cambioInventario.repository.ts`
- `src/repositories/descuento.repository.ts`
- `src/repositories/exhibiciones.repository.ts`
- `src/repositories/metricas.repository.ts`
- `src/repositories/parametros.repository.ts`
- `src/repositories/parametrosOptimos.repository.ts`
- `src/repositories/promotoria.repository.ts`
- `src/repositories/segmentacion.repository.ts`
- `src/repositories/valorizacion.repository.ts`

## Utility Function

The schema configuration is managed by the `getDbSchema()` function in `src/utils/env.ts`:

```typescript
export const getDbSchema = (): string => {
  return process.env.DB_SCHEMA || process.env.NEXT_PUBLIC_DB_SCHEMA || 'gonac';
};
```

## Usage Example

In any repository, the schema is now dynamically resolved:

```typescript
import { getDbSchema } from '@/utils/env';

// Before:
const { data, error } = await this.supabase
  .schema('gonac')  // Hardcoded
  .from('table_name')
  .select('*');

// After:
const { data, error } = await this.supabase
  .schema(getDbSchema())  // Dynamic
  .from('table_name')
  .select('*');
```

## Testing

To test with a different schema:

1. Update your `.env.local`:
   ```bash
   DB_SCHEMA=test_schema
   ```

2. Restart the development server:
   ```bash
   npm run dev
   ```

3. All database queries will now use `test_schema` instead of `gonac`.

## Environment Files

- `.env.example` - Template for environment variables (committed to repository)
- `.env.local` - Local environment configuration (gitignored, not committed)

## Notes

- The `.env.local` file is automatically ignored by git to prevent committing sensitive configuration.
- Make sure to update `.env.example` if you add new environment variables.
- Server-side environment variables (like `DB_SCHEMA`) are only available during build time and server-side rendering.
- If you need client-side access, use the `NEXT_PUBLIC_` prefix (e.g., `NEXT_PUBLIC_DB_SCHEMA`).

## Troubleshooting

### Schema not changing

1. Verify the environment variable is set in `.env.local`
2. Restart the development server completely
3. Clear Next.js cache: `rm -rf .next`
4. Check that you're not overriding the environment variable elsewhere

### Environment variable not found

Make sure you're using the correct environment variable name:
- Server-side: `DB_SCHEMA`
- Client-side: `NEXT_PUBLIC_DB_SCHEMA`

For repository files (server-side), use `DB_SCHEMA`.

