// Unit tests for validation schemas
import { describe, it, expect } from 'vitest';
import { CreateMoodRxRequestSchema, MoodRxResultSchema } from '@/lib/ai/schema';

describe('CreateMoodRxRequestSchema', () => {
    it('should validate correct input', () => {
        const validInput = {
            situation: '오늘 회사에서 상사에게 혼났어요',
            emotion: 'sad',
            energy: 3,
        };

        const result = CreateMoodRxRequestSchema.safeParse(validInput);
        expect(result.success).toBe(true);
    });

    it('should reject short situation', () => {
        const invalidInput = {
            situation: '짧은',
            emotion: 'sad',
            energy: 3,
        };

        const result = CreateMoodRxRequestSchema.safeParse(invalidInput);
        expect(result.success).toBe(false);
    });

    it('should reject long situation', () => {
        const invalidInput = {
            situation: 'a'.repeat(250),
            emotion: 'sad',
            energy: 3,
        };

        const result = CreateMoodRxRequestSchema.safeParse(invalidInput);
        expect(result.success).toBe(false);
    });

    it('should reject invalid emotion', () => {
        const invalidInput = {
            situation: '오늘 회사에서 상사에게 혼났어요',
            emotion: 'happy',
            energy: 3,
        };

        const result = CreateMoodRxRequestSchema.safeParse(invalidInput);
        expect(result.success).toBe(false);
    });

    it('should validate all valid emotions', () => {
        const emotions = ['anxious', 'angry', 'sad', 'tired', 'confused'];

        emotions.forEach(emotion => {
            const result = CreateMoodRxRequestSchema.safeParse({
                situation: '오늘 회사에서 상사에게 혼났어요',
                emotion,
                energy: 3,
            });
            expect(result.success).toBe(true);
        });
    });

    it('should reject invalid energy level', () => {
        const invalidInput = {
            situation: '오늘 회사에서 상사에게 혼났어요',
            emotion: 'sad',
            energy: 6,
        };

        const result = CreateMoodRxRequestSchema.safeParse(invalidInput);
        expect(result.success).toBe(false);
    });

    it('should validate all valid energy levels', () => {
        [1, 2, 3, 4, 5].forEach(energy => {
            const result = CreateMoodRxRequestSchema.safeParse({
                situation: '오늘 회사에서 상사에게 혼났어요',
                emotion: 'sad',
                energy,
            });
            expect(result.success).toBe(true);
        });
    });
});

describe('MoodRxResultSchema', () => {
    it('should validate correct AI output', () => {
        const validOutput = {
            core_reason: '상사의 갑작스러운 비판이 자존감을 건드렸습니다',
            next_action_24h: '오늘 저녁 30분간 산책하며 감정 정리하기',
            forbidden_phrase: '나는 무능해',
        };

        const result = MoodRxResultSchema.safeParse(validOutput);
        expect(result.success).toBe(true);
    });

    it('should reject empty fields', () => {
        const invalidOutput = {
            core_reason: '',
            next_action_24h: '오늘 저녁 30분간 산책하기',
            forbidden_phrase: '나는 무능해',
        };

        const result = MoodRxResultSchema.safeParse(invalidOutput);
        expect(result.success).toBe(false);
    });

    it('should reject too long fields', () => {
        const invalidOutput = {
            core_reason: 'a'.repeat(100),
            next_action_24h: '오늘 저녁 30분간 산책하기',
            forbidden_phrase: '나는 무능해',
        };

        const result = MoodRxResultSchema.safeParse(invalidOutput);
        expect(result.success).toBe(false);
    });

    it('should reject missing fields', () => {
        const invalidOutput = {
            core_reason: '상사의 갑작스러운 비판',
            next_action_24h: '오늘 저녁 30분간 산책하기',
        };

        const result = MoodRxResultSchema.safeParse(invalidOutput);
        expect(result.success).toBe(false);
    });
});
