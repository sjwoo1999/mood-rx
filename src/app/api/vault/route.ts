// GET /api/vault - Get user's prescriptions
import { apiError, apiSuccess, ERROR_CODES } from '@/lib/utils/errors';
import { isMockMode, getMockRecordsByUser, MOCK_USER } from '@/lib/mock/data';

export async function GET() {
    try {
        // Mock mode
        if (isMockMode()) {
            const records = getMockRecordsByUser(MOCK_USER.id);
            return apiSuccess(records);
        }

        // Production mode
        const { createServerSupabaseClient } = await import('@/lib/supabase/server');
        const supabase = await createServerSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return apiError(ERROR_CODES.UNAUTHORIZED, '로그인이 필요합니다.', 401);
        }

        const { data, error } = await supabase
            .from('mood_rx')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Vault fetch error:', error);
            return apiError(ERROR_CODES.DB_FAILED, '보관함을 불러올 수 없습니다.', 500);
        }

        return apiSuccess(data || []);

    } catch (err) {
        console.error('Vault error:', err);
        return apiError(ERROR_CODES.UNKNOWN, '오류가 발생했습니다.', 500);
    }
}
