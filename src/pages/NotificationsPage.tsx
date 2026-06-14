import { useState } from "react";
import { X, TrendingUp, Bell, BookOpen, Star, Zap, BarChart2, ArrowLeft } from "lucide-react";
import { AppHeader } from "@/widgets/AppHeader/AppHeader";

interface Notification {
  id: string;
  type: "report" | "streak" | "course" | "achievement" | "module" | "summary";
  title: string;
  preview: string;
  date: string;
  read: boolean;
  body: string;
}

const ICON_MAP = {
  report: TrendingUp,
  streak: Zap,
  course: BookOpen,
  achievement: Star,
  module: BookOpen,
  summary: BarChart2,
};

const COLOR_MAP: Record<Notification["type"], string> = {
  report: "#9590B8",
  streak: "#f59e0b",
  course: "#10b981",
  achievement: "#f59e0b",
  module: "#6366f1",
  summary: "#9590B8",
};

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "streak",
    title: "Streak at Risk — Act Now!",
    preview: "Your 7-day streak will expire in 2 hours. Complete any exercise to keep it going.",
    date: "Today, 10:42 AM",
    read: false,
    body: `Your current streak is **7 days** — great work keeping it up! But your daily goal hasn't been completed yet today, and the streak resets at midnight.

You have roughly **2 hours** left. Even a quick 5-minute exercise will count. Head to the Tasks section, pick any lesson, and you're good.

Don't let your progress slip — streaks are one of the best predictors of long-term improvement in speech. You've got this!`,
  },
  {
    id: "2",
    type: "report",
    title: "Weekly Progress Report",
    preview: "You completed 4 lessons this week. Phonetics score up by 14% — keep it up!",
    date: "Today, 9:00 AM",
    read: false,
    body: `Here's your summary for the week of **June 8 – June 14, 2026**:

**Lessons completed:** 4 out of your 5-lesson weekly goal
**Total practice time:** 38 minutes
**Exercises attempted:** 21

**Score changes:**
- Phonetics: +14% (now at 72%)
- Lexical accuracy: +6% (now at 68%)
- Grammar: no change (61%)

Your biggest gain was in the *Voiced Consonants* module — you nailed 9 out of 10 items on your first try. Pronunciation of /v/ and /z/ has noticeably improved.

**Next week's suggestion:** focus on the *Intonation Patterns* lesson to balance your grammar score.`,
  },
  {
    id: "3",
    type: "course",
    title: "New Course: Advanced Phonetics",
    preview: "A new course has just launched. Dive deeper into English sound patterns.",
    date: "Yesterday, 3:15 PM",
    read: false,
    body: `We've just published a brand-new course — **Advanced Phonetics: Sound Patterns in Context**.

This course is designed for learners who have completed at least one beginner or intermediate phonetics module. It covers:

- Connected speech phenomena (linking, elision, assimilation)
- Weak forms and schwa reduction
- Intonation in statements, questions, and emphasis
- Minimal pairs in rapid speech

**Estimated duration:** 6 modules · ~3 hours total
**Difficulty:** Intermediate–Advanced

The course is now available in the Content section. Early learners who complete it within the first month will unlock the **Pioneer** badge.`,
  },
  {
    id: "4",
    type: "achievement",
    title: "Achievement Unlocked: Quick Learner",
    preview: "You earned the Quick Learner badge for completing 3 lessons in one day.",
    date: "Jun 12, 2:30 PM",
    read: true,
    body: `Congratulations! You've earned the **Quick Learner** badge 🏆

This badge is awarded to learners who complete **3 or more lessons in a single day**. You hit that milestone on June 12 — finishing the *Short Vowels*, *Voiced Stops*, and *Minimal Pairs Intro* lessons back to back.

**Your current badges:**
- Quick Learner ✓ (new!)
- First Step ✓
- 7-Day Streak ✓

Badges are visible on your profile and contribute to your overall learner rank. Keep completing lessons to unlock more.`,
  },
  {
    id: "5",
    type: "module",
    title: "New Module Added: Rhythm & Stress",
    preview: "Module 5 'Rhythm & Stress' is now available in Phonetics Basics.",
    date: "Jun 9, 11:00 AM",
    read: true,
    body: `Good news — **Module 5: Rhythm & Stress** has been added to the *Phonetics Basics* course you're enrolled in.

This module focuses on:
- Word stress rules in English (primary vs. secondary stress)
- Sentence-level rhythm and timing
- Common stress mistakes made by Ukrainian speakers
- Practice exercises with real speech recordings

**Module length:** 5 lessons · ~45 minutes
**Recommended:** complete Module 4 before starting

You can find it in the course page under *Content → Phonetics Basics → Module 5*. The module is already unlocked for all enrolled learners.`,
  },
  {
    id: "6",
    type: "summary",
    title: "May Monthly Summary",
    preview: "You completed 14 lessons in May. Your overall score grew from 54% to 67%.",
    date: "Jun 1, 9:00 AM",
    read: true,
    body: `Here's your full summary for **May 2026**:

**Lessons completed:** 14
**Total time spent:** 2h 41min
**Days active:** 18 out of 31

**Score progression (May 1 → May 31):**
- Overall: 54% → 67% (+13%)
- Phonetics: 49% → 63% (+14%)
- Lexical: 58% → 71% (+13%)
- Grammar: 56% → 68% (+12%)

**Top lesson:** *Fricatives in Practice* — 100% on first attempt.
**Most improved area:** Phonetics.

You were most active in the second half of the month — great momentum heading into June. Your streak record in May was 9 consecutive days. Can you beat it this month?`,
  },
];

