'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import VaultCard from '@/components/vault/VaultCard';
import type { MoodRxRecord } from '@/types/domain';
import { Loader2, Archive, Plus, FlaskConical } from 'lucide-react';
import Link from 'next/link';

const isMockMode = () => process.env.NEXT_PUBLIC_MOCK_MODE === 'true';

export default function VaultPage() {
    const [loading, setLoading] = useState(true);
    const [records, setRecords] = useState<MoodRxRecord[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkAuthAndFetch = async () => {
            // Mock mode - always authenticated
            if (isMockMode()) {
                setIsAuthenticated(true);
                try {
                    const res = await fetch('/api/vault');
                    const json = await res.json();
                    if (json.ok) {
                        setRecords(json.data);
                    }
                } catch (err) {
                    setError('보관함을 불러올 수 없습니다.');
                } finally {
                    setLoading(false);
                }
                return;
            }

            // Production mode
            const { createClient } = await import('@/lib/supabase/client');
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push('/login?redirect=/vault');
                return;
            }

            setIsAuthenticated(true);

            try {
                const res = await fetch('/api/vault');
                const json = await res.json();

                if (!res.ok || !json.ok) {
                    throw new Error(json.error?.message || '보관함을 불러올 수 없습니다.');
                }

                setRecords(json.data);
            } catch (err) {
                setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        checkAuthAndFetch();
    }, [router]);

    const handleDelete = useCallback(async (id: string) => {
        try {
            const res = await fetch(`/api/mood-rx/${id}`, {
                method: 'DELETE',
            });
            const json = await res.json();

            if (!res.ok || !json.ok) {
                throw new Error(json.error?.message || '삭제에 실패했습니다.');
            }

            setRecords((prev) => prev.filter((r) => r.id !== id));
        } catch (err) {
            alert(err instanceof Error ? err.message : '삭제에 실패했습니다.');
        }
    }, []);

    if (!isAuthenticated || loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
                    <p className="text-gray-500">로딩 중...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-lg mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Archive className="w-6 h-6 text-brand-primary" />
                    <h1 className="text-xl font-bold text-gray-900">보관함</h1>
                </div>
                <Link
                    href="/rx/new"
                    className="flex items-center gap-1 px-3 py-1.5 bg-brand-primary text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                >
                    <Plus className="w-4 h-4" />
                    <span>새 처방전</span>
                </Link>
            </div>

            {error && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 mb-6">
                    {error}
                </div>
            )}

            {/* Mock mode sample data notice */}
            {isMockMode() && records.length > 0 && (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-100 rounded-xl">
                    <div className="flex items-start gap-3">
                        <FlaskConical className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-amber-800">
                                📋 샘플 처방전 {records.length}개
                            </p>
                            <p className="text-xs text-amber-600 mt-1">
                                이것은 데모용 샘플 데이터입니다. 서버 재시작 시 초기화됩니다.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {records.length === 0 ? (
                <div className="text-center py-16">
                    <Archive className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">아직 저장된 처방전이 없습니다</p>
                    <Link
                        href="/rx/new"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg"
                    >
                        <Plus className="w-4 h-4" />
                        첫 처방전 받기
                    </Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {records.map((rx) => (
                        <VaultCard key={rx.id} rx={rx} onDelete={handleDelete} />
                    ))}
                </div>
            )}
        </div>
    );
}
