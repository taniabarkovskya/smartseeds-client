import type { Course, Task } from "@/entities/course/model/types";
import type { CompetencyVectorValues } from "@/shared/lib/adaptiveAlgorithm";

export const MOCK_COURSES: Course[] = [
  {
    id: "1",
    code: "CRS-01",
    title: "Sound Pronunciation: Beginner Level",
    description: "Correcting pronunciation of individual phonemes for children aged 4–6",
  },
  {
    id: "2",
    code: "CRS-02",
    title: "Differentiating Opposing Phonemes",
    description: "Distinguishing sound pairs: [s]–[sh], [r]–[l], [b]–[p]",
  },
  {
    id: "3",
    code: "CRS-03",
    title: "Developing Connected Speech",
    description: "Exercises in building sentences and short narratives",
  },
  {
    id: "4",
    code: "CRS-04",
    title: "Expanding Vocabulary",
    description: "Broadening the child's active and passive vocabulary",
  },
  {
    id: "5",
    code: "CRS-05",
    title: "Automating Sounds in Sentences",
    description: "Reinforcing correct pronunciation of sounds in connected speech",
  },
  {
    id: "6",
    code: "CRS-06",
    title: "Grammar Structure of Language",
    description: "Learning grammatical forms and word agreement in sentences",
  },
];

export const MOCK_TASKS: Task[] = [
  {
    id: "task-1",
    module_id: "mod-1",
    code: "CRS-01-MOD-01-TSK-01",
    complexity: 0.2,
    content_json: {
      text: "Pronounce the word: СОК",
      expected_word: "сок",
      instruction: "Say the sound [S] clearly",
    },
  },
  {
    id: "task-2",
    module_id: "mod-1",
    code: "CRS-01-MOD-01-TSK-02",
    complexity: 0.4,
    content_json: {
      text: "Pronounce the word: ШАПКА",
      expected_word: "шапка",
      instruction: "Pay attention to the sound [SH]",
    },
  },
  {
    id: "task-3",
    module_id: "mod-1",
    code: "CRS-01-MOD-01-TSK-03",
    complexity: 0.6,
    content_json: {
      text: "Pronounce the word: ЛИСИЦЯ",
      expected_word: "лисиця",
      instruction: "Pay attention to the sound [L]",
    },
  },
];

export const MOCK_VECTOR: CompetencyVectorValues = {
  phonetics: 0.4,
  lexical: 0.55,
  grammar: 0.3,
};
