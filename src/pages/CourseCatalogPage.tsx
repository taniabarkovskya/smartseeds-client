import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import { AppHeader } from "@/widgets/AppHeader/AppHeader";
import { getCourses } from "@/entities/course/api/courseApi";
import { MOCK_COURSES } from "@/shared/api/mockData";
import type { Course } from "@/entities/course/model/types";

// Extended mock with extra metadata for display
interface CourseDisplay extends Course {
  level: "Beginner" | "Intermediate" | "Advanced";
  difficulty: "Easy" | "Normal" | "Hard";
  size: "Short" | "Medium" | "Large";
  hours: number;
  image: string;
  keywords: string[];
}

const COURSE_META: CourseDisplay[] = [
  {
    ...MOCK_COURSES[0],
    level: "Beginner",
    difficulty: "Easy",
    size: "Short",
    hours: 4,
    image: "🌱",
    keywords: ["phonetics", "sounds", "pronunciation"],
  },
  {
    ...MOCK_COURSES[1],
    level: "Intermediate",
    difficulty: "Normal",
    size: "Medium",
    hours: 8,
    image: "🔤",
    keywords: ["differentiation", "phonemes", "pairs"],
  },
  {
    ...MOCK_COURSES[2],
    level: "Intermediate",
    difficulty: "Normal",
    size: "Large",
    hours: 12,
    image: "📖",
    keywords: ["connected speech", "sentences", "narrative"],
  },
  {
    ...MOCK_COURSES[3],
    level: "Beginner",
    difficulty: "Easy",
    size: "Medium",
    hours: 6,
    image: "📚",
    keywords: ["vocabulary", "lexical", "words"],
  },
  {
    ...MOCK_COURSES[4],
    level: "Advanced",
    difficulty: "Hard",
    size: "Large",
    hours: 16,
    image: "🎯",
    keywords: ["automation", "sentences", "speech"],
  },
  {
    ...MOCK_COURSES[5],
    level: "Advanced",
    difficulty: "Hard",
    size: "Medium",
    hours: 10,
    image: "📝",
    keywords: ["grammar", "agreement", "forms"],
  },
];

const CARD_COLORS = ["#E8D5F5", "#D5EBD0", "#FCE4CC", "#D5E8F5", "#F5EBD5", "#F5D5E8"];

const LEVELS = ["Beginner A0-A2", "Intermediate B1-B2", "Advanced C1-C2"] as const;
const DIFFICULTIES = ["Easy", "Normal", "Hard"] as const;
const SIZES = ["Short", "Medium", "Large"] as const;
type SortKey = "New" | "Popular" | "Relevant" | "Rating";

