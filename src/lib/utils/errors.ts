// Error handling utilities

export const ERROR_CODES = {
    INVALID_INPUT: 'invalid_input',
    UNAUTHORIZED: 'unauthorized',
    FORBIDDEN: 'forbidden',
    RATE_LIMITED: 'rate_limited',
    AI_FAILED: 'ai_failed',
    IMAGE_FAILED: 'image_failed',
    DB_FAILED: 'db_failed',
    NOT_FOUND: 'not_found',
    UNKNOWN: 'unknown',
} as const;

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];

export function apiError(code: ErrorCode, message: string, status = 400): Response {
    return new Response(
        JSON.stringify({ ok: false, error: { code, message } }),
        {
            status,
            headers: { 'Content-Type': 'application/json' },
        }
    );
}

export function apiSuccess<T>(data: T): Response {
    return new Response(
        JSON.stringify({ ok: true, data }),
        {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        }
    );
}

export class AppError extends Error {
    constructor(
        public code: ErrorCode,
        message: string,
        public status: number = 400
    ) {
        super(message);
        this.name = 'AppError';
    }
}
