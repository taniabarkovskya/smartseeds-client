import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AppHeader } from "@/widgets/AppHeader/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/shared/api/supabase";
import { getCourses } from "@/entities/course/api/courseApi";
import { getActivitiesByUser } from "@/entities/activity/api/activityApi";
import { getCompetencyVector } from "@/entities/user/api/userApi";
import { MOCK_COURSES } from "@/shared/api/mockData";
import type { Course } from "@/entities/course/model/types";

const CARD_ACCENTS = [
  { bg: "#E8D5F5", emoji: "📖" },
  { bg: "#D5EBD0", emoji: "🦉" },
  { bg: "#FCE4CC", emoji: "⭐" },
];

export function DashboardPage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState("User");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserId(data.user.id);
        const name =
          (data.user.user_metadata?.full_name as string | undefined) ??
          data.user.email?.split("@")[0] ??
          "User";
        setDisplayName(name);
      }
    });
  }, []);

  const { data: courses } = useQuery({
    queryKey: ["courses"],
    queryFn: getCourses,
  });

  const { data: activities } = useQuery({
    queryKey: ["activities", userId],
    queryFn: () => getActivitiesByUser(userId!),
    enabled: !!userId,
  });

  const { data: vectorRecord } = useQuery({
    queryKey: ["vector", userId],
    queryFn: () => getCompetencyVector(userId!),
    enabled: !!userId,
  });

  const displayCourses: Course[] =
    courses && courses.length > 0 ? courses.slice(0, 3) : MOCK_COURSES.slice(0, 3);

  const tasksCompleted = activities?.length ?? 0;
  const modulesCompleted = new Set(activities?.map((a) => a.task_id)).size;
  const vector = vectorRecord?.pu_vector ?? { phonetics: 0, lexical: 0, grammar: 0 };

  return (
    <div className="min-h-screen bg-[#9590B8]">
      <AppHeader />

      <main className="px-8 py-8 max-w-5xl mx-auto">
        {/* Hero */}
        <section className="text-center mb-10">
          <h1 className="font-heading text-5xl font-bold text-foreground mb-2">
            Welcome, {displayName}
          </h1>
          <p className="text-base text-foreground/80">Ready to learn today?</p>
          <p className="text-base text-foreground/80 mb-6">
            Check recommended materials below (AI suggestions)
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="dark" size="lg" onClick={() => navigate("/courses")}>
              Go to learning
            </Button>
            <Button variant="outline" size="lg">
              Ask AI
            </Button>
          </div>
        </section>

        {/* Course cards */}
        <section className="grid grid-cols-3 gap-4 mb-10">
          {displayCourses.map((course, i) => {
            const accent = CARD_ACCENTS[i % CARD_ACCENTS.length];
            return (
              <Card
                key={course.id}
                className="cursor-pointer overflow-hidden hover:shadow-md transition-shadow"
                onClick={() => navigate("/courses")}
              >
                <CardContent className="p-5">
                  <h3 className="font-heading font-bold text-[15px] mb-1 leading-snug">
                    {course.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                    {course.description}
                  </p>
                  <div
                    className="h-28 rounded-xl flex items-center justify-center text-5xl select-none"
                    style={{ backgroundColor: accent.bg }}
                  >
                    {accent.emoji}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>

        {/* Progress */}
        <section>
          <h2 className="font-heading text-2xl font-bold text-foreground text-center mb-6">
            Your recent progress ↓
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {/* Left: stat cards */}
            <div className="flex flex-col gap-4">
              <Card>
                <CardContent className="p-5">
                  <p className="font-medium text-foreground">
                    Tasks completed: {tasksCompleted}
                  </p>
                  <p className="font-medium text-foreground mt-2">
                    Modules completed: {modulesCompleted}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <p className="font-medium text-foreground">🔥 Current streak</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Продовжуй навчання щодня!
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Right: competency vector */}
            <Card>
              <CardContent className="p-5">
                <h3 className="font-heading font-bold text-base mb-5">
                  Streak Growth Race
                </h3>
                {(
                  [
                    { label: "Фонетика", value: vector.phonetics, color: "#4F86C6" },
                    { label: "Лексика", value: vector.lexical, color: "#67C99E" },
                    { label: "Граматика", value: vector.grammar, color: "#F7A84A" },
                  ] as const
                ).map(({ label, value, color }) => (
                  <div key={label} className="mb-4">
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-medium">{label}</span>
                      <span className="text-muted-foreground">
                        {Math.round(value * 100)}%
                      </span>
                    </div>
                    <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.max(value * 100, 3)}%`,
                          backgroundColor: color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
