// Claude API wrapper
import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPT, buildUserPrompt, PROMPT_VERSION } from './prompt';
import { MoodRxResultSchema, type MoodRxResultParsed } from './schema';
import type { Emotion, EnergyLevel } from '@/types/domain';

const anthropic = new Anthropic({
    apiKey: process.env.CLAUDE_API_KEY,
});

const MODEL = process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514';
const TIMEOUT_MS = 15000;

export interface CallClaudeParams {
    situation: string;
    emotion: Emotion;
    energy: EnergyLevel;
}

export interface CallClaudeResult {
    result: MoodRxResultParsed;
    promptVersion: string;
}

/**
 * Call Claude API to generate mood prescription
 * Crisis detection should be done BEFORE calling this function
 */
export async function callClaudeForRx(params: CallClaudeParams): Promise<CallClaudeResult> {
    const { situation, emotion, energy } = params;
    const userPrompt = buildUserPrompt(situation, emotion, energy);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
        const response = await anthropic.messages.create({
            model: MODEL,
            max_tokens: 256,
            system: SYSTEM_PROMPT,
            messages: [
                { role: 'user', content: userPrompt },
            ],
        });

        clearTimeout(timeoutId);

        // Extract text content
        const textContent = response.content.find(c => c.type === 'text');
        if (!textContent || textContent.type !== 'text') {
            throw new Error('No text response from Claude');
        }

        const rawText = textContent.text.trim();

        // Check for crisis signal from AI
        if (rawText === 'CRISIS') {
            throw new Error('AI detected crisis signal');
        }

        // Parse JSON response
        let parsed: unknown;
        try {
            // Handle potential markdown code blocks
            const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, rawText];
            parsed = JSON.parse(jsonMatch[1] || rawText);
        } catch {
            // Retry with stricter prompt
            const retryResponse = await anthropic.messages.create({
                model: MODEL,
                max_tokens: 256,
                system: SYSTEM_PROMPT + '\n\n중요: 반드시 순수 JSON만 출력하라. 다른 텍스트 없이.',
                messages: [
                    { role: 'user', content: userPrompt },
                ],
            });

            const retryContent = retryResponse.content.find(c => c.type === 'text');
            if (!retryContent || retryContent.type !== 'text') {
                throw new Error('No text response from Claude on retry');
            }

            const retryText = retryContent.text.trim();
            const retryMatch = retryText.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, retryText];
            parsed = JSON.parse(retryMatch[1] || retryText);
        }

        // Validate with Zod
        const result = MoodRxResultSchema.parse(parsed);

        return {
            result,
            promptVersion: PROMPT_VERSION,
        };
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}
