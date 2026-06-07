# CLAUDE.md — SmartSeeds Client (MVP)

> Це настановний документ для Claude Code. Він описує архітектуру, технології, структуру проєкту та правила розробки MVP клієнтської частини інформаційної системи SmartSeeds.
> Завжди звертайся до цього файлу перед написанням будь-якого коду.

---

## Що таке SmartSeeds

SmartSeeds — інформаційна система для **розвитку мовлення дітей** (4–10 років).  
Система автоматично підбирає мовленнєві вправи під кожну дитину на основі:

- **ASR** (Automatic Speech Recognition) — розпізнавання вимови через Web Speech API / Whisper
- **NLP** + AI-оцінювання — аналіз якості відповіді через LLM
- **Адаптивного алгоритму** — вектор компетенцій Pu = (ru, lu, gu) оновлюється після кожної спроби

Користувачі системи:

- **Учень** — дитина, яка проходить вправи
- **Вчитель** — логопед або педагог, керує контентом і переглядає аналітику
- **Адміністратор** — повне управління системою

---

## Scope MVP (що реалізується зараз)

MVP охоплює один наскрізний сценарій:

1. Авторизація / реєстрація (учень або вчитель)
2. Головний екран — каталог курсів та модулів
3. Екран вправи — текстове завдання + запис вимови через мікрофон
4. Автоматична перевірка — ASR розшифровує, AI оцінює, рахується бал
5. Екран результату — показується бал, оновлений прогрес (вектор Pu)
6. Дашборд прогресу — три показники: Вимова (ru), Лексика (lu), Граматика (gu)

Інші екрани (адмін-панель, звіти, сертифікати) — заглушки або відсутні.

---

## Технологічний стек (СТРОГО дотримуватись)

| Шар            | Технологія                                     | Примітки                                                |
| -------------- | ---------------------------------------------- | ------------------------------------------------------- |
| Збірка         | **Vite**                                       | `npm create vite@latest`, template `react-ts`           |
| UI-бібліотека  | **React 18** + **TypeScript**                  | Строга типізація, `strict: true` у tsconfig             |
| Стилі          | **Tailwind CSS v3**                            | Utility-first, без CSS-модулів                          |
| UI-компоненти  | **shadcn/ui**                                  | Встановлювати через `npx shadcn@latest add <component>` |
| Роутинг        | **React Router v6**                            | `createBrowserRouter`, `RouterProvider`                 |
| Стан           | **Zustand**                                    | Для глобального стану (auth, user, currentTask)         |
| Серверний стан | **TanStack Query (React Query v5)**            | Для запитів до API/БД                                   |
| База даних     | **Supabase** (PostgreSQL)                      | `@supabase/supabase-js`, реальне підключення            |
| ASR            | **Web Speech API**                             | `SpeechRecognition`, мова `uk-UA`                       |
| AI-оцінювання  | **Ollama** (локально) або **Hugging Face API** | Fallback: мок-відповідь                                 |
| Форми          | **React Hook Form** + **Zod**                  | Валідація на рівні схем                                 |
| Іконки         | **Lucide React**                               | `import { Mic, Play, ... } from 'lucide-react'`         |

**Не використовувати:** Redux, MobX, styled-components, CSS-модулі, axios (використовуй fetch або Supabase client), class-based компоненти.

---

## Архітектурна методологія: Feature-Sliced Design (FSD)

Код організовано за FSD. Ніколи не порушуй цю ієрархію:

