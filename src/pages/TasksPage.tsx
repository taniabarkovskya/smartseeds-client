import { useNavigate } from "react-router-dom";
import {
  ListChecks,
  ToggleLeft,
  PenLine,
  Mic,
  AudioLines,
  Headphones,
  CheckCircle2,
  XCircle,
  PlayCircle,
  ChevronRight,
} from "lucide-react";
import { AppHeader } from "@/widgets/AppHeader/AppHeader";

type ExerciseKind =
  | "multiple-choice"
  | "true-false"
  | "fill-blank"
  | "speech-word"
  | "speech-sentence"
  | "dictation";

type TaskStatus = "completed" | "in-progress" | "failed";

interface TaskItem {
  id: string;
  kind: ExerciseKind;
  title: string;
  courseName: string;
  courseId: string;
  difficulty: 1 | 2 | 3;
  date: string;
  score?: number;
  progress?: number;
}

const KIND_META: Record<
  ExerciseKind,
  { label: string; Icon: React.ElementType; color: string; bg: string }
> = {
  "multiple-choice": { label: "Multiple Choice", Icon: ListChecks,   color: "#9590B8", bg: "#9590B815" },
  "true-false":      { label: "True / False",    Icon: ToggleLeft,   color: "#6366f1", bg: "#6366f115" },
  "fill-blank":      { label: "Fill the Blank",  Icon: PenLine,      color: "#10b981", bg: "#10b98115" },
  "speech-word":     { label: "Speech: Word",    Icon: Mic,          color: "#f59e0b", bg: "#f59e0b15" },
  "speech-sentence": { label: "Speech: Sentence",Icon: AudioLines,   color: "#ec4899", bg: "#ec489915" },
  "dictation":       { label: "Dictation",        Icon: Headphones,   color: "#14b8a6", bg: "#14b8a615" },
};

const COMPLETED: TaskItem[] = [
  {
    id: "c1",
    kind: "multiple-choice",
    title: "Plural Forms Quiz",
    courseName: "Grammar Structure of Language",
    courseId: "6",
    difficulty: 1,
    date: "Jun 13",
    score: 90,
  },
  {
    id: "c2",
    kind: "speech-word",
    title: "Speech: 'pronunciation'",
    courseName: "Sound Pronunciation: Beginner Level",
    courseId: "1",
    difficulty: 2,
    date: "Jun 12",
    score: 85,
  },
  {
    id: "c3",
    kind: "true-false",
    title: "True / False: Present Simple Rules",
    courseName: "Grammar Structure of Language",
    courseId: "6",
    difficulty: 1,
    date: "Jun 11",
    score: 100,
  },
  {
    id: "c4",
    kind: "fill-blank",
    title: "Past Simple vs Present Perfect",
    courseName: "Grammar Structure of Language",
    courseId: "6",
    difficulty: 2,
    date: "Jun 9",
    score: 78,
  },
];

const IN_PROGRESS: TaskItem[] = [
  {
    id: "p1",
    kind: "speech-sentence",
    title: "Tongue Twister: S vs SH",
    courseName: "Differentiating Opposing Phonemes",
    courseId: "2",
    difficulty: 2,
    date: "Jun 14",
    progress: 60,
  },
  {
    id: "p2",
    kind: "dictation",
    title: "Dictation: Quick Brown Fox",
    courseName: "Sound Pronunciation: Beginner Level",
    courseId: "1",
    difficulty: 1,
    date: "Jun 14",
    progress: 20,
  },
  {
    id: "p3",
    kind: "multiple-choice",
    title: "Vocabulary: Action Words",
    courseName: "Expanding Vocabulary",
    courseId: "4",
    difficulty: 1,
    date: "Jun 13",
    progress: 45,
  },
  {
    id: "p4",
    kind: "fill-blank",
    title: "Sentence Building with Linking Words",
    courseName: "Developing Connected Speech",
    courseId: "3",
    difficulty: 2,
    date: "Jun 12",
    progress: 30,
  },
];

const FAILED: TaskItem[] = [
  {
    id: "f1",
    kind: "speech-sentence",
    title: "Connected Speech: Free Talk",
    courseName: "Automating Sounds in Sentences",
    courseId: "5",
    difficulty: 3,
    date: "Jun 11",
    score: 42,
  },
  {
    id: "f2",
    kind: "true-false",
    title: "True / False: Adjective Word Order",
    courseName: "Grammar Structure of Language",
    courseId: "6",
    difficulty: 2,
    date: "Jun 10",
    score: 30,
  },
  {
    id: "f3",
    kind: "dictation",
    title: "Dictation: Complex Sentence",
    courseName: "Sound Pronunciation: Beginner Level",
    courseId: "1",
    difficulty: 3,
    date: "Jun 8",
    score: 25,
  },
  {
    id: "f4",
    kind: "multiple-choice",
    title: "Vocabulary: Category Sorting",
    courseName: "Expanding Vocabulary",
    courseId: "4",
    difficulty: 2,
    date: "Jun 7",
    score: 55,
  },
];

