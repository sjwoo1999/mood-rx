'use client';

import type { Emotion } from '@/types/domain';
import { EMOTION_LABELS, EMOTION_STYLES } from '@/types/domain';
import { cn } from '@/lib/utils/cn';

export interface EmotionSelectorProps {
    value: Emotion | null;
    onChange: (emotion: Emotion) => void;
}

const EMOTIONS: Emotion[] = ['anxious', 'angry', 'sad', 'tired', 'confused'];

export default function EmotionSelector({ value, onChange }: EmotionSelectorProps) {
    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
                지금 느끼는 감정
            </label>
            <div className="grid grid-cols-5 gap-2">
                {EMOTIONS.map((emotion) => {
                    const label = EMOTION_LABELS[emotion];
                    const style = EMOTION_STYLES[emotion];
                    const isSelected = value === emotion;

                    return (
                        <button
                            key={emotion}
                            type="button"
                            onClick={() => onChange(emotion)}
                            className={cn(
                                'flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all',
                                'hover:scale-105 active:scale-95',
                                isSelected
                                    ? `${style.border} ${style.bg} ${style.text}`
                                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                            )}
                        >
                            <span className="text-2xl">{label.emoji}</span>
                            <span className="text-xs font-medium">{label.ko}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
