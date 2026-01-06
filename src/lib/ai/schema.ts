// Zod schema for AI output validation
import { z } from 'zod';

export const MoodRxResultSchema = z.object({
    core_reason: z.string().min(1).max(80),
    next_action_24h: z.string().min(1).max(80),
    forbidden_phrase: z.string().min(1).max(80),
});

export type MoodRxResultParsed = z.infer<typeof MoodRxResultSchema>;

// Request validation schema
export const CreateMoodRxRequestSchema = z.object({
    situation: z.string().min(10, '상황을 10자 이상 입력해주세요').max(240, '상황은 240자까지 입력 가능합니다'),
    emotion: z.enum(['anxious', 'angry', 'sad', 'tired', 'confused']),
    energy: z.number().int().min(1).max(5),
});

export type CreateMoodRxRequestParsed = z.infer<typeof CreateMoodRxRequestSchema>;
