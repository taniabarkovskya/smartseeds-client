import { env } from "@/shared/config/env";

export async function evaluateSpeech(
  transcript: string,
  expectedWord: string,
): Promise<{ score: number; feedback: string }> {
  try {
    const res = await fetch(`${env.ollamaUrl}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.2",
        stream: false,
        prompt: `You are a speech therapy assistant for children.
Evaluate how closely the child's pronunciation matches the expected word.
Expected word: "${expectedWord}"
Child said: "${transcript}"
Respond ONLY with valid JSON: {"score": 0.85, "feedback": "Дуже добре! Майже правильно."}
Score is from 0.0 to 1.0. Feedback must be in Ukrainian, encouraging, max 1 sentence.`,
      }),
    });
    const data = await res.json();
    return JSON.parse(data.response);
  } catch {
    return mockEvaluate(transcript, expectedWord);
  }
}

function mockEvaluate(transcript: string, expected: string) {
  const similarity =
    transcript.toLowerCase().trim() === expected.toLowerCase().trim() ? 1.0 : 0.6;
  return {
    score: similarity,
    feedback:
      similarity === 1.0
        ? "Чудово! Ти вимовив правильно!"
        : "Гарна спроба! Давай ще раз.",
  };
}