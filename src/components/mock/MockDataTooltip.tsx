'use client';

import { useState } from 'react';
import { Info, X } from 'lucide-react';

const isMockMode = () => process.env.NEXT_PUBLIC_MOCK_MODE === 'true';

interface MockDataTooltipProps {
    children: React.ReactNode;
    message?: string;
}

export default function MockDataTooltip({ children, message }: MockDataTooltipProps) {
    const [showTooltip, setShowTooltip] = useState(true);

    if (!isMockMode()) return <>{children}</>;

    return (
        <div className="relative">
            {children}
            {showTooltip && (
                <div className="absolute -top-1 -right-1 z-10">
                    <div className="relative group">
                        <button
                            onClick={() => setShowTooltip(false)}
                            className="w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center shadow-sm animate-pulse hover:animate-none"
                        >
                            <Info className="w-3 h-3 text-white" />
                        </button>
                        <div className="absolute right-0 top-7 w-48 p-2 bg-amber-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-lg">
                            <div className="flex items-start gap-1.5">
                                <span>{message || '이것은 샘플 데이터입니다'}</span>
                                <button onClick={() => setShowTooltip(false)} className="flex-shrink-0">
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                            <div className="absolute -top-1 right-2 w-2 h-2 bg-amber-900 rotate-45" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
