'use client';

import type { MoodRxResult, Emotion } from '@/types/domain';
import { EMOTION_LABELS, EMOTION_STYLES } from '@/types/domain';
import { Download, Share2, Target, Lightbulb, Ban } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface RxResultCardProps {
    result: MoodRxResult;
    emotion: Emotion;
    onDownload?: () => void;
    onShare?: () => void;
    isShareLoading?: boolean;
}

export default function RxResultCard({
    result,
    emotion,
    onDownload,
    onShare,
    isShareLoading,
}: RxResultCardProps) {
    const style = EMOTION_STYLES[emotion];
    const label = EMOTION_LABELS[emotion];

    return (
        <div className={cn(
            'rounded-2xl border-l-4 bg-white shadow-lg overflow-hidden',
            style.border
        )}>
            {/* Header */}
            <div className={cn('px-5 py-4', style.bg)}>
                <div className="flex items-center gap-2">
                    <span className="text-2xl">{label.emoji}</span>
                    <div>
                        <h2 className="font-bold text-gray-900">오늘의 처방전</h2>
                        <p className={cn('text-sm font-medium', style.text)}>
                            {label.ko} 상태
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-5 py-5 space-y-5">
                {/* Core Reason */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                        <Target className="w-4 h-4" />
                        <span>핵심 원인</span>
                    </div>
                    <p className="text-gray-900 leading-relaxed pl-6">
                        {result.core_reason}
                    </p>
                </div>

                {/* Next Action */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-brand-secondary">
                        <Lightbulb className="w-4 h-4" />
                        <span>24시간 내 행동</span>
                    </div>
                    <p className="text-gray-900 leading-relaxed pl-6 font-medium">
                        {result.next_action_24h}
                    </p>
                </div>

                {/* Forbidden Phrase */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-rose-500">
                        <Ban className="w-4 h-4" />
                        <span>금지 문장</span>
                    </div>
                    <p className="text-gray-600 leading-relaxed pl-6 italic">
                        {`"${result.forbidden_phrase}"`}
                    </p>
                </div>
            </div>

            {/* Actions */}
            {(onDownload || onShare) && (
                <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex gap-3">
                    {onDownload && (
                        <button
                            onClick={onDownload}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4
                         bg-white border border-gray-200 rounded-xl text-gray-700
                         hover:bg-gray-50 active:scale-[0.98] transition-all text-sm font-medium"
                        >
                            <Download className="w-4 h-4" />
                            <span>이미지 저장</span>
                        </button>
                    )}
                    {onShare && (
                        <button
                            onClick={onShare}
                            disabled={isShareLoading}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4
                         bg-brand-primary text-white rounded-xl
                         hover:bg-blue-700 active:scale-[0.98] transition-all text-sm font-medium
                         disabled:opacity-50"
                        >
                            <Share2 className="w-4 h-4" />
                            <span>{isShareLoading ? '생성 중...' : '공유하기'}</span>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
