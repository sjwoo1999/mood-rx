// Rate limiting using Supabase
import { createAdminClient } from '@/lib/supabase/admin';

const ANONYMOUS_LIMIT = 5;
const AUTHENTICATED_LIMIT = 10;

interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    limit: number;
}

/**
 * Check and increment rate limit for a user
 * @param identifier - IP address for anonymous users, user_id for authenticated
 * @param isAuthenticated - Whether the user is authenticated
 */
export async function checkRateLimit(
    identifier: string,
    isAuthenticated: boolean
): Promise<RateLimitResult> {
    const supabase = createAdminClient();
    const limit = isAuthenticated ? AUTHENTICATED_LIMIT : ANONYMOUS_LIMIT;
    const key = isAuthenticated ? `user:${identifier}` : `ip:${identifier}`;
    const today = new Date().toISOString().split('T')[0];

    // Get or create rate limit record
    const { data: existing } = await supabase
        .from('rate_limits')
        .select('count, window_start')
        .eq('key', key)
        .single();

    if (!existing || existing.window_start !== today) {
        // New day or new user - create/reset record
        await supabase
            .from('rate_limits')
            .upsert({
                key,
                count: 1,
                window_start: today,
            });

        return {
            allowed: true,
            remaining: limit - 1,
            limit,
        };
    }

    if (existing.count >= limit) {
        return {
            allowed: false,
            remaining: 0,
            limit,
        };
    }

    // Increment count
    await supabase
        .from('rate_limits')
        .update({ count: existing.count + 1 })
        .eq('key', key);

    return {
        allowed: true,
        remaining: limit - existing.count - 1,
        limit,
    };
}

/**
 * Get client IP from request headers
 */
export function getClientIP(request: Request): string {
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }

    const realIP = request.headers.get('x-real-ip');
    if (realIP) {
        return realIP;
    }

    return '127.0.0.1';
}
