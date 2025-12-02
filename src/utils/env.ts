/**
 * Environment variables utility
 * Provides centralized access to environment configuration
 */

/**
 * Get database schema name from environment variable
 * Defaults to 'gonac' if not set
 */
export const getDbSchema = (): string => {
  return process.env.DB_SCHEMA || process.env.NEXT_PUBLIC_DB_SCHEMA || 'gonac';
};

/**
 * Export all environment utilities
 */
export const env = {
  dbSchema: getDbSchema(),
};

