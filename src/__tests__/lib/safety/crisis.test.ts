// Unit tests for crisis detection
import { describe, it, expect } from 'vitest';
import { detectCrisis, getCrisisKeywords } from '@/lib/safety/crisis';

describe('detectCrisis', () => {
    it('should return false for empty input', () => {
        expect(detectCrisis('')).toBe(false);
        expect(detectCrisis(null as unknown as string)).toBe(false);
    });

    it('should return false for normal text', () => {
        expect(detectCrisis('오늘 회사에서 스트레스 받았어요')).toBe(false);
        expect(detectCrisis('친구와 다퉜어요')).toBe(false);
        expect(detectCrisis('시험 결과가 안 좋았어요')).toBe(false);
    });

    it('should detect 자살 keyword', () => {
        expect(detectCrisis('자살하고 싶어요')).toBe(true);
        expect(detectCrisis('자살 생각이 나요')).toBe(true);
    });

    it('should detect 자해 keyword', () => {
        expect(detectCrisis('자해하고 싶어요')).toBe(true);
    });

    it('should detect 죽고 싶 variations', () => {
        expect(detectCrisis('죽고 싶어요')).toBe(true);
        expect(detectCrisis('죽고싶어')).toBe(true);
    });

    it('should detect 극단적 선택 keyword', () => {
        expect(detectCrisis('극단적 선택을 하고 싶어요')).toBe(true);
    });

    it('should detect 사라지고 싶 variations', () => {
        expect(detectCrisis('사라지고 싶어요')).toBe(true);
        expect(detectCrisis('사라지고싶어')).toBe(true);
    });

    it('should detect other crisis keywords', () => {
        expect(detectCrisis('유서를 쓰려고 해요')).toBe(true);
        expect(detectCrisis('목숨을 끊고 싶어요')).toBe(true);
        expect(detectCrisis('손목을 그었어요')).toBe(true);
        expect(detectCrisis('투신하고 싶어요')).toBe(true);
    });

    it('should be case insensitive', () => {
        expect(detectCrisis('自殺하고 싶어요')).toBe(false); // Different chars
        expect(detectCrisis('CRISIS')).toBe(false); // English
    });

    it('should detect keywords within longer text', () => {
        expect(detectCrisis('요즘 너무 힘들어서 죽고 싶어요 정말')).toBe(true);
        expect(detectCrisis('회사 일이 너무 힘들어서 사라지고 싶어요')).toBe(true);
    });
});

describe('getCrisisKeywords', () => {
    it('should return readonly array of keywords', () => {
        const keywords = getCrisisKeywords();
        expect(Array.isArray(keywords)).toBe(true);
        expect(keywords.length).toBeGreaterThan(0);
        expect(keywords).toContain('자살');
        expect(keywords).toContain('자해');
    });
});
