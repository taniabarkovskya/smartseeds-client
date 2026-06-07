import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, BookOpen, Mic } from "lucide-react";
import { AppHeader } from "@/widgets/AppHeader/AppHeader";
import { Button } from "@/components/ui/button";
import { MOCK_COURSE_DETAILS } from "@/shared/api/mockLessons";

export function CoursePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const course = MOCK_COURSE_DETAILS[courseId ?? "1"] ?? MOCK_COURSE_DETAILS["1"];

  return (
    <div className="min-h-screen bg-white">
      {/* Header on purple background */}
      <div className="bg-[#9590B8]">
        <AppHeader />
      </div>

      {/* Hero */}
      <div
        className="relative flex flex-col items-center justify-center overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${course.heroFrom} 0%, ${course.heroTo} 100%)`,
          minHeight: "260px",
        }}
      >
        {/* Back button */}
        <button
          onClick={() => navigate("/courses")}
          className="absolute top-4 left-6 flex items-center gap-1.5 text-white/80 hover:text-white text-sm transition-colors"
        >
          <ArrowLeft className="size-4" />
          All courses
        </button>

        {/* Character */}
        <div className="text-[110px] leading-none select-none drop-shadow-lg">
          {course.emoji}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-8 py-10">
        <div className="grid grid-cols-3 gap-10">
          {/* Main — 2/3 */}
          <div className="col-span-2">
            <h1 className="font-heading text-4xl font-bold text-foreground mb-6">
              {course.title}
            </h1>

            {/* Meta chips */}
            <div className="flex gap-3 mb-6">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted rounded-full px-3 py-1">
                <Clock className="size-3" /> 8–16 hours
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted rounded-full px-3 py-1">
                <BookOpen className="size-3" /> 5 units
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted rounded-full px-3 py-1">
                <Mic className="size-3" /> Speech exercises
              </span>
            </div>

            {/* Description */}
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
              Full Course Description
            </p>
            <p className="text-sm text-foreground/80 leading-relaxed mb-8">
              {course.fullDescription}
            </p>

            {/* Course structure */}
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Course Structure
            </p>
            <ol className="space-y-4 mb-10">
              {course.units.map((unit, i) => (
                <li key={i}>
                  <p className="text-sm font-semibold text-foreground">
                    {i + 1}. {unit.title}
                  </p>
                  <ul className="ml-4 mt-1 space-y-0.5">
                    {unit.topics.map((topic, j) => (
                      <li key={j} className="text-xs text-muted-foreground before:content-['—'] before:mr-1.5">
                        {topic}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="dark"
                size="lg"
                onClick={() => navigate(`/courses/${courseId}/tasks`)}
              >
                Start tasks
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="border border-border"
                onClick={() => navigate(`/courses/${courseId}/theory`)}
              >
                Learn theory
              </Button>
            </div>
          </div>

          {/* Sidebar — 1/3 */}
          <div className="pt-[72px]">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Typical Tasks in This Course
            </p>
            <ul className="space-y-2.5">
              {course.typicalTasks.map((task, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/75">
                  <span
                    className="mt-1.5 size-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: course.heroTo }}
                  />
                  {task}
                </li>
              ))}
            </ul>

            {/* CTA card */}
            <div
              className="mt-8 rounded-2xl p-5 text-white"
              style={{
                background: `linear-gradient(135deg, ${course.heroFrom} 0%, ${course.heroTo} 100%)`,
              }}
            >
              <p className="font-heading font-bold text-base mb-1">Ready to practice?</p>
              <p className="text-xs text-white/80 mb-4">
                Start the first lesson now and track your progress.
              </p>
              <button
                onClick={() => navigate(`/courses/${courseId}/tasks`)}
                className="w-full bg-white/20 hover:bg-white/30 transition-colors rounded-xl py-2 text-sm font-semibold text-white"
              >
                Begin →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
