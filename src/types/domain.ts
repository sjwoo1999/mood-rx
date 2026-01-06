// Domain Types for Mood Rx

export type Emotion = 'anxious' | 'angry' | 'sad' | 'tired' | 'confused';

export type EnergyLevel = 1 | 2 | 3 | 4 | 5;

export interface CreateMoodRxRequest {
    situation: string;
    emotion: Emotion;
    energy: EnergyLevel;
}

export interface MoodRxResult {
    core_reason: string;
    next_action_24h: string;
    forbidden_phrase: string;
}

export interface MoodRxRecord {
    id: string;
    user_id: string | null;
    situation: string;
    emotion: Emotion;
    energy: EnergyLevel;
    core_reason: string;
    next_action_24h: string;
    forbidden_phrase: string;
    crisis: boolean;
    prompt_version: string;
    card_image_path: string | null;
    share_token: string | null;
    created_at: string;
}

export interface CreateMoodRxResponse {
    id: string;
    crisis: boolean;
    result?: MoodRxResult;
    safety_message?: string;
    next_step?: string;
    card_image_url?: string | null;
}

// API Response types
export type ApiOk<T> = { ok: true; data: T };
export type ApiErr = { ok: false; error: { code: string; message: string } };
export type ApiResponse<T> = ApiOk<T> | ApiErr;

// Emotion display info
export const EMOTION_LABELS: Record<Emotion, { ko: string; emoji: string }> = {
    anxious: { ko: '불안', emoji: '😰' },
    angry: { ko: '화남', emoji: '😤' },
    sad: { ko: '슬픔', emoji: '😢' },
    tired: { ko: '지침', emoji: '😮‍💨' },
    confused: { ko: '혼란', emoji: '😵‍💫' },
};

export const EMOTION_STYLES: Record<Emotion, { border: string; bg: string; text: string }> = {
    anxious: { border: 'border-blue-600', bg: 'bg-sky-50', text: 'text-blue-600' },
    angry: { border: 'border-rose-600', bg: 'bg-rose-50', text: 'text-rose-600' },
    sad: { border: 'border-indigo-600', bg: 'bg-indigo-50', text: 'text-indigo-600' },
    tired: { border: 'border-amber-500', bg: 'bg-amber-50', text: 'text-amber-500' },
    confused: { border: 'border-slate-700', bg: 'bg-slate-50', text: 'text-slate-700' },
};
