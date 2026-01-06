// Prompt templates for Claude AI
import type { Emotion, EnergyLevel } from '@/types/domain';

export const SYSTEM_PROMPT = `너는 사용자의 감정을 '정리'하고 '24시간 안에 실행 가능한 행동 1개'로 전환하는 코치다.
의료/진단/치료/상담을 하지 마라.
출력은 반드시 JSON만 반환한다. 다른 텍스트를 포함하지 마라.

규칙:
- core_reason: 핵심 원인 1문장 (최대 60자)
- next_action_24h: 24시간 내 가능한 구체적 행동 1개 (최대 60자, 시간/횟수/장소 중 하나 포함)
- forbidden_phrase: 하지 말아야 할 문장 1개 (최대 60자)
- 추상적 위로 금지: "힘내", "괜찮아질거야" 등 금지
- 유해/위기 신호가 보이면 JSON 대신 응답하지 말고, "CRISIS"만 출력하라.`;

const EMOTION_KO: Record<Emotion, string> = {
    anxious: '불안',
    angry: '화남',
    sad: '슬픔',
    tired: '지침',
    confused: '혼란',
};

export function buildUserPrompt(
    situation: string,
    emotion: Emotion,
    energy: EnergyLevel
): string {
    return `상황(3줄):
${situation}

감정:
${EMOTION_KO[emotion]}

에너지(1~5):
${energy}`;
}

export const PROMPT_VERSION = 'v1';