export function CourseCatalogPage() {
  const navigate = useNavigate();

  const { data: dbCourses } = useQuery<Course[]>({
    queryKey: ["courses"],
    queryFn: getCourses,
    retry: false,
  });

  // Merge DB courses into display list
  const allCourses = useMemo<CourseDisplay[]>(() => {
    if (!dbCourses || dbCourses.length === 0) return COURSE_META;
    return dbCourses.map((c, i) => {
      const meta = COURSE_META[i] ?? COURSE_META[0];
      return { ...meta, ...c };
    });
  }, [dbCourses]);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("New");
  const [activeKeywords, setActiveKeywords] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [maxHours, setMaxHours] = useState(100);

  // Collect all unique keywords
  const allKeywords = useMemo(() => {
    const set = new Set<string>();
    allCourses.forEach((c) => c.keywords.forEach((k) => set.add(k)));
    return [...set];
  }, [allCourses]);

  const toggleFilter = <T extends string>(
    _list: T[],
    setList: React.Dispatch<React.SetStateAction<T[]>>,
    value: T,
  ) => {
    setList((prev) =>
      prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value],
    );
  };

  const filtered = useMemo(() => {
    return allCourses.filter((c) => {
      if (search && !c.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (activeKeywords.length > 0 && !activeKeywords.some((k) => c.keywords.includes(k)))
        return false;
      if (selectedLevels.length > 0) {
        const levelMatch = selectedLevels.some((l) => l.startsWith(c.level));
        if (!levelMatch) return false;
      }
      if (selectedDifficulties.length > 0 && !selectedDifficulties.includes(c.difficulty))
        return false;
      if (selectedSizes.length > 0 && !selectedSizes.includes(c.size)) return false;
      if (c.hours > maxHours) return false;
      return true;
    });
  }, [allCourses, search, activeKeywords, selectedLevels, selectedDifficulties, selectedSizes, maxHours]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (sort === "Rating") arr.sort((a, b) => b.hours - a.hours);
    else if (sort === "Popular") arr.sort((a, b) => a.difficulty.localeCompare(b.difficulty));
    return arr;
  }, [filtered, sort]);

  return (
    <div className="min-h-screen bg-[#9590B8]">
      <AppHeader />

      <div className="flex gap-0 px-8 pb-10 pt-2" style={{ minHeight: "calc(100vh - 72px)" }}>
        {/* Sidebar */}
        <aside className="w-60 shrink-0 bg-white/20 backdrop-blur-sm rounded-2xl p-5 mr-6 self-start sticky top-6">
          {/* Keywords */}
          <div className="mb-5">
            <p className="font-heading font-semibold text-foreground text-sm mb-3">Keywords</p>
            <div className="flex flex-wrap gap-1.5">
              {allKeywords.map((kw) => (
                <button
                  key={kw}
                  onClick={() => toggleFilter(activeKeywords, setActiveKeywords, kw)}
                  className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border transition-colors ${
                    activeKeywords.includes(kw)
                      ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                      : "bg-white/70 text-foreground border-border hover:bg-white"
                  }`}
                >
                  {kw}
                  {activeKeywords.includes(kw) && <X className="size-2.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* Level */}
          <div className="mb-5">
            <p className="font-heading font-semibold text-foreground text-sm mb-2">Level</p>
            <div className="space-y-1.5">
              {LEVELS.map((level) => (
                <label key={level} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedLevels.includes(level)}
                    onChange={() => toggleFilter(selectedLevels, setSelectedLevels, level)}
                    className="rounded accent-[#1a1a1a] size-3.5"
                  />
                  <span className="text-xs text-foreground">{level}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Hours */}
          <div className="mb-5">
            <p className="font-heading font-semibold text-foreground text-sm mb-2">
              Hours to complete:{" "}
              <span className="font-normal">{maxHours === 100 ? "Any" : `≤${maxHours}h`}</span>
            </p>
            <input
              type="range"
              min={1}
              max={100}
              value={maxHours}
              onChange={(e) => setMaxHours(Number(e.target.value))}
              className="w-full accent-[#1a1a1a]"
            />
            <div className="flex justify-between text-xs text-foreground/50 mt-0.5">
              <span>0</span>
              <span>100</span>
            </div>
          </div>

          {/* Difficulty */}
          <div className="mb-5">
            <p className="font-heading font-semibold text-foreground text-sm mb-2">Difficulty</p>
            <div className="space-y-1.5">
              {DIFFICULTIES.map((d) => (
                <label key={d} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedDifficulties.includes(d)}
                    onChange={() => toggleFilter(selectedDifficulties, setSelectedDifficulties, d)}
                    className="rounded accent-[#1a1a1a] size-3.5"
                  />
                  <span className="text-xs text-foreground">{d}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Size */}
          <div>
            <p className="font-heading font-semibold text-foreground text-sm mb-2">Size</p>
            <div className="space-y-1.5">
              {SIZES.map((s) => (
                <label key={s} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedSizes.includes(s)}
                    onChange={() => toggleFilter(selectedSizes, setSelectedSizes, s)}
                    className="rounded accent-[#1a1a1a] size-3.5"
                  />
                  <span className="text-xs text-foreground">{s}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Search + sort */}
          <div className="mb-5">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-foreground/50" />
              <input
                type="text"
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/30 backdrop-blur-sm text-foreground placeholder:text-foreground/50 text-sm border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>

            <div className="flex gap-2">
              {(["New", "Popular", "Relevant", "Rating"] as SortKey[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSort(tab)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    sort === tab
                      ? "bg-[#1a1a1a] text-white"
                      : "bg-white/30 text-foreground hover:bg-white/50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Course grid */}
          {sorted.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-60 text-foreground/60">
              <p className="text-lg font-heading">No courses found</p>
              <p className="text-sm mt-1">Try adjusting your filters or search query</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-5">
              {sorted.map((course, i) => (
                <button
                  key={course.id}
                  onClick={() => navigate(`/courses/${course.id}`)}
                  className="text-left bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Card image area */}
                  <div
                    className="h-36 flex items-center justify-center text-5xl"
                    style={{ backgroundColor: CARD_COLORS[i % CARD_COLORS.length] }}
                  >
                    {course.image}
                  </div>

                  {/* Card content */}
                  <div className="p-4">
                    <p className="font-heading font-semibold text-foreground text-sm leading-tight mb-1 line-clamp-2">
                      {course.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{course.hours}h · {course.level} · {course.difficulty}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
