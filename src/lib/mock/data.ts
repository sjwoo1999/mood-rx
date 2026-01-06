// Mock data store for testing without Supabase
import type { MoodRxRecord, Emotion, EnergyLevel } from '@/types/domain';
import { nanoid } from 'nanoid';

// In-memory storage
const mockRecords: Map<string, MoodRxRecord> = new Map();

// Mock AI responses based on emotion
const MOCK_AI_RESPONSES: Record<Emotion, { core_reason: string; next_action_24h: string; forbidden_phrase: string }> = {
    anxious: {
        core_reason: '불확실한 미래에 대한 통제력 상실감이 핵심입니다',
        next_action_24h: '오늘 저녁 10분간 심호흡 명상 앱으로 호흡 연습하기',
        forbidden_phrase: '모든 게 잘못될 거야',
    },
    angry: {
        core_reason: '기대와 현실의 간극에서 오는 좌절감입니다',
        next_action_24h: '점심시간에 15분 빠르게 걷기로 에너지 발산하기',
        forbidden_phrase: '저 사람 때문에 다 망했어',
    },
    sad: {
        core_reason: '중요한 것을 잃었거나 잃을 것 같다는 상실감입니다',
        next_action_24h: '오늘 밤 좋아하는 노래 3곡 들으며 감정 허용하기',
        forbidden_phrase: '나는 항상 혼자야',
    },
    tired: {
        core_reason: '에너지 소모 대비 회복이 부족한 상태입니다',
        next_action_24h: '오늘은 평소보다 1시간 일찍 잠자리에 들기',
        forbidden_phrase: '쉬면 안 돼, 더 해야 해',
    },
    confused: {
        core_reason: '선택지가 많거나 정보가 부족해 방향을 잡기 어렵습니다',
        next_action_24h: '내일 아침 10분간 종이에 생각 3가지만 적어보기',
        forbidden_phrase: '어차피 뭘 해도 모르겠어',
    },
};

export function isMockMode(): boolean {
    return process.env.NEXT_PUBLIC_MOCK_MODE === 'true';
}

export function getMockAIResponse(emotion: Emotion) {
    return MOCK_AI_RESPONSES[emotion];
}

export function createMockRecord(
    data: {
        situation: string;
        emotion: Emotion;
        energy: EnergyLevel;
        crisis: boolean;
    },
    userId: string | null = null
): MoodRxRecord {
    const aiResponse = data.crisis
        ? { core_reason: 'blocked', next_action_24h: 'blocked', forbidden_phrase: 'blocked' }
        : getMockAIResponse(data.emotion);

    const record: MoodRxRecord = {
        id: nanoid(12),
        user_id: userId,
        situation: data.situation,
        emotion: data.emotion,
        energy: data.energy,
        core_reason: aiResponse.core_reason,
        next_action_24h: aiResponse.next_action_24h,
        forbidden_phrase: aiResponse.forbidden_phrase,
        crisis: data.crisis,
        prompt_version: 'mock-v1',
        card_image_path: null,
        share_token: null,
        created_at: new Date().toISOString(),
    };

    mockRecords.set(record.id, record);
    return record;
}

export function getMockRecord(id: string): MoodRxRecord | null {
    return mockRecords.get(id) || null;
}

export function deleteMockRecord(id: string): boolean {
    return mockRecords.delete(id);
}

export function getMockRecordsByUser(userId: string): MoodRxRecord[] {
    return Array.from(mockRecords.values())
        .filter(r => r.user_id === userId)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function getMockRecordByShareToken(token: string): MoodRxRecord | null {
    return Array.from(mockRecords.values()).find(r => r.share_token === token) || null;
}

export function setMockShareToken(id: string, token: string): boolean {
    const record = mockRecords.get(id);
    if (record) {
        record.share_token = token;
        mockRecords.set(id, record);
        return true;
    }
    return false;
}

// Mock user for testing
export const MOCK_USER = {
    id: 'mock-user-001',
    email: 'test@example.com',
};

// Initialize with sample data
export function initMockData() {
    if (mockRecords.size === 0) {
        // Add some sample records for the mock user
        createMockRecord({
            situation: '오늘 발표가 있는데 너무 긴장돼요',
            emotion: 'anxious',
            energy: 2,
            crisis: false,
        }, MOCK_USER.id);

        createMockRecord({
            situation: '친구와 다퉜어요. 마음이 무거워요.',
            emotion: 'sad',
            energy: 3,
            crisis: false,
        }, MOCK_USER.id);
    }
}

// Auto-init on import
if (typeof window === 'undefined') {
    initMockData();
}