function DifficultyDots({ level }: { level: 1 | 2 | 3 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3].map(i => (
        <span
          key={i}
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: i <= level ? "#9590B8" : "#e5e7eb" }}
        />
      ))}
    </div>
  );
}

function ScoreBadge({ score, passing = 60 }: { score: number; passing?: number }) {
  const pass = score >= passing;
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
      style={{
        backgroundColor: pass ? "#dcfce7" : "#fee2e2",
        color: pass ? "#166534" : "#991b1b",
      }}
    >
      {score}%
    </span>
  );
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-[#9590B8] transition-all"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground">{value}%</span>
    </div>
  );
}

interface TaskCardProps {
  task: TaskItem;
  status: TaskStatus;
  onAction: (task: TaskItem) => void;
}

function TaskCard({ task, status, onAction }: TaskCardProps) {
  const meta = KIND_META[task.kind];
  const Icon = meta.Icon;

  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-white px-5 py-4 shadow-sm transition-shadow hover:shadow-md">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: meta.bg }}
      >
        <Icon className="h-4 w-4" style={{ color: meta.color }} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">{task.title}</p>
            <p className="truncate text-xs text-muted-foreground mt-0.5">{task.courseName}</p>
          </div>
          <div className="shrink-0 flex flex-col items-end gap-1.5">
            {status === "completed" && task.score !== undefined && (
              <ScoreBadge score={task.score} />
            )}
            {status === "failed" && task.score !== undefined && (
              <ScoreBadge score={task.score} />
            )}
            {status === "in-progress" && task.progress !== undefined && (
              <ProgressBar value={task.progress} />
            )}
            <span className="text-xs text-muted-foreground">{task.date}</span>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="rounded-md px-1.5 py-0.5 text-[11px] font-medium"
              style={{ backgroundColor: meta.bg, color: meta.color }}
            >
              {meta.label}
            </span>
            <DifficultyDots level={task.difficulty} />
          </div>

          <button
            onClick={() => onAction(task)}
            className="flex items-center gap-1 rounded-lg px-3 py-1 text-xs font-medium transition-opacity hover:opacity-75"
            style={{
              backgroundColor:
                status === "failed" ? "#fee2e2" : status === "completed" ? "#f3f4f6" : "#9590B815",
              color:
                status === "failed" ? "#991b1b" : status === "completed" ? "#374151" : "#9590B8",
            }}
          >
            {status === "completed" && "Review"}
            {status === "in-progress" && "Continue"}
            {status === "failed" && "Retry"}
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

interface SectionProps {
  title: string;
  count: number;
  tasks: TaskItem[];
  status: TaskStatus;
  icon: React.ReactNode;
  accentColor: string;
  onAction: (task: TaskItem) => void;
}

function Section({ title, count, tasks, status, icon, accentColor, onAction }: SectionProps) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <span style={{ color: accentColor }}>{icon}</span>
        <h2 className="font-heading text-base font-bold text-foreground">{title}</h2>
        <span
          className="rounded-full px-2 py-0.5 text-xs font-semibold"
          style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
        >
          {count}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} status={status} onAction={onAction} />
        ))}
      </div>
    </section>
  );
}

export function TasksPage() {
  const navigate = useNavigate();

  const handleAction = (task: TaskItem) => {
    navigate(`/courses/${task.courseId}/tasks`);
  };

  return (
    <div className="min-h-screen bg-[#9590B8]">
      <AppHeader />

      <main className="px-4 pb-10 pt-2 md:px-6 md:pb-12">
        <div className="mb-6">
          <h1 className="font-heading text-2xl font-bold text-foreground">My Tasks</h1>
          <p className="mt-0.5 text-sm text-foreground/70">
            {COMPLETED.length + IN_PROGRESS.length + FAILED.length} exercises total
          </p>
        </div>

        <div className="flex flex-col gap-8">
          <Section
            title="In Progress"
            count={IN_PROGRESS.length}
            tasks={IN_PROGRESS}
            status="in-progress"
            icon={<PlayCircle className="h-4 w-4" />}
            accentColor="#9590B8"
            onAction={handleAction}
          />

          <Section
            title="Completed"
            count={COMPLETED.length}
            tasks={COMPLETED}
            status="completed"
            icon={<CheckCircle2 className="h-4 w-4" />}
            accentColor="#10b981"
            onAction={handleAction}
          />

          <Section
            title="Failed"
            count={FAILED.length}
            tasks={FAILED}
            status="failed"
            icon={<XCircle className="h-4 w-4" />}
            accentColor="#ef4444"
            onAction={handleAction}
          />
        </div>
      </main>
    </div>
  );
}
