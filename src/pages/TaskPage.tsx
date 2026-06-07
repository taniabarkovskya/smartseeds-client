import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Mic, MicOff, CheckCircle, XCircle, ArrowRight, ChevronLeft } from "lucide-react";
import { AppHeader } from "@/widgets/AppHeader/AppHeader";
import { useSpeechRecognition } from "@/features/speech-recorder/model/useSpeechRecognition";
import { MOCK_EXERCISES, MOCK_COURSE_DETAILS } from "@/shared/api/mockLessons";
import type {
  Exercise,
  MCQExercise,
  TFExercise,
  FillBlankExercise,
  SpeechWordExercise,
  SpeechSentenceExercise,
  DictationExercise,
} from "@/shared/api/mockLessons";
import { cn } from "@/lib/utils";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function textSimilarity(a: string, b: string): number {
  const norm = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();
  const na = norm(a);
  const nb = norm(b);
  if (na === nb) return 1;
  const wa = na.split(/\s+/);
  const wb = nb.split(/\s+/);
  const hits = wa.filter((w) => wb.includes(w)).length;
  return hits / Math.max(wa.length, wb.length);
}

// ─── Exercise cards ───────────────────────────────────────────────────────────

function MCQCard({
  ex,
  onAnswer,
}: {
  ex: MCQExercise;
  onAnswer: (correct: boolean, explanation: string) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);

  const check = () => {
    if (selected === null) return;
    setChecked(true);
    onAnswer(selected === ex.correct, ex.explanation);
  };

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-3">
        Multiple Choice
      </p>
      <p className="font-heading text-xl font-bold text-white mb-6 leading-snug">
        {ex.question}
      </p>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {ex.options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect = i === ex.correct;
          let style = "bg-white/10 border-white/20 text-white hover:bg-white/20";
          if (checked && isCorrect) style = "bg-green-500/30 border-green-400 text-white";
          else if (checked && isSelected && !isCorrect)
            style = "bg-red-500/30 border-red-400 text-white";
          else if (isSelected) style = "bg-white/25 border-white/60 text-white";

          return (
            <button
              key={i}
              disabled={checked}
              onClick={() => setSelected(i)}
              className={cn(
                "rounded-xl border px-4 py-3 text-sm font-medium text-left transition-all",
                style,
              )}
            >
              <span className="text-white/50 mr-2">{String.fromCharCode(65 + i)}.</span>
              {opt}
            </button>
          );
        })}
      </div>
      {!checked && (
        <button
          onClick={check}
          disabled={selected === null}
          className="px-6 py-2.5 rounded-xl bg-white text-foreground text-sm font-semibold disabled:opacity-40 hover:bg-white/90 transition-colors"
        >
          Check Answer
        </button>
      )}
    </div>
  );
}

