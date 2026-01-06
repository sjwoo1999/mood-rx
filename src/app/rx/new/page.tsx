'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RxInputForm from '@/components/rx/RxInputForm';
import type { Emotion, EnergyLevel } from '@/types/domain';

export default function NewRxPage() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (values: {
        situation: string;
        emotion: Emotion;
        energy: EnergyLevel
    }) => {
        setIsLoading(true);

        try {
            const response = await fetch('/api/mood-rx', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            const data = await response.json();

            if (!response.ok || !data.ok) {
                throw new Error(data.error?.message || '처방 생성에 실패했습니다.');
            }

            // Navigate to result page
            router.push(`/rx/result/${data.data.id}`);
        } catch (error) {
            setIsLoading(false);
            throw error;
        }
    };

    return (
        <div className="max-w-lg mx-auto px-4 py-8">
            <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    새 처방전 받기
                </h1>
                <p className="text-gray-600">
                    지금 상황과 감정을 알려주세요
                </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <RxInputForm onSubmit={handleSubmit} isLoading={isLoading} />
            </div>

            <p className="mt-6 text-center text-xs text-gray-400">
                입력한 내용은 AI 분석에만 사용되며, 민감한 정보는 입력하지 마세요.
            </p>
        </div>
    );
}