```
src/
├── app/                    # Ініціалізація: провайдери, роутер, глобальні стилі
│   ├── providers/
│   │   ├── RouterProvider.tsx
│   │   └── QueryProvider.tsx
│   ├── App.tsx
│   └── index.css           # @tailwind base/components/utilities
│
├── pages/                  # Сторінки (відповідають маршрутам)
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   ├── CourseCatalogPage.tsx
│   ├── TaskPage.tsx         # Основна сторінка вправи
│   └── ResultPage.tsx
│
├── widgets/                # Складні UI-блоки, складені з features та entities
│   ├── AppHeader/
│   ├── CourseCard/
│   └── ProgressWidget/
│
├── features/               # Фічі з власною логікою та UI
│   ├── auth/               # Авторизація (login/register форми, логіка)
│   ├── speech-recorder/    # Запис мовлення (Web Speech API)
│   │   ├── ui/SpeechRecorder.tsx
│   │   └── model/useSpeechRecognition.ts
│   ├── task-player/        # Відображення та проходження вправи
│   ├── progress-dashboard/ # Відображення прогресу (вектор Pu)
│   └── ai-evaluator/       # Відправка на AI-оцінювання, обробка результату
│
├── entities/               # Бізнес-сутності (типи + запити до БД)
│   ├── user/
│   │   ├── model/types.ts  # User, Role, CompetencyVector
│   │   └── api/userApi.ts  # Supabase запити для users
│   ├── course/
│   │   ├── model/types.ts  # Course, Module, Task
│   │   └── api/courseApi.ts
│   └── activity/
│       ├── model/types.ts  # Activity, ErrorType
│       └── api/activityApi.ts
│
└── shared/                 # Повторно використовувані ресурси
    ├── ui/                 # Базові shadcn/ui re-exports та кастомні компоненти
    ├── api/
    │   ├── supabase.ts     # Ініціалізація Supabase client
    │   └── ai.ts           # Функції для запиту до AI (Ollama/HF)
    ├── lib/
    │   ├── adaptiveAlgorithm.ts  # Формула корисності U(Ei, Pu)
    │   └── utils.ts              # cn(), форматування, тощо
    └── config/
        └── env.ts          # Типізовані env-змінні
```

**Правила FSD:**

- Верхні шари можуть імпортувати з нижніх (`pages` → `features` → `entities` → `shared`)
- Нижні шари НЕ імпортують з верхніх
- Між сутностями одного рівня — мінімальний зв'язок

---

## База даних (Supabase / PostgreSQL)

### Схема таблиць (вже існує, не перестворювати)

```sql
-- Ролі
roles: id (UUID PK), name ('Учень'|'Вчитель'|'Адмін'), description

-- Користувачі
users: id (UUID PK), role_id (FK → roles), full_name, email, password_hash, created_at

-- Вектор компетенцій (1:1 з users, тільки для Учнів)
competency_vectors: id, user_id (UNIQUE FK), pu_vector (JSONB: {phonetics, lexical, grammar}), updated_at

-- Курси (верхній рівень ієрархії контенту)
courses: id, code ('CRS-01'), title, description

-- Модулі (курс → модулі)
modules: id, course_id (FK), code ('CRS-01-MOD-01'), title, order_index

-- Вправи (модуль → вправи)
tasks: id, module_id (FK), code ('CRS-01-MOD-01-TSK-01'), complexity (0.0–1.0), content_json (JSONB)

-- Журнал активності (центральна транзакційна таблиця)
activity: id, user_id (FK), task_id (FK), score (0.0–1.0), audio_path, executed_at

-- Типи помилок (деталі від AI)
error_types: id, activity_id (FK), error_code, category ('Фонетична'|'Лексична'|'Граматична'), description
```

### TypeScript-типи (entities/user/model/types.ts та entities/course/model/types.ts)

```typescript
export interface Role {
  id: string;
  name: "Учень" | "Вчитель" | "Адмін";
  description?: string;
}

export interface User {
  id: string;
  role_id: string;
  full_name: string;
  email: string;
  created_at: string;
}

export interface CompetencyVector {
  id: string;
  user_id: string;
  pu_vector: { phonetics: number; lexical: number; grammar: number };
  updated_at: string;
}

export interface Course {
  id: string;
  code: string; // 'CRS-01'
  title: string;
  description?: string;
}

export interface Module {
  id: string;
  course_id: string;
  code: string; // 'CRS-01-MOD-01'
  title: string;
  order_index: number;
}

export interface Task {
  id: string;
  module_id: string;
  code: string; // 'CRS-01-MOD-01-TSK-01'
  complexity: number; // 0.0–1.0
  content_json: {
    text: string; // текст вправи (наприклад, слово для вимови)
    instruction?: string; // підказка дитині
    expected_word: string; // еталонне слово для порівняння
    audio_example_url?: string;
  };
}

export interface Activity {
  id: string;
  user_id: string;
  task_id: string;
  score: number; // 0.0–1.0
  audio_path?: string;
  executed_at: string;
}
```

