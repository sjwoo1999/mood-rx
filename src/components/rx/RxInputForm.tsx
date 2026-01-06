'use client';

import { useState } from 'react';
import type { Emotion, EnergyLevel as EnergyLevelType } from '@/types/domain';
import EmotionSelector from './EmotionSelector';
import EnergyLevel from './EnergyLevel';
import { Loader2 } from 'lucide-react';

export interface RxInputFormProps {
    onSubmit: (values: { situation: string; emotion: Emotion; energy: EnergyLevelType }) => Promise<void>;
    isLoading: boolean;
}

export default function RxInputForm({ onSubmit, isLoading }: RxInputFormProps) {
    const [situation, setSituation] = useState('');
    const [emotion, setEmotion] = useState<Emotion | null>(null);
    const [energy, setEnergy] = useState<EnergyLevelType | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validation
        if (!situation || situation.length < 10) {
            setError('상황을 10자 이상 입력해주세요.');
            return;
        }
        if (situation.length > 240) {
            setError('상황은 240자까지 입력 가능합니다.');
            return;
        }
        if (!emotion) {
            setError('감정을 선택해주세요.');
            return;
        }
        if (!energy) {
            setError('에너지 레벨을 선택해주세요.');
            return;
        }

        try {
            await onSubmit({ situation, emotion, energy });
        } catch (err) {
            setError(err instanceof Error ? err.message : '오류가 발생했습니다. 다시 시도해주세요.');
        }
    };

    const charCount = situation.length;
    const isValid = situation.length >= 10 && situation.length <= 240 && emotion && energy;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Situation Input */}
            <div className="space-y-2">
                <label htmlFor="situation" className="block text-sm font-medium text-gray-700">
                    지금 어떤 상황인가요?
                </label>
                <textarea
                    id="situation"
                    value={situation}
                    onChange={(e) => setSituation(e.target.value)}
                    placeholder="오늘 있었던 일, 지금 느끼는 감정의 원인 등을 자유롭게 적어주세요..."
                    className="w-full h-32 px-4 py-3 border-2 border-gray-200 rounded-xl resize-none
                     focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20
                     placeholder:text-gray-400"
                    maxLength={240}
                    disabled={isLoading}
                />
                <div className="flex justify-between text-xs">
                    <span className={charCount < 10 ? 'text-amber-500' : 'text-gray-400'}>
                        {charCount < 10 ? `최소 ${10 - charCount}자 더 입력해주세요` : ''}
                    </span>
                    <span className={charCount > 220 ? 'text-amber-500' : 'text-gray-400'}>
                        {charCount}/240
                    </span>
                </div>
            </div>

            {/* Emotion Selector */}
            <EmotionSelector value={emotion} onChange={setEmotion} />

            {/* Energy Level */}
            <EnergyLevel value={energy} onChange={setEnergy} />

            {/* Error Message */}
            {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm">
                    {error}
                </div>
            )}

            {/* Submit Button */}
            <button
                type="submit"
                disabled={!isValid || isLoading}
                className="w-full py-4 bg-brand-primary text-white font-medium rounded-xl
                   disabled:opacity-50 disabled:cursor-not-allowed
                   hover:bg-blue-700 active:scale-[0.98] transition-all
                   flex items-center justify-center gap-2"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>처방 생성 중...</span>
                    </>
                ) : (
                    <span>처방전 받기</span>
                )}
            </button>
        </form>
    );
}