function formatBody(text: string) {
  return text.split("\n\n").map((para, i) => {
    const parts = para.split(/(\*\*[^*]+\*\*)/g).map((segment, j) => {
      if (segment.startsWith("**") && segment.endsWith("**")) {
        return <strong key={j}>{segment.slice(2, -2)}</strong>;
      }
      if (segment.startsWith("*") && segment.endsWith("*")) {
        return <em key={j}>{segment.slice(1, -1)}</em>;
      }
      return <span key={j}>{segment}</span>;
    });

    if (para.startsWith("- ")) {
      const items = para.split("\n").filter(l => l.startsWith("- "));
      return (
        <ul key={i} className="list-disc pl-5 space-y-1">
          {items.map((item, k) => <li key={k}>{item.slice(2)}</li>)}
        </ul>
      );
    }

    return <p key={i}>{parts}</p>;
  });
}

export function NotificationsPage() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = notifications.find(n => n.id === selectedId) ?? null;

  const handleSelect = (n: Notification) => {
    setSelectedId(n.id);
    if (!n.read) {
      setNotifications(prev =>
        prev.map(item => item.id === n.id ? { ...item, read: true } : item)
      );
    }
  };

  const handleClose = () => setSelectedId(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-[#9590B8]">
      <AppHeader />

      <main className="px-4 pb-8 pt-2 md:px-6">
        <div className="mb-4 flex items-center gap-3">
          <h1 className="font-heading text-2xl font-bold text-foreground">Notifications</h1>
          {unreadCount > 0 && (
            <span className="rounded-full bg-white/25 px-2.5 py-0.5 text-xs font-semibold text-foreground">
              {unreadCount} new
            </span>
          )}
        </div>

        <div
          className="flex gap-0 overflow-hidden rounded-2xl bg-white shadow-sm"
          style={{ minHeight: "calc(100vh - 160px)" }}
        >
          {/* Notification list — hidden on mobile when detail is open */}
          <div
            className={[
              "flex-shrink-0 overflow-y-auto border-r border-border transition-all duration-300",
              selectedId ? "hidden md:flex md:flex-col" : "flex flex-col w-full",
            ].join(" ")}
            style={{ width: selectedId ? "380px" : undefined }}
          >
            {notifications.map(n => {
              const Icon = ICON_MAP[n.type];
              const color = COLOR_MAP[n.type];
              const isSelected = n.id === selectedId;

              return (
                <button
                  key={n.id}
                  onClick={() => handleSelect(n)}
                  className={[
                    "flex w-full items-start gap-4 px-5 py-4 text-left transition-colors border-b border-border last:border-b-0",
                    isSelected ? "bg-[#9590B8]/10" : "hover:bg-muted/50",
                  ].join(" ")}
                >
                  <div
                    className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${color}20` }}
                  >
                    <Icon className="h-4 w-4" style={{ color }} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <span className={`text-sm leading-snug ${!n.read ? "font-semibold text-foreground" : "font-medium text-foreground/80"}`}>
                        {n.title}
                      </span>
                      <span className="shrink-0 text-xs text-muted-foreground">{n.date}</span>
                    </div>
                    {!isSelected && (
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {n.preview}
                      </p>
                    )}
                  </div>

                  {!n.read && !isSelected && (
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#9590B8]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Notification detail */}
          <div
            className={[
              "flex flex-1 flex-col overflow-hidden transition-all duration-300",
              selectedId ? "flex" : "hidden md:flex",
            ].join(" ")}
            style={{
              maxWidth: selectedId ? "100%" : "0",
              opacity: selectedId ? 1 : 0,
            }}
          >
            {selected && (
              <div className="flex h-full flex-col overflow-y-auto">
                <div className="flex items-start justify-between border-b border-border px-4 py-4 md:px-8 md:py-5">
                  {/* Mobile back button */}
                  <button
                    onClick={handleClose}
                    className="md:hidden mr-3 mt-0.5 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Back"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${COLOR_MAP[selected.type]}20` }}
                    >
                      {(() => { const Icon = ICON_MAP[selected.type]; return <Icon className="h-4 w-4" style={{ color: COLOR_MAP[selected.type] }} />; })()}
                    </div>
                    <div>
                      <h2 className="font-heading text-lg font-bold text-foreground leading-tight">
                        {selected.title}
                      </h2>
                      <p className="text-xs text-muted-foreground mt-0.5">{selected.date}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="hidden md:flex rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    aria-label="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex-1 px-4 py-4 text-sm text-foreground/80 leading-relaxed space-y-3 md:px-8 md:py-6">
                  {formatBody(selected.body)}
                </div>
              </div>
            )}

            {!selected && (
              <div className="flex flex-1 items-center justify-center">
                <div className="text-center">
                  <Bell className="mx-auto mb-3 h-8 w-8 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">Select a notification to read it</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