### Supabase client (shared/api/supabase.ts)

```typescript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

### .env.local (НЕ комітити в git)

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_OLLAMA_URL=http://localhost:11434
```

---

## ASR-модуль (features/speech-recorder)

Використовуємо **Web Speech API** (безкоштовно, браузерно, без бекенду).

```typescript
// features/speech-recorder/model/useSpeechRecognition.ts
export function useSpeechRecognition(lang = "uk-UA") {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const SpeechRecognition =
    window.SpeechRecognition || (window as any).webkitSpeechRecognition;

  const start = () => {
    if (!SpeechRecognition) {
      setError("Браузер не підтримує розпізнавання мовлення");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (e: SpeechRecognitionEvent) => {
      setTranscript(e.results[0][0].transcript);
      setIsListening(false);
    };
    recognition.onerror = () => {
      setError("Помилка розпізнавання. Перевір мікрофон.");
      setIsListening(false);
    };

    recognition.start();
    setIsListening(true);
  };

  return { transcript, isListening, error, start };
}
```

**Важливо:** Якщо браузер не підтримує SpeechRecognition (Firefox, деякі мобільні) — показати повідомлення, не крашнути застосунок.

---

## AI-оцінювання (features/ai-evaluator)

### Реальне підключення: Ollama (локально)

Ollama запущено локально на `http://localhost:11434`, модель `llama3.2`.

```typescript
// shared/api/ai.ts
export async function evaluateSpeech(
  transcript: string,
  expectedWord: string,
): Promise<{ score: number; feedback: string }> {
  try {
    const res = await fetch(`${import.meta.env.VITE_OLLAMA_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.2",
        stream: false,
        prompt: `You are a speech therapy assistant for children. 
Evaluate how closely the child's pronunciation matches the expected word.
Expected word: "${expectedWord}"
Child said: "${transcript}"
Respond ONLY with valid JSON: {"score": 0.85, "feedback": "Дуже добре! Майже правильно."}
Score is from 0.0 to 1.0. Feedback must be in Ukrainian, encouraging, max 1 sentence.`,
      }),
    });
    const data = await res.json();
    return JSON.parse(data.response);
  } catch {
    // Fallback: мок-оцінювання якщо Ollama недоступна
    return mockEvaluate(transcript, expectedWord);
  }
}

function mockEvaluate(transcript: string, expected: string) {
  const similarity =
    transcript.toLowerCase().trim() === expected.toLowerCase().trim()
      ? 1.0
      : 0.6;
  return {
    score: similarity,
    feedback:
      similarity === 1.0
        ? "Чудово! Ти вимовив правильно!"
        : "Гарна спроба! Давай ще раз.",
  };
}
```

---

## Адаптивний алгоритм (shared/lib/adaptiveAlgorithm.ts)

Реалізує математичну модель з дипломної роботи.

```typescript
export interface CompetencyVectorValues {
  phonetics: number; // ru: 0.0–1.0
  lexical: number; // lu: 0.0–1.0
  grammar: number; // gu: 0.0–1.0
}

const ALPHA = 0.3; // коефіцієнт інерційності

// Формула 2.1: оновлення вектора Pu після спроби
export function updateVector(
  current: CompetencyVectorValues,
  score: number,
): CompetencyVectorValues {
  return {
    phonetics:
      Math.round(((1 - ALPHA) * current.phonetics + ALPHA * score) * 1000) /
      1000,
    lexical:
      Math.round(((1 - ALPHA) * current.lexical + ALPHA * score) * 1000) / 1000,
    grammar:
      Math.round(((1 - ALPHA) * current.grammar + ALPHA * score) * 1000) / 1000,
  };
}

// Формула 2.2: функція корисності для вибору наступної вправи
export function utilityScore(
  task: { complexity: number },
  vector: CompetencyVectorValues,
  weights = { w1: 0.5, w2: 0.3, w3: 0.2 },
): number {
  const avgSkill = (vector.phonetics + vector.lexical + vector.grammar) / 3;
  const Di = 1 - avgSkill; // спрямованість на слабкі місця
  const Mi = 1 - Math.abs(task.complexity - avgSkill); // відповідність складності
  const Gi = 0.7; // ігровий коефіцієнт (константа для MVP)
  return weights.w1 * Di + weights.w2 * Mi + weights.w3 * Gi;
}

