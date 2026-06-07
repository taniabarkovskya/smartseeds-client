import { env } from "@/shared/config/env";

// ─── Speech evaluation ────────────────────────────────────────────────────────

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
Respond ONLY with valid JSON: {"score": 0.85, "feedback": "Great job! Almost perfect."}
Score is from 0.0 to 1.0. Feedback must be in English, encouraging, max 1 sentence.`,
      }),
    });
    const data = await res.json() as { response: string };
    return JSON.parse(data.response) as { score: number; feedback: string };
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
        ? "Excellent! You pronounced it correctly!"
        : "Good try! Let's do it again.",
  };
}

// ─── AI Chat ──────────────────────────────────────────────────────────────────

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const SYSTEM_PROMPT = `You are Flippy — a friendly AI assistant for SmartSeeds, a children's speech therapy platform.
Help with speech exercises, pronunciation, grammar, and vocabulary.
Be encouraging, patient, and child-friendly.
Always respond in English.
Give short, clear answers and include exercise examples when relevant.`;

export async function chatWithAI(messages: ChatMessage[]): Promise<string> {
  try {
    const res = await fetch(`${env.ollamaUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.2",
        stream: false,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
      }),
    });
    const data = await res.json() as { message?: { content: string } };
    return data.message?.content ?? "Sorry, something went wrong. Please try again.";
  } catch {
    return "AI assistant is unavailable. Make sure Ollama is running (`ollama serve`).";
  }
}
