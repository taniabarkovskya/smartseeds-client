// ─── Course detail ────────────────────────────────────────────────────────────

export interface CourseDetail {
  id: string;
  emoji: string;
  heroFrom: string;
  heroTo: string;
  title: string;
  fullDescription: string;
  units: { title: string; topics: string[] }[];
  typicalTasks: string[];
}

export const MOCK_COURSE_DETAILS: Record<string, CourseDetail> = {
  "1": {
    id: "1",
    emoji: "🦋",
    heroFrom: "#F5C2C7",
    heroTo: "#9590B8",
    title: "Sound Pronunciation: Beginner Level",
    fullDescription:
      '"Sound Pronunciation" takes learners on a playful journey through the basics of speech clarity. Every lesson introduces a set of sounds with visual cues and engaging exercises, allowing children to build confidence in speaking naturally while practicing correct articulation and usage.',
    units: [
      {
        title: "Unit 1: Vowel Sounds",
        topics: ["Short vowels: a, e, i, o, u", 'Simple sentences with vowel focus'],
      },
      {
        title: "Unit 2: Consonant Pairs",
        topics: ["Voiced vs voiceless: b/p, d/t, g/k", "Seasonal activities vocabulary"],
      },
      {
        title: "Unit 3: Blends & Clusters",
        topics: ["bl, cl, fl, pl, sl sounds", "Dress-the-character activity"],
      },
      {
        title: "Unit 4: Word Stress",
        topics: ["Stress in two-syllable words", "Simple stress phrases"],
      },
      {
        title: "Unit 5: Sentence Rhythm",
        topics: ["run, jump, read, draw", "Short task-based sentences"],
      },
    ],
    typicalTasks: [
      "Image-based choosing tasks",
      "Matching word to picture",
      "Fill the missing word",
      "Short listening comprehension",
      "Labeling items in a scene",
      "Vocabulary quizzes",
      'Simple writing prompts ("My favorite sound is...")',
    ],
  },
  "2": {
    id: "2",
    emoji: "🔊",
    heroFrom: "#B8D4F5",
    heroTo: "#6B8EAA",
    title: "Differentiating Opposing Phonemes",
    fullDescription:
      "This course trains learners to distinguish between similar-sounding phoneme pairs. Through targeted listening and speaking exercises, children develop sharp auditory discrimination skills essential for clear, confident communication.",
    units: [
      { title: "Unit 1: S vs SH", topics: ["Minimal pairs: sip/ship, sea/she", "Listening drills"] },
      { title: "Unit 2: R vs L", topics: ["Tongue position for R and L", "Word-pair practice"] },
      { title: "Unit 3: B vs P", topics: ["Voiced and voiceless bilabials", "Sentence-level practice"] },
      { title: "Unit 4: T vs D", topics: ["Touch and hold method", "Dictation exercises"] },
      { title: "Unit 5: Mixed Review", topics: ["Combining all pairs", "Story-based practice"] },
    ],
    typicalTasks: [
      "Minimal pair listening tasks",
      "Sorting words into sound categories",
      "Speech recording and playback",
      "Sentence repetition drills",
      "Error identification tasks",
      "Phoneme quizzes",
      "Storytelling with target sounds",
    ],
  },
  "3": {
    id: "3",
    emoji: "📖",
    heroFrom: "#F5E6C6",
    heroTo: "#C6A870",
    title: "Developing Connected Speech",
    fullDescription:
      "Build the ability to form complete, coherent sentences and short stories. This course bridges isolated word practice and fluent speech, focusing on logical sequencing, linking words, and expressive delivery.",
    units: [
      { title: "Unit 1: Building Sentences", topics: ["Subject + Verb + Object", "Simple sentence patterns"] },
      { title: "Unit 2: Linking Words", topics: ["and, but, because, so", "Connecting ideas"] },
      { title: "Unit 3: Short Narratives", topics: ["Telling a story with pictures", "Sequence words: first, then, finally"] },
      { title: "Unit 4: Descriptions", topics: ["Describing people, places, objects", "Adjective practice"] },
      { title: "Unit 5: Conversations", topics: ["Question and answer practice", "Dialogue role-play"] },
    ],
    typicalTasks: [
      "Sentence building from word cards",
      "Picture-based storytelling",
      "Gap-fill with linking words",
      "Sentence ordering tasks",
      "Record-and-replay activities",
      "Role-play dialogues",
      "Short paragraph writing",
    ],
  },
  "4": {
    id: "4",
    emoji: "📚",
    heroFrom: "#C6F5D4",
    heroTo: "#5AA876",
    title: "Expanding Vocabulary",
    fullDescription:
      "Build a rich vocabulary through contextual learning, visual associations, and spaced repetition. Each lesson introduces new words in meaningful contexts so learners can actively use them in everyday speech.",
    units: [
      { title: "Unit 1: Everyday Objects", topics: ["Home, school, and outdoor vocabulary", "Word-to-picture matching"] },
      { title: "Unit 2: Action Words", topics: ["Common verbs in context", "Verb + noun collocations"] },
      { title: "Unit 3: Describing Words", topics: ["Colors, sizes, shapes, feelings", "Adjective practice"] },
      { title: "Unit 4: Categories & Groups", topics: ["Food, animals, transport, nature", "Semantic mapping"] },
      { title: "Unit 5: Review & Extension", topics: ["Spaced repetition review", "Creative word use"] },
    ],
    typicalTasks: [
      "Word-picture matching",
      "Category sorting tasks",
      "Fill-in-the-blank sentences",
      "Synonym and antonym quizzes",
      "Vocabulary dictation",
      "Word association games",
      "Personalized sentence creation",
    ],
  },
  "5": {
    id: "5",
    emoji: "🎯",
    heroFrom: "#F5C6E8",
    heroTo: "#C68AB8",
    title: "Automating Sounds in Sentences",
    fullDescription:
      "Reinforce correct pronunciation at the sentence level through drill-and-practice activities. This course helps transfer mastered sounds from isolated words into natural, fluent connected speech.",
    units: [
      { title: "Unit 1: Phrases & Chunks", topics: ["High-frequency phrases", "Chunk-based fluency drills"] },
      { title: "Unit 2: Simple Sentences", topics: ["Target sounds in subject-verb sentences", "Repetition techniques"] },
      { title: "Unit 3: Complex Sentences", topics: ["Subordinate clauses with target sounds", "Pacing and rhythm"] },
      { title: "Unit 4: Dialogues", topics: ["Conversational sentence practice", "Turn-taking drills"] },
      { title: "Unit 5: Free Speech", topics: ["Unscripted topic talk", "Self-monitoring skills"] },
    ],
    typicalTasks: [
      "Repeat-after-me recordings",
      "Sentence completion tasks",
      "Speed reading passages",
      "Dialogue practice activities",
      "Pronunciation self-assessment",
      "Rhythm and stress exercises",
      "Timed speaking challenges",
    ],
  },
  "6": {
    id: "6",
    emoji: "📝",
    heroFrom: "#D4C6F5",
    heroTo: "#6B5FA6",
    title: "Grammar Structure of Language",
    fullDescription:
      '"Grammar Starter" introduces learners to the building blocks of English sentences with friendly explanations and lots of practice. Each topic is covered one step at a time so practice feels natural, and English starts to click!',
    units: [
      { title: "Unit 1: Nouns & Articles", topics: ["a, an, the — when and why", "Singular and plural forms"] },
      { title: "Unit 2: Pronouns", topics: ["I, you, he, she, it, we, they", "Subject vs object pronouns"] },
      { title: "Unit 3: Verbs & To Be", topics: ["am, is, are in statements and questions", "Was and were (past)"] },
      { title: "Unit 4: Simple Present", topics: ["Daily routines and habits", "He/she/it: adding -s"] },
      { title: "Unit 5: Adjectives", topics: ["Describing with adjectives", "Word order: adjective + noun"] },
    ],
    typicalTasks: [
      "Article choice exercises (a/an/the)",
      "Pronoun substitution tasks",
      "Fill-in-the-blank grammar drills",
      "Sentence correction tasks",
      "True / False grammar statements",
      "Build-a-sentence activities",
      "Short grammar dictations",
    ],
  },
};

