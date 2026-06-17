import { SM2State } from './sm2';

export interface ProblemData extends SM2State {
  slug: string;
}

// Compress to "interval|ease|repetitions|nextReview"
function serializeState(state: SM2State): string {
  return `${state.interval}|${state.ease}|${state.repetitions}|${state.nextReview}`;
}

function deserializeState(data: string): SM2State {
  const parts = data.split('|');
  return {
    interval: Number(parts[0]),
    ease: Number(parts[1]),
    repetitions: Number(parts[2]),
    nextReview: Number(parts[3])
  };
}

export const storage = {
  async saveProblem(slug: string, state: SM2State): Promise<void> {
    const key = `p:${slug}`;
    const value = serializeState(state);
    await chrome.storage.sync.set({ [key]: value });
  },

  async deleteProblem(slug: string): Promise<void> {
    const key = `p:${slug}`;
    await chrome.storage.sync.remove(key);
  },

  async getProblem(slug: string): Promise<ProblemData | null> {
    const key = `p:${slug}`;
    const result = await chrome.storage.sync.get(key);
    if (result[key]) {
      return {
        slug,
        ...deserializeState(result[key] as string)
      };
    }
    return null;
  },

  async getAllProblems(): Promise<ProblemData[]> {
    const result = await chrome.storage.sync.get(null);
    const problems: ProblemData[] = [];
    for (const [key, value] of Object.entries(result)) {
      if (key.startsWith('p:')) {
        const slug = key.substring(2);
        problems.push({
          slug,
          ...deserializeState(value as string)
        });
      }
    }
    return problems;
  },

  async getDueProblems(): Promise<ProblemData[]> {
    const all = await this.getAllProblems();
    const now = Date.now();
    return all.filter(p => p.nextReview <= now);
  }
};
