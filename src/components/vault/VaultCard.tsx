'use client';

import type { Emotion } from '@/types/domain';
import { EMOTION_LABELS, EMOTION_STYLES } from '@/types/domain';
import { cn } from '@/lib/utils/cn';
import { Trash2 } from 'lucide-react';
import Link from 'next/link';

export interface VaultCardProps {
    rx: {
        id: string;
        emotion: Emotion;
        created_at: string;
        core_reason: string;
        card_image_url?: string | null;
    };
    onDelete: (id: string) => Promise<void>;
}

export default function VaultCard({ rx, onDelete }: VaultCardProps) {
    const style = EMOTION_STYLES[rx.emotion];
    const label = EMOTION_LABELS[rx.emotion];

    const date = new Date(rx.created_at);
    const formattedDate = date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (confirm('이 처방전을 삭제하시겠습니까?')) {
            await onDelete(rx.id);
        }
    };

    return (
        <Link
            href={`/rx/result/${rx.id}`}
            className={cn(
                'block rounded-xl border-l-4 bg-white shadow-sm overflow-hidden',
                'hover:shadow-md transition-shadow',
                style.border
            )}
        >
            <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xl flex-shrink-0">{label.emoji}</span>
                        <div className="min-w-0">
                            <p className={cn('text-sm font-medium', style.text)}>
                                {label.ko}
                            </p>
                            <p className="text-xs text-gray-400">
                                {formattedDate}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleDelete}
                        className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 
                       rounded-lg transition-colors flex-shrink-0"
                        aria-label="삭제"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>

                <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                    {rx.core_reason}
                </p>
            </div>
        </Link>
    );
}