// Формула 2.3: вибір найкращої вправи E*
export function selectNextTask<T extends { complexity: number }>(
  tasks: T[],
  vector: CompetencyVectorValues,
): T {
  return tasks.reduce((best, task) =>
    utilityScore(task, vector) > utilityScore(best, vector) ? task : best,
  );
}
```

---

## Дизайн та UI

### Принципи

- **Цільова аудиторія**: діти 4–10 років + батьки та вчителі
- **Стиль**: дружній, яскравий, але не хаотичний. Великі елементи, чіткі CTA.
- **Accessibility**: великі кнопки (мін. 48×48px), контрастні кольори, зрозумілі підписи

### Кольорова палітра (Tailwind CSS variables в index.css)

```css
:root {
  --color-primary: #4f86c6; /* синій — основні дії */
  --color-secondary: #67c99e; /* зелений — успіх, прогрес */
  --color-accent: #f7a84a; /* помаранчевий — акценти, підказки */
  --color-danger: #e05c5c; /* червоний — помилки */
  --color-background: #f5f7fa; /* світлий фон */
  --color-surface: #ffffff; /* картки, панелі */
  --color-text: #1e2a3a; /* основний текст */
  --color-muted: #6b7a8d; /* другорядний текст */
}
```

### Шрифти

```html
<!-- index.html -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link
  href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Nunito+Sans:wght@400;600&display=swap"
  rel="stylesheet"
/>
```

- **Заголовки**: `font-family: 'Nunito', sans-serif` (округлий, дружній)
- **Основний текст**: `font-family: 'Nunito Sans', sans-serif`

### Tailwind — конфігурація розширення (tailwind.config.js)

```js
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#4F86C6",
        secondary: "#67C99E",
        accent: "#F7A84A",
        danger: "#E05C5C",
        surface: "#FFFFFF",
        muted: "#6B7A8D",
      },
      fontFamily: {
        heading: ["Nunito", "sans-serif"],
        body: ["Nunito Sans", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
    },
  },
};
```

### shadcn/ui — які компоненти використовувати

```bash
npx shadcn@latest add button card input label progress dialog badge avatar
```

- `Button` — основні дії (variant: `default`, `outline`, `ghost`)
- `Card` + `CardContent` — вправи, курси, статистика
- `Progress` — прогрес-бари для вектора Pu
- `Dialog` — підтвердження, підказки
- `Badge` — рівень складності, статус вправи
- `Input` — форми авторизації

---

## Маршрутизація (app/providers/RouterProvider.tsx)

```typescript
const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthGuard />,
    children: [
      { index: true,          element: <DashboardPage /> },
      { path: 'courses',      element: <CourseCatalogPage /> },
      { path: 'task/:taskId', element: <TaskPage /> },
      { path: 'result',       element: <ResultPage /> },
    ],
  },
  { path: '/login',    element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
]);
```

`AuthGuard` — перевіряє Supabase сесію, редіректить на `/login` якщо немає.

---

## Глобальний стан (Zustand)

```typescript
// shared/lib/store.ts
interface AppStore {
  user: User | null;
  vector: CompetencyVectorValues | null;
  currentTask: Task | null;
  lastScore: number | null;
  setUser: (u: User | null) => void;
  setVector: (v: CompetencyVectorValues) => void;
  setCurrentTask: (t: Task) => void;
  setLastScore: (s: number) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  user: null,
  vector: null,
  currentTask: null,
  lastScore: null,
  setUser: (user) => set({ user }),
  setVector: (vector) => set({ vector }),
  setCurrentTask: (currentTask) => set({ currentTask }),
  setLastScore: (lastScore) => set({ lastScore }),
}));
```

---

## Ключові сценарії (User Flow)

### Сценарій 1: Вхід та початок вправи

```
/login → email + password → supabase.auth.signInWithPassword()
→ завантажити users + competency_vectors → зберегти в store
→ redirect → /courses → вибрати курс → вибрати вправу
→ /task/:taskId → завантажити task з БД
```

### Сценарій 2: Виконання вправи (TaskPage)

```
1. Показати текст вправи (task.content_json.text)
2. Кнопка "Говорити" → start SpeechRecognition
3. Отримати transcript → показати дитині що розпізнано
4. Відправити на AI: evaluateSpeech(transcript, expected_word)
5. Отримати { score, feedback }
6. Зберегти в БД: INSERT INTO activity (user_id, task_id, score)
7. Оновити вектор: updateVector(currentVector, score) → UPDATE competency_vectors
8. redirect → /result з score + feedback
```

### Сценарій 3: Результат та наступне завдання

```
/result → показати score + feedback
→ кнопка "Ще раз" → /task/:taskId
→ кнопка "Наступна вправа" → selectNextTask(availableTasks, vector) → /task/:nextTaskId
→ кнопка "Головна" → /
```

---

## Мок-дані (для розробки без реального Supabase)

Якщо змінна `VITE_USE_MOCK=true`, використовувати мок-дані замість реальних запитів:

```typescript
// shared/api/mockData.ts
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
];