function TFCard({
  ex,
  onAnswer,
}: {
  ex: TFExercise;
  onAnswer: (correct: boolean, explanation: string) => void;
}) {
  const [selected, setSelected] = useState<boolean | null>(null);
  const [checked, setChecked] = useState(false);

  const check = (val: boolean) => {
    setSelected(val);
    setChecked(true);
    onAnswer(val === ex.correct, ex.explanation);
  };

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-3">
        True or False
      </p>
      <p className="font-heading text-xl font-bold text-white mb-8 leading-snug">
        "{ex.statement}"
      </p>
      <div className="flex gap-4">
        {([true, false] as const).map((val) => {
          const label = val ? "True" : "False";
          const isSelected = selected === val;
          const isCorrect = val === ex.correct;
          let style =
            "bg-white/10 border-white/20 text-white hover:bg-white/20";
          if (checked && isCorrect) style = "bg-green-500/30 border-green-400 text-white";
          else if (checked && isSelected && !isCorrect)
            style = "bg-red-500/30 border-red-400 text-white";
          else if (isSelected) style = "bg-white/25 border-white/60 text-white";

          return (
            <button
              key={label}
              disabled={checked}
              onClick={() => check(val)}
              className={cn(
                "flex-1 rounded-xl border py-3 text-base font-semibold transition-all",
                style,
              )}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FillBlankCard({
  ex,
  onAnswer,
}: {
  ex: FillBlankExercise;
  onAnswer: (correct: boolean, explanation: string) => void;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);

  const submit = () => {
    let correct = 0;
    ex.sentences.forEach((s) => {
      const given = (answers[s.id] ?? "").trim().toLowerCase();
      const expected = s.answer.toLowerCase();
      if (given === expected || textSimilarity(given, expected) >= 0.8) correct++;
    });
    setScore(correct);
    setChecked(true);
    const pct = correct / ex.sentences.length;
    onAnswer(
      pct >= 0.6,
      `You got ${correct} of ${ex.sentences.length} correct (${Math.round(pct * 100)}%).`,
    );
  };

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-1">
        Fill in the Blanks
      </p>
      <p className="font-heading text-xl font-bold text-white mb-1">{ex.title}</p>
      <p className="text-sm text-white/60 mb-6">{ex.instruction}</p>

      <div className="space-y-3 mb-6">
        {ex.sentences.map((s, i) => {
          const given = (answers[s.id] ?? "").trim().toLowerCase();
          const expected = s.answer.toLowerCase();
          const isCorrect =
            given === expected || textSimilarity(given, expected) >= 0.8;

          return (
            <div key={s.id} className="flex items-center gap-2 flex-wrap">
              <span className="text-white/50 text-sm w-5 shrink-0">{i + 1}.</span>
              <span className="text-sm text-white">{s.before}</span>
              <div className="relative">
                <input
                  type="text"
                  disabled={checked}
                  value={answers[s.id] ?? ""}
                  onChange={(e) =>
                    setAnswers((prev) => ({ ...prev, [s.id]: e.target.value }))
                  }
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-sm font-medium min-w-[120px] border focus:outline-none focus:ring-2 focus:ring-white/40",
                    checked
                      ? isCorrect
                        ? "bg-green-500/20 border-green-400 text-white"
                        : "bg-red-500/20 border-red-400 text-white"
                      : "bg-white/15 border-white/30 text-white placeholder:text-white/40",
                  )}
                  placeholder="your answer"
                />
                {checked && !isCorrect && (
                  <span className="absolute -bottom-4 left-0 text-[10px] text-green-300 whitespace-nowrap">
                    ✓ {s.answer}
                  </span>
                )}
              </div>
              <span className="text-sm text-white">{s.after}</span>
            </div>
          );
        })}
      </div>

      {checked && (
        <div className="mb-4 text-sm text-white/70">
          Score: <span className="font-bold text-white">{score}/{ex.sentences.length}</span>
        </div>
      )}

      {!checked && (
        <button
          onClick={submit}
          className="px-6 py-2.5 rounded-xl bg-white text-foreground text-sm font-semibold hover:bg-white/90 transition-colors"
        >
          Submit
        </button>
      )}
    </div>
  );
}

function SpeechWordCard({
  ex,
  onAnswer,
}: {
  ex: SpeechWordExercise;
  onAnswer: (correct: boolean, explanation: string) => void;
}) {
  const { transcript, isListening, error, start, reset } =
    useSpeechRecognition("en-US");
  const [checked, setChecked] = useState(false);
  const [similarity, setSimilarity] = useState(0);

  useEffect(() => {
    if (transcript && !checked) {
      const sim = textSimilarity(transcript, ex.word);
      setSimilarity(sim);
      setChecked(true);
      onAnswer(
        sim >= 0.7,
        sim >= 0.7
          ? "Great pronunciation! Well done."
          : `You said "${transcript}". Try saying "${ex.word}" more clearly.`,
      );
    }
  }, [transcript]); // eslint-disable-line

  return (
    <div className="text-center">
      <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-4">
        Repeat the Word
      </p>
      <p
        className="font-heading font-bold text-white mb-1"
        style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
      >
        {ex.word}
      </p>
      <p className="text-white/50 text-sm mb-2">{ex.phonetic}</p>
      <p className="text-white/70 text-sm mb-1 italic">"{ex.translation}"</p>
      <p className="text-white/50 text-xs mb-8">{ex.example}</p>

      {!checked ? (
        <button
          onClick={() => { reset(); start(); }}
          disabled={isListening}
          className={cn(
            "mx-auto flex items-center justify-center size-20 rounded-full text-white transition-all",
            isListening
              ? "bg-red-500 animate-pulse shadow-lg shadow-red-500/40"
              : "bg-white/20 hover:bg-white/30 border-2 border-white/30",
          )}
        >
          {isListening ? <MicOff className="size-7" /> : <Mic className="size-7" />}
        </button>
      ) : (
        <div className="space-y-3">
          <div className="text-white/60 text-sm">
            You said: <span className="text-white font-medium">"{transcript}"</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="h-2 w-40 rounded-full bg-white/20 overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${similarity * 100}%`,
                  backgroundColor: similarity >= 0.7 ? "#4ade80" : "#f87171",
                }}
              />
            </div>
            <span className="text-sm text-white/70">{Math.round(similarity * 100)}%</span>
          </div>
        </div>
      )}

      {error && <p className="mt-4 text-xs text-red-300">{error}</p>}

      {!checked && !isListening && (
        <p className="mt-4 text-xs text-white/40">Tap the microphone and say the word</p>
      )}
    </div>
  );
}

function SpeechSentenceCard({
  ex,
  onAnswer,
}: {
  ex: SpeechSentenceExercise;
  onAnswer: (correct: boolean, explanation: string) => void;
}) {
  const { transcript, isListening, error, start, reset } =
    useSpeechRecognition("en-US");
  const [checked, setChecked] = useState(false);
  const [similarity, setSimilarity] = useState(0);

  useEffect(() => {
    if (transcript && !checked) {
      const sim = textSimilarity(transcript, ex.sentence);
      setSimilarity(sim);
      setChecked(true);
      onAnswer(
        sim >= 0.6,
        sim >= 0.6
          ? "Excellent! Your pronunciation is clear and natural."
          : `You said: "${transcript}". Try again — focus on each word.`,
      );
    }
  }, [transcript]); // eslint-disable-line

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-3">
        Repeat the Sentence
      </p>
      <div className="bg-white/10 rounded-xl p-5 mb-4">
        <p className="font-heading text-xl font-bold text-white leading-snug">
          {ex.sentence}
        </p>
      </div>
      <p className="text-sm text-white/50 mb-8">💡 {ex.hint}</p>

      {!checked ? (
        <div className="flex items-center gap-4">
          <button
            onClick={() => { reset(); start(); }}
            disabled={isListening}
            className={cn(
              "flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all",
              isListening
                ? "bg-red-500 text-white animate-pulse"
                : "bg-white text-foreground hover:bg-white/90",
            )}
          >
            {isListening ? (
              <><MicOff className="size-4" /> Recording...</>
            ) : (
              <><Mic className="size-4" /> Tap to speak</>
            )}
          </button>
          {!isListening && (
            <p className="text-xs text-white/40">Press and say the sentence above</p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-white/60">
            You said: <span className="text-white font-medium">"{transcript}"</span>
          </p>
          <div className="flex items-center gap-2">
            <div className="h-2 w-48 rounded-full bg-white/20 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${similarity * 100}%`,
                  backgroundColor: similarity >= 0.6 ? "#4ade80" : "#f87171",
                }}
              />
            </div>
            <span className="text-sm text-white/70">{Math.round(similarity * 100)}% match</span>
          </div>
        </div>
      )}

      {error && <p className="mt-4 text-xs text-red-300">{error}</p>}
    </div>
  );
}

