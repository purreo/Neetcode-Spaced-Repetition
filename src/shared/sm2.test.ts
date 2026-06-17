import { expect, test, describe } from 'vitest';
import { calculateNextReview, INITIAL_EASE } from './sm2';

describe('SM2 Algorithm', () => {
  test('First review - Good', () => {
    const state = calculateNextReview('good');
    expect(state.repetitions).toBe(1);
    expect(state.interval).toBe(1);
    expect(state.ease).toBeGreaterThanOrEqual(INITIAL_EASE);
  });

  test('Second review - Good', () => {
    const state = calculateNextReview('good', {
      interval: 1,
      ease: INITIAL_EASE,
      repetitions: 1,
      nextReview: 0
    });
    expect(state.repetitions).toBe(2);
    expect(state.interval).toBe(6);
  });

  test('Review - Again resets repetitions', () => {
    const state = calculateNextReview('again', {
      interval: 10,
      ease: INITIAL_EASE,
      repetitions: 4,
      nextReview: 0
    });
    expect(state.repetitions).toBe(0);
    expect(state.interval).toBe(1);
    expect(state.ease).toBeLessThan(INITIAL_EASE);
  });
});
