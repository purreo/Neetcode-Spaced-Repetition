export type ReviewGrade = 'again' | 'hard' | 'good' | 'easy';

export interface SM2State {
  interval: number; // in days
  ease: number;
  repetitions: number;
  nextReview: number; // timestamp in ms
}

export const INITIAL_EASE = 2.5;

export function calculateNextReview(grade: ReviewGrade, currentState?: SM2State): SM2State {
  let interval = currentState?.interval ?? 0;
  let ease = currentState?.ease ?? INITIAL_EASE;
  let repetitions = currentState?.repetitions ?? 0;
  
  let q = 0;
  switch (grade) {
    case 'again': q = 0; break;
    case 'hard': q = 2; break;
    case 'good': q = 4; break;
    case 'easy': q = 5; break;
  }

  if (q >= 3) {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * ease);
    }
    repetitions++;
  } else {
    repetitions = 0;
    interval = 1;
  }

  ease = ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (ease < 1.3) ease = 1.3;

  // Calculate next review timestamp (Date.now() + interval * 24h)
  const nextReview = Date.now() + interval * 24 * 60 * 60 * 1000;

  return {
    interval,
    ease: Number(ease.toFixed(2)),
    repetitions,
    nextReview
  };
}
