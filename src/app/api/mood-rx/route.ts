// POST /api/mood-rx - Create new mood prescription
import { NextRequest } from 'next/server';
import { detectCrisis } from '@/lib/safety/crisis';
import { CreateMoodRxRequestSchema } from '@/lib/ai/schema';
import { apiError, apiSuccess, ERROR_CODES } from '@/lib/utils/errors';
import { SAFETY_MESSAGE } from '@/lib/safety/templates';
import { isMockMode, createMockRecord, MOCK_USER } from '@/lib/mock/data';

export async function POST(request: NextRequest) {
    try {
        // Parse and validate request body
        const body = await request.json();
        const parsed = CreateMoodRxRequestSchema.safeParse(body);

        if (!parsed.success) {
            const firstIssue = parsed.error.issues?.[0];
            return apiError(ERROR_CODES.INVALID_INPUT, firstIssue?.message || '입력이 올바르지 않습니다.', 400);
        }

        const { situation, emotion, energy: energyNumber } = parsed.data;
        const energy = energyNumber as 1 | 2 | 3 | 4 | 5;

        // CRITICAL: Crisis detection BEFORE AI call
        const isCrisis = detectCrisis(situation);

        // Mock mode - use in-memory storage
        if (isMockMode()) {
            const record = createMockRecord({
                situation,
                emotion,
                energy,
                crisis: isCrisis,
            }, MOCK_USER.id);

            if (isCrisis) {
                return apiSuccess({
                    id: record.id,
                    crisis: true,
                    safety_message: SAFETY_MESSAGE.body,
                    next_step: SAFETY_MESSAGE.next_step,
                });
            }

            return apiSuccess({
                id: record.id,
                crisis: false,
                result: {
                    core_reason: record.core_reason,
                    next_action_24h: record.next_action_24h,
                    forbidden_phrase: record.forbidden_phrase,
                },
                card_image_url: null,
            });
        }

        // Production mode - use Supabase and Claude
        const { createServerSupabaseClient } = await import('@/lib/supabase/server');
        const { createAdminClient } = await import('@/lib/supabase/admin');
        const { callClaudeForRx } = await import('@/lib/ai/claude');
        const { checkRateLimit, getClientIP } = await import('@/lib/rateLimit/limiter');

        const supabase = await createServerSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();
        const userId = user?.id ?? null;

        // Rate limiting
        const clientIP = getClientIP(request);
        const identifier = userId || clientIP;

        try {
            const rateLimitResult = await checkRateLimit(identifier, !!userId);
            if (!rateLimitResult.allowed) {
                return apiError(
                    ERROR_CODES.RATE_LIMITED,
                    `일일 사용 한도(${rateLimitResult.limit}회)를 초과했습니다. 내일 다시 시도해주세요.`,
                    429
                );
            }
        } catch {
            console.error('Rate limit check failed, proceeding anyway');
        }

        const adminClient = createAdminClient();

        if (isCrisis) {
            const { data, error } = await adminClient
                .from('mood_rx')
                .insert({
                    user_id: userId,
                    situation,
                    emotion,
                    energy,
                    core_reason: 'blocked',
                    next_action_24h: 'blocked',
                    forbidden_phrase: 'blocked',
                    crisis: true,
                    prompt_version: 'v1',
                })
                .select('id')
                .single();

            if (error) {
                console.error('DB insert error:', error);
                return apiError(ERROR_CODES.DB_FAILED, 'DB 저장에 실패했습니다.', 500);
            }

            return apiSuccess({
                id: data.id,
                crisis: true,
                safety_message: SAFETY_MESSAGE.body,
                next_step: SAFETY_MESSAGE.next_step,
            });
        }

        // Call Claude AI
        let aiResult;
        try {
            aiResult = await callClaudeForRx({ situation, emotion, energy });
        } catch (err) {
            console.error('AI call error:', err);
            return apiError(ERROR_CODES.AI_FAILED, 'AI 처리 중 오류가 발생했습니다. 다시 시도해주세요.', 502);
        }

        const { data, error } = await adminClient
            .from('mood_rx')
            .insert({
                user_id: userId,
                situation,
                emotion,
                energy,
                core_reason: aiResult.result.core_reason,
                next_action_24h: aiResult.result.next_action_24h,
                forbidden_phrase: aiResult.result.forbidden_phrase,
                crisis: false,
                prompt_version: aiResult.promptVersion,
            })
            .select('id')
            .single();

        if (error) {
            console.error('DB insert error:', error);
            return apiError(ERROR_CODES.DB_FAILED, 'DB 저장에 실패했습니다.', 500);
        }

        return apiSuccess({
            id: data.id,
            crisis: false,
            result: aiResult.result,
            card_image_url: null,
        });

    } catch (err) {
        console.error('Unexpected error:', err);
        return apiError(ERROR_CODES.UNKNOWN, '예상치 못한 오류가 발생했습니다.', 500);
    }
}
