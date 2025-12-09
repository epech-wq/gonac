/**
 * Get the database schema name from environment variable
 * Defaults to 'public' if not set
 * 
 * For server-side: uses DB_SCHEMA
 * For client-side: uses NEXT_PUBLIC_DB_SCHEMA
 */
export function getDbSchema(): string {
  // Check client-side first (NEXT_PUBLIC_ prefix is accessible in browser)
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_DB_SCHEMA || 'vemio';
  }
  // Server-side
  return process.env.DB_SCHEMA || process.env.NEXT_PUBLIC_DB_SCHEMA || 'vemio';
}