export const MOCK_VECTOR: CompetencyVectorValues = {
  phonetics: 0.4,
  lexical: 0.55,
  grammar: 0.3,
};
```

---

## Що НЕ реалізовувати в MVP

- Go-бекенд (Core API) — всі запити напряму через Supabase JS client
- Connect RPC / Protocol Buffers — для MVP не потрібно
- Адмін-панель — тільки заглушка
- Генерація PDF-звітів та сертифікатів — поза scope MVP
- Docker / Kubernetes — локальна розробка без контейнерів
- Python AI-сервіс (Whisper + MFCC) — замінено на Web Speech API + Ollama

---

## Структура ключових файлів (стартова точка)

```
smartseeds-client/
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── .env.local                  # НЕ комітити
├── .gitignore
├── package.json
├── CLAUDE.md                   # цей файл
└── src/
    ├── app/
    │   ├── App.tsx
    │   ├── index.css
    │   └── providers/
    │       ├── RouterProvider.tsx
    │       └── QueryProvider.tsx
    ├── pages/
    │   ├── LoginPage.tsx
    │   ├── RegisterPage.tsx
    │   ├── DashboardPage.tsx
    │   ├── CourseCatalogPage.tsx
    │   ├── TaskPage.tsx
    │   └── ResultPage.tsx
    ├── features/
    │   ├── auth/
    │   ├── speech-recorder/
    │   ├── task-player/
    │   ├── progress-dashboard/
    │   └── ai-evaluator/
    ├── entities/
    │   ├── user/
    │   ├── course/
    │   └── activity/
    └── shared/
        ├── ui/
        ├── api/
        │   ├── supabase.ts
        │   ├── ai.ts
        │   └── mockData.ts
        ├── lib/
        │   ├── adaptiveAlgorithm.ts
        │   ├── store.ts
        │   └── utils.ts
        └── config/
            └── env.ts
```

---

## Conventions (правила написання коду)

- Всі компоненти — **функціональні**, з хуками (`useState`, `useEffect`, `useCallback`)
- Іменування файлів компонентів: `PascalCase.tsx`
- Іменування хуків: `use` + `CamelCase.ts`
- Іменування API-функцій: `getUser`, `createActivity`, `updateVector` тощо
- Завжди типізувати props через `interface`, не `type`
- Уникати `any` — якщо невідомий тип, використовувати `unknown` + type guard
- Кожен компонент — в окремому файлі
- Importe shadcn компоненти з `@/components/ui/...`
- Використовувати `cn()` з `shared/lib/utils.ts` для умовних класів Tailwind

---

## Команди для запуску

```bash
# Встановити залежності
npm install

# Запустити dev-сервер
npm run dev

# Збудувати для продакшену
npm run build

# Запустити Ollama (в окремому терміналі)
ollama serve
```

---

## Посилання на першоджерела

- Дипломна робота: «Проєктування інформаційної системи для розвитку мовлення дітей» — Барковська Т.В., КНЕУ, 2026
- Архітектура: Feature-Sliced Design — https://feature-sliced.design
- UI-компоненти: shadcn/ui — https://ui.shadcn.com
- БД: Supabase — https://supabase.com/docs
- ASR: Web Speech API — https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition
