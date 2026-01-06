'use client';

import { useState } from 'react';
import { FlaskConical, X, ChevronRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

const isMockMode = () => process.env.NEXT_PUBLIC_MOCK_MODE === 'true';

interface MockModeBannerProps {
    variant?: 'full' | 'compact';
}

export default function MockModeBanner({ variant = 'full' }: MockModeBannerProps) {
    const [dismissed, setDismissed] = useState(false);

    if (!isMockMode() || dismissed) return null;

    if (variant === 'compact') {
        return (
            <div className="bg-amber-50 border-b border-amber-100 px-4 py-2">
                <div className="max-w-2xl mx-auto flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-amber-700">
                        <FlaskConical className="w-4 h-4" />
                        <span>테스트 모드 - 실제 데이터가 저장되지 않습니다</span>
                    </div>
                    <button onClick={() => setDismissed(true)} className="text-amber-500 hover:text-amber-700">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
            <div className="max-w-2xl mx-auto px-4 py-4">
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                        <FlaskConical className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-amber-900">🧪 데모 모드 실행 중</h3>
                            <span className="text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full">
                                MOCK
                            </span>
                        </div>
                        <p className="text-sm text-amber-700 mb-3">
                            DB/AI 연결 없이 앱을 체험할 수 있습니다.
                            미리 준비된 샘플 처방전이 보관함에 있어요!
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <Link
                                href="/vault"
                                className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-700 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                <Sparkles className="w-4 h-4" />
                                <span>샘플 처방전 보기</span>
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                            <Link
                                href="/rx/new"
                                className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-600 hover:text-amber-800 px-3 py-1.5 transition-colors"
                            >
                                <span>직접 만들어보기</span>
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                    <button
                        onClick={() => setDismissed(true)}
                        className="flex-shrink-0 text-amber-400 hover:text-amber-600 transition-colors"
                        aria-label="닫기"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
