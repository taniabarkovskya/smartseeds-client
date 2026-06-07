export interface CompetencyVectorValues {
  phonetics: number;
  lexical: number;
  grammar: number;
}

const ALPHA = 0.3;

export function updateVector(
  current: CompetencyVectorValues,
  score: number,
): CompetencyVectorValues {
  return {
    phonetics: Math.round(((1 - ALPHA) * current.phonetics + ALPHA * score) * 1000) / 1000,
    lexical: Math.round(((1 - ALPHA) * current.lexical + ALPHA * score) * 1000) / 1000,
    grammar: Math.round(((1 - ALPHA) * current.grammar + ALPHA * score) * 1000) / 1000,
  };
}

export function utilityScore(
  task: { complexity: number },
  vector: CompetencyVectorValues,
  weights = { w1: 0.5, w2: 0.3, w3: 0.2 },
): number {
  const avgSkill = (vector.phonetics + vector.lexical + vector.grammar) / 3;
  const Di = 1 - avgSkill;
  const Mi = 1 - Math.abs(task.complexity - avgSkill);
  const Gi = 0.7;
  return weights.w1 * Di + weights.w2 * Mi + weights.w3 * Gi;
}

export function selectNextTask<T extends { complexity: number }>(
  tasks: T[],
  vector: CompetencyVectorValues,
): T {
  return tasks.reduce((best, task) =>
    utilityScore(task, vector) > utilityScore(best, vector) ? task : best,
  );
}