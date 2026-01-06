// GET /api/og - Generate OG image for prescription card
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { isMockMode, getMockRecord } from '@/lib/mock/data';

export const runtime = 'edge';

const EMOTION_COLORS = {
    anxious: { bg: '#F0F9FF', border: '#2563EB', text: '#2563EB' },
    angry: { bg: '#FFF1F2', border: '#E11D48', text: '#E11D48' },
    sad: { bg: '#EEF2FF', border: '#4F46E5', text: '#4F46E5' },
    tired: { bg: '#FFFBEB', border: '#F59E0B', text: '#F59E0B' },
    confused: { bg: '#F8FAFC', border: '#334155', text: '#334155' },
} as const;

const EMOTION_LABELS = {
    anxious: { ko: '불안', emoji: '😰' },
    angry: { ko: '화남', emoji: '😤' },
    sad: { ko: '슬픔', emoji: '😢' },
    tired: { ko: '지침', emoji: '😮‍💨' },
    confused: { ko: '혼란', emoji: '😵‍💫' },
} as const;

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return new Response('Missing id parameter', { status: 400 });
        }

        let data: { emotion: string; core_reason: string; next_action_24h: string; forbidden_phrase: string; crisis: boolean } | null = null;

        // Mock mode
        if (process.env.NEXT_PUBLIC_MOCK_MODE === 'true') {
            // In edge runtime, we can't directly import the mock data
            // Return a simple mock response
            data = {
                emotion: 'anxious',
                core_reason: '불확실한 미래에 대한 통제력 상실감이 핵심입니다',
                next_action_24h: '오늘 저녁 10분간 심호흡 명상 앱으로 호흡 연습하기',
                forbidden_phrase: '모든 게 잘못될 거야',
                crisis: false,
            };
        } else {
            // Production mode
            const { createAdminClient } = await import('@/lib/supabase/admin');
            const adminClient = createAdminClient();
            const result = await adminClient
                .from('mood_rx')
                .select('emotion, core_reason, next_action_24h, forbidden_phrase, crisis')
                .eq('id', id)
                .single();

            if (result.error || !result.data || result.data.crisis) {
                return new Response('Not found', { status: 404 });
            }
            data = result.data;
        }

        if (!data) {
            return new Response('Not found', { status: 404 });
        }

        const emotion = data.emotion as keyof typeof EMOTION_COLORS;
        const colors = EMOTION_COLORS[emotion] || EMOTION_COLORS.confused;
        const label = EMOTION_LABELS[emotion] || EMOTION_LABELS.confused;

        return new ImageResponse(
            (
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        backgroundColor: '#ffffff',
                        padding: 60,
                    }}
                >
                    {/* Left border */}
                    <div
                        style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: 16,
                            backgroundColor: colors.border,
                        }}
                    />

                    {/* Header */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 16,
                            marginBottom: 40,
                            padding: '20px 24px',
                            backgroundColor: colors.bg,
                            borderRadius: 16,
                        }}
                    >
                        <span style={{ fontSize: 48 }}>{label.emoji}</span>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: 28, fontWeight: 700, color: '#111827' }}>
                                오늘의 처방전
                            </span>
                            <span style={{ fontSize: 20, fontWeight: 600, color: colors.text }}>
                                {label.ko} 상태
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, flex: 1 }}>
                        {/* Core Reason */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <span style={{ fontSize: 18, fontWeight: 600, color: '#6B7280' }}>
                                🎯 핵심 원인
                            </span>
                            <span style={{ fontSize: 24, color: '#111827', lineHeight: 1.4 }}>
                                {data.core_reason}
                            </span>
                        </div>

                        {/* Next Action */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <span style={{ fontSize: 18, fontWeight: 600, color: '#0D9488' }}>
                                💡 24시간 내 행동
                            </span>
                            <span style={{ fontSize: 24, fontWeight: 600, color: '#111827', lineHeight: 1.4 }}>
                                {data.next_action_24h}
                            </span>
                        </div>

                        {/* Forbidden Phrase */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <span style={{ fontSize: 18, fontWeight: 600, color: '#E11D48' }}>
                                🚫 금지 문장
                            </span>
                            <span style={{ fontSize: 20, color: '#6B7280', fontStyle: 'italic', lineHeight: 1.4 }}>
                                {`"${data.forbidden_phrase}"`}
                            </span>
                        </div>
                    </div>

                    {/* Footer */}
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: 40,
                            paddingTop: 20,
                            borderTop: '1px solid #E5E7EB',
                        }}
                    >
                        <span style={{ fontSize: 20, fontWeight: 700, color: '#2563EB' }}>
                            💊 Mood Rx
                        </span>
                        <span style={{ fontSize: 14, color: '#9CA3AF' }}>
                            이 서비스는 의료 서비스가 아닙니다
                        </span>
                    </div>
                </div>
            ),
            {
                width: 1080,
                height: 1350,
            }
        );
    } catch (err) {
        console.error('OG image error:', err);
        return new Response('Failed to generate image', { status: 500 });
    }
}
