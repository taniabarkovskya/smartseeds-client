import type { Course, Task } from "@/entities/course/model/types";
import type { CompetencyVectorValues } from "@/shared/lib/adaptiveAlgorithm";

export const MOCK_COURSES: Course[] = [
  {
    id: "1",
    code: "CRS-01",
    title: "Звуковимова: базовий рівень",
    description: "Корекція вимови окремих фонем для дітей 4–6 років",
  },
  {
    id: "2",
    code: "CRS-02",
    title: "Диференціація опозиційних фонем",
    description: "Розрізнення пар звуків: [с]–[ш], [р]–[л], [б]–[п]",
  },
];

export const MOCK_TASKS: Task[] = [
  {
    id: "task-1",
    module_id: "mod-1",
    code: "CRS-01-MOD-01-TSK-01",
    complexity: 0.2,
    content_json: {
      text: "Вимов слово: СОК",
      expected_word: "сок",
      instruction: "Скажи чітко звук [С]",
    },
  },
  {
    id: "task-2",
    module_id: "mod-1",
    code: "CRS-01-MOD-01-TSK-02",
    complexity: 0.4,
    content_json: {
      text: "Вимов слово: ШАПКА",
      expected_word: "шапка",
      instruction: "Зверни увагу на звук [Ш]",
    },
  },
  {
    id: "task-3",
    module_id: "mod-1",
    code: "CRS-01-MOD-01-TSK-03",
    complexity: 0.6,
    content_json: {
      text: "Вимов слово: ЛИСИЦЯ",
      expected_word: "лисиця",
      instruction: "Зверни увагу на звук [Л]",
    },
  },
];

export const MOCK_VECTOR: CompetencyVectorValues = {
  phonetics: 0.4,
  lexical: 0.55,
  grammar: 0.3,
};