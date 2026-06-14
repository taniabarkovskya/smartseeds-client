import { useNavigate } from "react-router-dom";
import { Heart, ArrowLeft } from "lucide-react";
import { AppHeader } from "@/widgets/AppHeader/AppHeader";
import { useFavoritesStore } from "@/shared/lib/store";
import { MOCK_COURSES } from "@/shared/api/mockData";

interface CourseDisplay {
  id: string;
  title: string;
  image: string;
  level: string;
  difficulty: string;
  hours: number;
  bg: string;
}

const COURSE_META: CourseDisplay[] = [
  { id: "1", title: "Sound Pronunciation: Beginner Level",   image: "🌱", level: "Beginner",     difficulty: "Easy",   hours: 4,  bg: "#E8D5F5" },
  { id: "2", title: "Differentiating Opposing Phonemes",     image: "🔤", level: "Intermediate", difficulty: "Normal", hours: 8,  bg: "#D5EBD0" },
  { id: "3", title: "Developing Connected Speech",           image: "📖", level: "Intermediate", difficulty: "Normal", hours: 12, bg: "#FCE4CC" },
  { id: "4", title: "Expanding Vocabulary",                  image: "📚", level: "Beginner",     difficulty: "Easy",   hours: 6,  bg: "#D5E8F5" },
  { id: "5", title: "Automating Sounds in Sentences",        image: "🎯", level: "Advanced",     difficulty: "Hard",   hours: 16, bg: "#F5EBD5" },
  { id: "6", title: "Grammar Structure of Language",         image: "📝", level: "Advanced",     difficulty: "Hard",   hours: 10, bg: "#F5D5E8" },
];

export function FavoritesPage() {
  const navigate = useNavigate();
  const { favoriteIds, toggleFavorite } = useFavoritesStore();

  const savedCourses = COURSE_META.filter((c) => favoriteIds.includes(c.id));

  return (
    <div className="min-h-screen bg-[#9590B8]">
      <AppHeader />

      <main className="px-8 pb-12 pt-2">
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={() => navigate("/courses")}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-foreground transition-colors hover:bg-white/35"
            aria-label="Back to courses"
          >
            <ArrowLeft className="size-4" />
          </button>
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground">Saved Courses</h1>
            <p className="mt-0.5 text-sm text-foreground/70">
              {savedCourses.length} {savedCourses.length === 1 ? "course" : "courses"} saved
            </p>
          </div>
        </div>

        {savedCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white/15 py-24 text-center">
            <Heart className="mx-auto mb-4 size-10 text-foreground/30" strokeWidth={1.5} />
            <p className="font-heading text-lg font-semibold text-foreground">No saved courses yet</p>
            <p className="mt-1 text-sm text-foreground/60">
              Tap the heart icon on any course to save it here.
            </p>
            <button
              onClick={() => navigate("/courses")}
              className="mt-6 rounded-xl bg-white px-6 py-2.5 text-sm font-medium text-foreground shadow-sm transition-opacity hover:opacity-80"
            >
              Browse courses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-5">
            {savedCourses.map((course) => {
              const isFav = favoriteIds.includes(course.id);
              return (
                <div
                  key={course.id}
                  className="relative rounded-2xl bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <button
                    onClick={() => navigate(`/courses/${course.id}`)}
                    className="w-full text-left"
                  >
                    <div
                      className="flex h-36 items-center justify-center text-5xl"
                      style={{ backgroundColor: course.bg }}
                    >
                      {course.image}
                    </div>
                    <div className="p-4">
                      <p className="font-heading font-semibold text-foreground text-sm leading-tight mb-1 line-clamp-2">
                        {course.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {course.hours}h · {course.level} · {course.difficulty}
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => toggleFavorite(course.id)}
                    aria-label="Remove from saved"
                    className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-sm transition-transform hover:scale-110"
                  >
                    <Heart
                      className="size-4 transition-colors"
                      fill={isFav ? "#ef4444" : "none"}
                      stroke={isFav ? "#ef4444" : "#6b7280"}
                      strokeWidth={1.75}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