// ─── Theory content ────────────────────────────────────────────────────────────

export interface TheorySection {
  title: string;
  body: string;
  examples?: string[];
}

export interface TheoryContent {
  pageTitle: string;
  intro: string;
  sections: TheorySection[];
  bannerHeading: string;
  bannerSubtitle: string;
}

export const MOCK_THEORY: Record<string, TheoryContent> = {
  default: {
    pageTitle: "Friendly Grammar Starter – Theory Page",
    intro:
      "Welcome to your grammar adventure! In this course, you'll learn the most important building blocks of English grammar. Each topic is explained in a simple and fun way, with examples to help you remember the rules. A learning journey doesn't have to be hard. We explore one step at a time so you can practice, notice patterns, and use English in everyday situations. Let's begin!",
    sections: [
      {
        title: "Nouns & Articles (a / an)",
        body: 'Nouns are words for people, animals, and things. We use a before a word that starts with a consonant sound, and an before a vowel sound. The definite article the refers to something specific.',
        examples: ['a cat, an apple, the sun', 'She is a teacher.', 'I ate an orange.'],
      },
      {
        title: "Pronouns (I, you, he, she…)",
        body: "Pronouns replace nouns so we don't repeat the same word. Subject pronouns come before the verb; object pronouns come after verbs and prepositions.",
        examples: ['She gave it to him.', 'We love them.', 'He called me.'],
      },
      {
        title: 'Verbs & "to be" (am, is, are)',
        body: 'Use am with I, is with he/she/it, and are with you/we/they. In the past: was (I/he/she/it) and were (you/we/they). These are the most common verbs in English.',
        examples: ['I am happy.', 'She is a student.', 'They were at the park.'],
      },
      {
        title: "Simple Present (daily actions)",
        body: "Use the simple present for habits, facts, and routines. Add -s or -es when the subject is he, she, or it. Use do/does to form questions and negatives.",
        examples: ['I walk to school.', 'She watches TV every evening.', 'He doesn\'t like spinach.'],
      },
      {
        title: "Adjectives & Word Order",
        body: "Adjectives describe nouns and usually come before the noun in English. You can stack multiple adjectives, but follow the order: opinion → size → color → origin → material.",
        examples: ['a big red ball', 'a lovely old Italian clock', 'She has long dark hair.'],
      },
    ],
    bannerHeading: "Grammar helps you grow",
    bannerSubtitle: "Learn the rules step by step and start building beautiful sentences!",
  },
  "1": {
    pageTitle: "Sound Pronunciation — Theory Guide",
    intro:
      "Understanding how sounds are produced is the first step to speaking clearly. In this guide you'll discover how English vowels and consonants are formed, where to place your tongue and lips, and how to practice sounds confidently.",
    sections: [
      {
        title: "Vowel Sounds",
        body: "English has 5 vowel letters (a, e, i, o, u) but many more vowel sounds. Short vowels appear in words like cat, bed, sit, hot, cup. Long vowels say their letter name: cake, see, time, note, tune.",
        examples: ['cat vs cake', 'bit vs bite', 'hop vs hope'],
      },
      {
        title: "Consonant Pairs",
        body: "Many consonants come in voiced/voiceless pairs. The only difference is whether your vocal cords vibrate. Place your hand on your throat to feel the difference.",
        examples: ['p (voiceless) vs b (voiced)', 't vs d', 'f vs v', 's vs z'],
      },
      {
        title: "Blends & Clusters",
        body: "Blends are two consonants side by side where you hear both sounds. They appear at the start (initial blends) or end (final blends) of words.",
        examples: ['bl- : black, blue, blend', 'cl- : clock, clean', '-st : fast, list'],
      },
      {
        title: "Word Stress",
        body: "Every word with more than one syllable has one stressed syllable pronounced louder and longer. Stressing the wrong syllable can cause misunderstandings.",
        examples: ["PREsent (noun) vs preSENT (verb)", "PHOto vs phoTOgraphy"],
      },
      {
        title: "Sentence Rhythm",
        body: "English is a stress-timed language. Content words (nouns, main verbs, adjectives) are stressed; function words (a, the, to, and) are often reduced.",
        examples: ["I WANT to GO to the STORE.", "She CAN'T COME to the PARTY."],
      },
    ],
    bannerHeading: "Pronunciation builds confidence",
    bannerSubtitle: "Master one sound at a time and watch your speech transform!",
  },
};

