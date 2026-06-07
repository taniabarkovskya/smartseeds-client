import { useParams, useNavigate } from "react-router-dom";
import { AppHeader } from "@/widgets/AppHeader/AppHeader";
import { MOCK_THEORY, MOCK_COURSE_DETAILS } from "@/shared/api/mockLessons";

export function TheoryPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const theory = MOCK_THEORY[courseId ?? "default"] ?? MOCK_THEORY.default;
  const course = MOCK_COURSE_DETAILS[courseId ?? "1"] ?? MOCK_COURSE_DETAILS["1"];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#f8f7ff" }}>
      {/* Header on purple */}
      <div className="bg-[#9590B8]">
        <AppHeader />
      </div>

      {/* Page title area */}
      <div className="bg-white border-b border-border px-8 py-8 max-w-5xl mx-auto w-full">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
          Theory · {course.title}
        </p>
        <h1 className="font-heading text-3xl font-bold text-foreground mb-3">
          {theory.pageTitle}
        </h1>
        <p className="text-sm text-foreground/70 leading-relaxed max-w-2xl">
          {theory.intro}
        </p>
      </div>

      {/* Theory sections grid */}
      <div className="flex-1 max-w-5xl mx-auto w-full px-8 py-8">
        <div className="grid grid-cols-2 gap-5">
          {theory.sections.map((section, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-sm border border-border/40"
            >
              <h2 className="font-heading font-bold text-base text-foreground mb-3">
                {section.title}
              </h2>
              <p className="text-sm text-foreground/70 leading-relaxed mb-4">
                {section.body}
              </p>
              {section.examples && section.examples.length > 0 && (
                <div className="space-y-1.5">
                  {section.examples.map((ex, j) => (
                    <div
                      key={j}
                      className="text-xs font-medium text-foreground bg-muted rounded-lg px-3 py-1.5 inline-block mr-1.5 mb-1"
                    >
                      {ex}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA banner */}
      <div
        className="py-12 px-8"
        style={{
          background: `linear-gradient(135deg, ${course.heroTo} 0%, #1a1a2e 100%)`,
        }}
      >
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: decorative emojis */}
          <div className="flex gap-4 text-4xl select-none opacity-80">
            <span>🌸</span>
            <span>🌿</span>
            <span>✨</span>
          </div>

          {/* Center: text */}
          <div className="text-center flex-1">
            <p className="font-heading text-2xl font-bold text-white mb-2">
              {theory.bannerHeading}
            </p>
            <p className="text-sm text-white/70 max-w-md mx-auto">
              {theory.bannerSubtitle}
            </p>
          </div>

          {/* Right: buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/courses/${courseId}/tasks`)}
              className="px-5 py-2.5 rounded-xl bg-white text-foreground text-sm font-semibold hover:bg-white/90 transition-colors"
            >
              Start tasks
            </button>
            <button
              onClick={() => navigate(`/courses/${courseId}`)}
              className="px-5 py-2.5 rounded-xl bg-white/20 text-white text-sm font-semibold hover:bg-white/30 transition-colors"
            >
              Back to course
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