function DictationCard({
  ex,
  onAnswer,
}: {
  ex: DictationExercise;
  onAnswer: (correct: boolean, explanation: string) => void;
}) {
  const [phase, setPhase] = useState<"show" | "countdown" | "type" | "done">("show");
  const [countdown, setCountdown] = useState(5);
  const [typed, setTyped] = useState("");
  const [similarity, setSimilarity] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCountdown = () => {
    setPhase("countdown");
    timerRef.current = setInterval(() => {
      setCountdown((n) => {
        if (n <= 1) {
          clearInterval(timerRef.current!);
          setPhase("type");
          return 5;
        }
        return n - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const submit = () => {
    const sim = textSimilarity(typed, ex.text);
    setSimilarity(sim);
    setPhase("done");
    onAnswer(
      sim >= 0.7,
      `You matched ${Math.round(sim * 100)}% of the text. ${sim >= 0.7 ? "Well done!" : `The correct sentence was: "${ex.text}"`}`,
    );
  };

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-3">
        Dictation Exercise
      </p>

      {phase === "show" && (
        <>
          <p className="text-sm text-white/60 mb-4">
            Read this sentence carefully. Then you'll have to type it from memory.
          </p>
          <div className="bg-white/10 rounded-xl p-5 mb-6">
            <p className="font-heading text-lg font-bold text-white">{ex.text}</p>
          </div>
          <button
            onClick={startCountdown}
            className="px-6 py-2.5 rounded-xl bg-white text-foreground text-sm font-semibold hover:bg-white/90 transition-colors"
          >
            I'm ready — hide it!
          </button>
        </>
      )}

      {phase === "countdown" && (
        <div className="text-center py-8">
          <p className="text-white/60 text-sm mb-4">Hiding in…</p>
          <p className="font-heading text-7xl font-bold text-white">{countdown}</p>
        </div>
      )}

      {phase === "type" && (
        <>
          <p className="text-sm text-white/60 mb-4">
            Now type what you remember. Don't worry about perfect spelling — focus on the words.
          </p>
          <textarea
            rows={3}
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder="Type the sentence here…"
            className="w-full rounded-xl bg-white/15 border border-white/30 text-white placeholder:text-white/30 px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-white/40 mb-4"
          />
          <button
            onClick={submit}
            disabled={!typed.trim()}
            className="px-6 py-2.5 rounded-xl bg-white text-foreground text-sm font-semibold disabled:opacity-40 hover:bg-white/90 transition-colors"
          >
            Submit
          </button>
        </>
      )}

      {phase === "done" && (
        <div className="space-y-4">
          <div className="bg-white/10 rounded-xl p-4">
            <p className="text-xs text-white/50 mb-1">Original</p>
            <p className="text-sm text-white">{ex.text}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <p className="text-xs text-white/50 mb-1">Your answer</p>
            <p className="text-sm text-white">{typed}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-48 rounded-full bg-white/20 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${similarity * 100}%`,
                  backgroundColor: similarity >= 0.7 ? "#4ade80" : "#f87171",
                }}
              />
            </div>
            <span className="text-sm text-white/70">{Math.round(similarity * 100)}% match</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Task flow ────────────────────────────────────────────────────────────────

interface Feedback {
  correct: boolean;
  explanation: string;
}

function ExerciseCard({ exercise }: { exercise: Exercise; idx: number }) {
  // Wrapper — only used internally for type narrowing
  return <>{exercise.kind}</>;
}
// Not used directly — inline rendering below
void ExerciseCard;

export function TaskPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const course = MOCK_COURSE_DETAILS[courseId ?? "1"] ?? MOCK_COURSE_DETAILS["1"];
  const exercises = MOCK_EXERCISES;

  const [idx, setIdx] = useState(0);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [results, setResults] = useState<boolean[]>([]);
  const [done, setDone] = useState(false);

  const exercise = exercises[idx];
  const progress = (idx / exercises.length) * 100;

  const handleAnswer = (correct: boolean, explanation: string) => {
    setFeedback({ correct, explanation });
  };

  const handleNext = () => {
    const newResults = [...results, feedback?.correct ?? false];
    setResults(newResults);
    setFeedback(null);
    if (idx + 1 >= exercises.length) {
      setDone(true);
    } else {
      setIdx((i) => i + 1);
    }
  };

  const score = results.filter(Boolean).length;
  const total = exercises.length;

  if (done) {
    const pct = Math.round((score / total) * 100);
    const emoji = pct >= 80 ? "🎉" : pct >= 50 ? "👍" : "💪";

    return (
      <div className="min-h-screen bg-[#9590B8]">
        <AppHeader />
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-72px)] px-6">
          <div className="bg-[#2D2A4A] rounded-3xl p-10 max-w-md w-full text-center shadow-2xl">
            <div className="text-6xl mb-4">{emoji}</div>
            <h2 className="font-heading text-2xl font-bold text-white mb-2">
              Lesson Complete!
            </h2>
            <p className="text-white/60 text-sm mb-6">
              You answered {score} of {total} exercises correctly.
            </p>

            {/* Score ring */}
            <div className="flex items-center justify-center mb-6">
              <div className="relative size-28">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                  <circle
                    cx="18" cy="18" r="15.9" fill="none"
                    stroke={pct >= 80 ? "#4ade80" : pct >= 50 ? "#facc15" : "#f87171"}
                    strokeWidth="3"
                    strokeDasharray={`${pct} ${100 - pct}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-heading text-2xl font-bold text-white">{pct}%</span>
                </div>
              </div>
            </div>

            {/* Per-exercise breakdown */}
            <div className="flex justify-center gap-1.5 mb-8">
              {results.map((r, i) => (
                <div
                  key={i}
                  className={cn("size-3 rounded-full", r ? "bg-green-400" : "bg-red-400")}
                  title={`Exercise ${i + 1}: ${r ? "correct" : "wrong"}`}
                />
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/courses/${courseId}`)}
                className="flex-1 py-3 rounded-xl bg-white/15 text-white text-sm font-semibold hover:bg-white/25 transition-colors"
              >
                Back to course
              </button>
              <button
                onClick={() => {
                  setIdx(0);
                  setResults([]);
                  setFeedback(null);
                  setDone(false);
                }}
                className="flex-1 py-3 rounded-xl bg-white text-foreground text-sm font-semibold hover:bg-white/90 transition-colors"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#9590B8]">
      <AppHeader />

      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Progress bar */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate(`/courses/${courseId}`)}
            className="text-white/60 hover:text-white transition-colors"
          >
            <ChevronLeft className="size-5" />
          </button>
          <div className="flex-1 h-2 rounded-full bg-white/20 overflow-hidden">
            <div
              className="h-full rounded-full bg-white transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-white/60 shrink-0">
            {idx + 1} / {exercises.length}
          </span>
        </div>

        {/* Exercise card */}
        <div
          className="rounded-2xl p-8 shadow-xl mb-4"
          style={{ background: "rgba(30, 27, 60, 0.85)", backdropFilter: "blur(12px)" }}
        >
          {/* Render exercise by kind */}
          {exercise.kind === "multiple-choice" && (
            <MCQCard
              key={exercise.id}
              ex={exercise}
              onAnswer={handleAnswer}
            />
          )}
          {exercise.kind === "true-false" && (
            <TFCard
              key={exercise.id}
              ex={exercise}
              onAnswer={handleAnswer}
            />
          )}
          {exercise.kind === "fill-blank" && (
            <FillBlankCard
              key={exercise.id}
              ex={exercise}
              onAnswer={handleAnswer}
            />
          )}
          {exercise.kind === "speech-word" && (
            <SpeechWordCard
              key={exercise.id}
              ex={exercise}
              onAnswer={handleAnswer}
            />
          )}
          {exercise.kind === "speech-sentence" && (
            <SpeechSentenceCard
              key={exercise.id}
              ex={exercise}
              onAnswer={handleAnswer}
            />
          )}
          {exercise.kind === "dictation" && (
            <DictationCard
              key={exercise.id}
              ex={exercise}
              onAnswer={handleAnswer}
            />
          )}

          {/* Feedback panel */}
          {feedback && (
            <div
              className={cn(
                "mt-6 rounded-xl p-4 flex items-start gap-3",
                feedback.correct
                  ? "bg-green-500/20 border border-green-500/30"
                  : "bg-red-500/20 border border-red-500/30",
              )}
            >
              {feedback.correct ? (
                <CheckCircle className="size-5 text-green-400 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="size-5 text-red-400 shrink-0 mt-0.5" />
              )}
              <div>
                <p className={cn("font-semibold text-sm", feedback.correct ? "text-green-300" : "text-red-300")}>
                  {feedback.correct ? "Correct!" : "Not quite"}
                </p>
                <p className="text-xs text-white/60 mt-0.5">{feedback.explanation}</p>
              </div>
            </div>
          )}
        </div>

        {/* Next button — shown after feedback */}
        {feedback && (
          <div className="flex justify-end">
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white text-foreground text-sm font-semibold hover:bg-white/90 transition-colors"
            >
              {idx + 1 >= exercises.length ? "See Results" : "Next Exercise"}
              <ArrowRight className="size-4" />
            </button>
          </div>
        )}

        {/* Breadcrumb */}
        <p className="text-center text-xs text-white/30 mt-4">
          {course.title} · Lesson 1
        </p>
      </div>
    </div>
  );
}
