'use client';

import type { EnergyLevel as EnergyLevelType } from '@/types/domain';
import { cn } from '@/lib/utils/cn';
import { Battery, BatteryLow, BatteryMedium, BatteryFull, BatteryWarning } from 'lucide-react';

export interface EnergyLevelProps {
    value: EnergyLevelType | null;
    onChange: (level: EnergyLevelType) => void;
}

const ENERGY_LEVELS: { level: EnergyLevelType; label: string; icon: typeof Battery }[] = [
    { level: 1, label: '바닥', icon: BatteryWarning },
    { level: 2, label: '낮음', icon: BatteryLow },
    { level: 3, label: '보통', icon: BatteryMedium },
    { level: 4, label: '좋음', icon: BatteryMedium },
    { level: 5, label: '충만', icon: BatteryFull },
];

export default function EnergyLevel({ value, onChange }: EnergyLevelProps) {
    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
                현재 에너지 레벨
            </label>
            <div className="flex gap-2">
                {ENERGY_LEVELS.map(({ level, label, icon: Icon }) => {
                    const isSelected = value === level;

                    return (
                        <button
                            key={level}
                            type="button"
                            onClick={() => onChange(level)}
                            className={cn(
                                'flex-1 flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all',
                                'hover:scale-105 active:scale-95',
                                isSelected
                                    ? 'border-brand-secondary bg-teal-50 text-brand-secondary'
                                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                            )}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="text-xs font-medium">{label}</span>
                            <span className="text-xs text-gray-400">{level}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
