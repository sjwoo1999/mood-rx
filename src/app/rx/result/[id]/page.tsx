'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import RxResultCard from '@/components/rx/RxResultCard';
import SafetyMessage from '@/components/rx/SafetyMessage';
import type { MoodRxRecord } from '@/types/domain';
import { Loader2, ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';

export default function ResultPage() {
    const params = useParams();
    const id = params.id as string;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<MoodRxRecord | null>(null);
    const [isCrisis, setIsCrisis] = useState(false);
    const [safetyMessage, setSafetyMessage] = useState<{ title: string; body: string; next_step: string } | null>(null);
    const [shareLoading, setShareLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/mood-rx/${id}`);
                const json = await res.json();

                if (!res.ok || !json.ok) {
                    throw new Error(json.error?.message || '데이터를 불러올 수 없습니다.');
                }

                setData(json.data);
                setIsCrisis(json.data.crisis);

                if (json.data.crisis) {
                    setSafetyMessage({
                        title: '긴급한 안전 안내',
                        body: '지금은 처방을 생성하지 않습니다. 즉시 주변의 도움을 요청하거나, 지역의 긴급 도움 서비스를 이용하세요.',
                        next_step: '가까운 사람에게 연락하거나, 긴급 지원 기관에 연결해보세요.',
                    });
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleDownload = async () => {
        // Open OG image in new tab for download
        const url = `/api/og?id=${id}`;
        window.open(url, '_blank');
    };

    const handleShare = async () => {
        if (!data) return;

        setShareLoading(true);
        try {
            const res = await fetch(`/api/mood-rx/${id}/share`, {
                method: 'POST',
            });
            const json = await res.json();

            if (!res.ok || !json.ok) {
                throw new Error(json.error?.message || '공유 링크 생성에 실패했습니다.');
            }

            const shareUrl = `${window.location.origin}/share/${json.data.share_token}`;

            if (navigator.share) {
                await navigator.share({
                    title: 'Mood Rx - 감정 처방전',
                    text: '나의 감정 처방전을 확인해보세요',
                    url: shareUrl,
                });
            } else {
                await navigator.clipboard.writeText(shareUrl);
                alert('공유 링크가 클립보드에 복사되었습니다!');
            }
        } catch (err) {
            if (err instanceof Error && err.name !== 'AbortError') {
                alert(err.message);
            }
        } finally {
            setShareLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
                    <p className="text-gray-500">처방전을 불러오는 중...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-lg mx-auto px-4 py-8">
                <div className="text-center py-12">
                    <p className="text-rose-500 mb-4">{error}</p>
                    <Link
                        href="/rx/new"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg"
                    >
                        <Plus className="w-4 h-4" />
                        새 처방전 받기
                    </Link>
                </div>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="max-w-lg mx-auto px-4 py-8">
            {/* Back link */}
            <Link
                href="/rx/new"
                className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                <span>새 처방전 받기</span>
            </Link>

            {isCrisis && safetyMessage ? (
                <SafetyMessage {...safetyMessage} />
            ) : (
                <RxResultCard
                    result={{
                        core_reason: data.core_reason,
                        next_action_24h: data.next_action_24h,
                        forbidden_phrase: data.forbidden_phrase,
                    }}
                    emotion={data.emotion}
                    onDownload={handleDownload}
                    onShare={handleShare}
                    isShareLoading={shareLoading}
                />
            )}

            {/* New Rx CTA */}
            <div className="mt-6 text-center">
                <Link
                    href="/rx/new"
                    className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-primary"
                >
                    <Plus className="w-4 h-4" />
                    <span>새 처방전 받기</span>
                </Link>
            </div>
        </div>
    );
}
