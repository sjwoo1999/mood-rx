// GET, DELETE /api/mood-rx/[id]
import { NextRequest } from 'next/server';
import { apiError, apiSuccess, ERROR_CODES } from '@/lib/utils/errors';
import { isMockMode, getMockRecord, deleteMockRecord, MOCK_USER } from '@/lib/mock/data';

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;

        // Mock mode
        if (isMockMode()) {
            const record = getMockRecord(id);
            if (!record) {
                return apiError(ERROR_CODES.NOT_FOUND, '처방전을 찾을 수 없습니다.', 404);
            }
            return apiSuccess(record);
        }

        // Production mode
        const { createServerSupabaseClient } = await import('@/lib/supabase/server');
        const { createAdminClient } = await import('@/lib/supabase/admin');

        const supabase = await createServerSupabaseClient();
        const adminClient = createAdminClient();
        const { data: userData } = await supabase.auth.getUser();

        if (userData.user) {
            const { data, error } = await supabase
                .from('mood_rx')
                .select('*')
                .eq('id', id)
                .single();

            if (error || !data) {
                return apiError(ERROR_CODES.NOT_FOUND, '처방전을 찾을 수 없습니다.', 404);
            }
            return apiSuccess(data);
        }

        const { data, error } = await adminClient
            .from('mood_rx')
            .select('*')
            .eq('id', id)
            .is('user_id', null)
            .single();

        if (error || !data) {
            return apiError(ERROR_CODES.NOT_FOUND, '처방전을 찾을 수 없습니다.', 404);
        }
        return apiSuccess(data);

    } catch (err) {
        console.error('GET error:', err);
        return apiError(ERROR_CODES.UNKNOWN, '오류가 발생했습니다.', 500);
    }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;

        // Mock mode
        if (isMockMode()) {
            const deleted = deleteMockRecord(id);
            if (!deleted) {
                return apiError(ERROR_CODES.NOT_FOUND, '처방전을 찾을 수 없습니다.', 404);
            }
            return apiSuccess({ deleted: true });
        }

        // Production mode
        const { createServerSupabaseClient } = await import('@/lib/supabase/server');
        const supabase = await createServerSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return apiError(ERROR_CODES.UNAUTHORIZED, '로그인이 필요합니다.', 401);
        }

        const { error } = await supabase
            .from('mood_rx')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) {
            console.error('Delete error:', error);
            return apiError(ERROR_CODES.DB_FAILED, '삭제에 실패했습니다.', 500);
        }

        return apiSuccess({ deleted: true });

    } catch (err) {
        console.error('DELETE error:', err);
        return apiError(ERROR_CODES.UNKNOWN, '오류가 발생했습니다.', 500);
    }
}
