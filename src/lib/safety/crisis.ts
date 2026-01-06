// Crisis detection module
// This MUST be called BEFORE any AI invocation

const CRISIS_KEYWORDS = [
    '자살',
    '자해',
    '죽고 싶',
    '죽고싶',
    '극단적 선택',
    '유서',
    '목숨',
    '사라지고 싶',
    '사라지고싶',
    '손목',
    '투신',
    '끝내고 싶',
    '끝내고싶',
    '살기 싫',
    '살기싫',
] as const;

/**
 * Detect crisis keywords in user input
 * Must be called BEFORE making any AI API calls
 * @param text - The user's input text
 * @returns true if crisis keywords are detected
 */
export function detectCrisis(text: string): boolean {
    if (!text) return false;

    const normalized = text.toLowerCase().trim();
    return CRISIS_KEYWORDS.some(keyword => normalized.includes(keyword.toLowerCase()));
}

/**
 * Get the list of crisis keywords (for testing purposes)
 */
export function getCrisisKeywords(): readonly string[] {
    return CRISIS_KEYWORDS;
}
