// Token utilities
import { nanoid } from 'nanoid';

/**
 * Generate a unique share token for prescription sharing
 * @returns A 12-character URL-safe token
 */
export function generateShareToken(): string {
    return nanoid(12);
}
