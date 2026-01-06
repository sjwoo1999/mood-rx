// POST /api/mood-rx/[id]/share - Generate share token
import { NextRequest } from 'next/server';
import { apiError, apiSuccess, ERROR_CODES } from '@/lib/utils/errors';
import { generateShareToken } from '@/lib/utils/tokens';
import { isMockMode, getMockRecord, setMockShareToken } from '@/lib/mock/data';

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;

        // Mock mode
        if (isMockMode()) {
            const record = getMockRecord(id);
            if (!record) {
                return apiError(ERROR_CODES.NOT_FOUND, '처방전을 찾을 수 없습니다.', 404);
            }
            if (record.crisis) {
                return apiError(ERROR_CODES.FORBIDDEN, '이 처방전은 공유할 수 없습니다.', 403);
            }
            if (record.share_token) {
                return apiSuccess({ share_token: record.share_token });
            }
            const token = generateShareToken();
            setMockShareToken(id, token);
            return apiSuccess({ share_token: token });
        }

        // Production mode
        const { createServerSupabaseClient } = await import('@/lib/supabase/server');
        const supabase = await createServerSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return apiError(ERROR_CODES.UNAUTHORIZED, '로그인이 필요합니다.', 401);
        }

        const { data: existing, error: fetchError } = await supabase
            .from('mood_rx')
            .select('id, share_token, crisis')
            .eq('id', id)
            .eq('user_id', user.id)
            .single();

        if (fetchError || !existing) {
            return apiError(ERROR_CODES.NOT_FOUND, '처방전을 찾을 수 없습니다.', 404);
        }

        if (existing.crisis) {
            return apiError(ERROR_CODES.FORBIDDEN, '이 처방전은 공유할 수 없습니다.', 403);
        }

        if (existing.share_token) {
            return apiSuccess({ share_token: existing.share_token });
        }

        const shareToken = generateShareToken();

        const { error: updateError } = await supabase
            .from('mood_rx')
            .update({ share_token: shareToken })
            .eq('id', id);

        if (updateError) {
            console.error('Update error:', updateError);
            return apiError(ERROR_CODES.DB_FAILED, '공유 링크 생성에 실패했습니다.', 500);
        }

        return apiSuccess({ share_token: shareToken });

    } catch (err) {
        console.error('Share error:', err);
        return apiError(ERROR_CODES.UNKNOWN, '오류가 발생했습니다.', 500);
    }
}