// Fallback theory for courses without custom content
MOCK_THEORY["2"] = { ...MOCK_THEORY.default, pageTitle: "Differentiating Phonemes — Theory Guide" };
MOCK_THEORY["3"] = { ...MOCK_THEORY.default, pageTitle: "Connected Speech — Theory Guide" };
MOCK_THEORY["4"] = { ...MOCK_THEORY.default, pageTitle: "Vocabulary Building — Theory Guide" };
MOCK_THEORY["5"] = { ...MOCK_THEORY.default, pageTitle: "Sound Automation — Theory Guide" };
MOCK_THEORY["6"] = { ...MOCK_THEORY.default };

// ─── Exercises ────────────────────────────────────────────────────────────────

export interface MCQExercise {
  kind: "multiple-choice";
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface TFExercise {
  kind: "true-false";
  id: string;
  statement: string;
  correct: boolean;
  explanation: string;
}

export interface FillBlankItem {
  id: string;
  before: string;
  after: string;
  answer: string;
}

export interface FillBlankExercise {
  kind: "fill-blank";
  id: string;
  title: string;
  instruction: string;
  sentences: FillBlankItem[];
}

export interface SpeechWordExercise {
  kind: "speech-word";
  id: string;
  word: string;
  phonetic: string;
  translation: string;
  example: string;
}

export interface SpeechSentenceExercise {
  kind: "speech-sentence";
  id: string;
  sentence: string;
  hint: string;
}

export interface DictationExercise {
  kind: "dictation";
  id: string;
  text: string;
}

export type Exercise =
  | MCQExercise
  | TFExercise
  | FillBlankExercise
  | SpeechWordExercise
  | SpeechSentenceExercise
  | DictationExercise;

export const MOCK_EXERCISES: Exercise[] = [
  {
    kind: "multiple-choice",
    id: "ex-1",
    question: "Which of the following is the correct plural form?",
    options: ["childs", "mouses", "oxen", "leafs"],
    correct: 2,
    explanation: '"Oxen" is the irregular plural of "ox". The others follow regular rules: children, mice, leaves.',
  },
  {
    kind: "true-false",
    id: "ex-2",
    statement: 'The sentence "She don\'t like coffee." is grammatically correct.',
    correct: false,
    explanation: 'Incorrect. With he/she/it in Present Simple, use "doesn\'t": She doesn\'t like coffee.',
  },
  {
    kind: "fill-blank",
    id: "ex-3",
    title: "Fill in the blanks: Past Simple vs Present Perfect",
    instruction: "Complete the sentences with the correct form of the verb in brackets.",
    sentences: [
      { id: "s1", before: "I", after: "my homework yet. (not / finish)", answer: "haven't finished" },
      { id: "s2", before: "We", after: "to Paris last summer. (go)", answer: "went" },
      { id: "s3", before: "She", after: "three cups of coffee today. (drink)", answer: "has drunk" },
      { id: "s4", before: "The film", after: "at 8 p.m. yesterday. (start)", answer: "started" },
      { id: "s5", before: "They", after: "here since 2020. (live)", answer: "have lived" },
      { id: "s6", before: "He", after: "his keys this morning. (lose)", answer: "lost" },
      { id: "s7", before: "I", after: "never sushi before. (try)", answer: "have never tried" },
    ],
  },
  {
    kind: "speech-word",
    id: "ex-4",
    word: "pronunciation",
    phonetic: "/prəˌnʌnsiˈeɪʃən/",
    translation: "the way in which a word or language is spoken",
    example: "Good pronunciation makes you much easier to understand.",
  },
  {
    kind: "speech-sentence",
    id: "ex-5",
    sentence: "She sells seashells by the seashore.",
    hint: 'Focus on the "sh" and "s" sounds — say it slowly first, then pick up speed!',
  },
  {
    kind: "dictation",
    id: "ex-6",
    text: "The quick brown fox jumps over the lazy dog near the river bank.",
  },
];
