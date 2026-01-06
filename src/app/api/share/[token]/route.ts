// GET /api/share/[token] - Get prescription by share token
import { NextRequest } from 'next/server';
import { apiError, apiSuccess, ERROR_CODES } from '@/lib/utils/errors';
import { isMockMode, getMockRecordByShareToken } from '@/lib/mock/data';

interface RouteParams {
    params: Promise<{ token: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { token } = await params;

        // Mock mode
        if (isMockMode()) {
            const record = getMockRecordByShareToken(token);
            if (!record || record.crisis) {
                return apiError(ERROR_CODES.NOT_FOUND, '공유된 처방전을 찾을 수 없습니다.', 404);
            }
            const { crisis: _crisis, situation: _situation, user_id: _userId, ...safeData } = record;
            return apiSuccess(safeData);
        }

        // Production mode
        const { createAdminClient } = await import('@/lib/supabase/admin');
        const adminClient = createAdminClient();

        const { data, error } = await adminClient
            .from('mood_rx')
            .select('id, emotion, energy, core_reason, next_action_24h, forbidden_phrase, created_at, crisis')
            .eq('share_token', token)
            .single();

        if (error || !data) {
            return apiError(ERROR_CODES.NOT_FOUND, '공유된 처방전을 찾을 수 없습니다.', 404);
        }

        if (data.crisis) {
            return apiError(ERROR_CODES.FORBIDDEN, '이 처방전은 공유할 수 없습니다.', 403);
        }

        const { crisis: _crisis, ...safeData } = data;
        void _crisis;

        return apiSuccess(safeData);

    } catch (err) {
        console.error('Share fetch error:', err);
        return apiError(ERROR_CODES.UNKNOWN, '오류가 발생했습니다.', 500);
    }
}
