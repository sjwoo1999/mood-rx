import { createServerSupabaseClient } from '@/lib/supabase/server';
import RxResultCard from '@/components/rx/RxResultCard';
import { EMOTION_LABELS } from '@/types/domain';
import type { MoodRxRecord } from '@/types/domain';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface SharePageProps {
    params: Promise<{ token: string }>;
}

export default async function SharePage({ params }: SharePageProps) {
    const { token } = await params;
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
        .from('mood_rx')
        .select('*')
        .eq('share_token', token)
        .single();

    if (error || !data || data.crisis) {
        notFound();
    }

    const rx = data as MoodRxRecord;
    const label = EMOTION_LABELS[rx.emotion];

    return (
        <div className="max-w-lg mx-auto px-4 py-8">
            {/* Header */}
            <div className="text-center mb-6">
                <p className="text-sm text-gray-500 mb-1">공유된 처방전</p>
                <h1 className="text-xl font-bold text-gray-900">
                    {label.emoji} {label.ko} 상태의 처방전
                </h1>
            </div>

            {/* Result Card */}
            <RxResultCard
                result={{
                    core_reason: rx.core_reason,
                    next_action_24h: rx.next_action_24h,
                    forbidden_phrase: rx.forbidden_phrase,
                }}
                emotion={rx.emotion}
            />

            {/* CTA */}
            <div className="mt-8 text-center">
                <p className="text-sm text-gray-500 mb-3">
                    나도 감정 처방전을 받아볼까요?
                </p>
                <Link
                    href="/rx/new"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-white 
                   font-medium rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all"
                >
                    <span>처방전 받기</span>
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
