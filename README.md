# 🌱 SmartSeeds

> Інформаційна система для розвитку мовлення дітей з адаптивним підбором завдань на основі ASR та NLP.

**🔗 Live demo:** [smartseeds.netlify.app](https://smartseeds.netlify.app/)

---

## Про проєкт

SmartSeeds — освітня веб-платформа, яка допомагає дітям  розвивати мовлення через інтерактивні вправи. Система автоматично розпізнає вимову дитини, оцінює її за допомогою AI та підбирає наступне завдання відповідно до індивідуального профілю учня.

Кожна дитина має **вектор компетенцій Pu = (ru, lu, gu)** — три показники розвитку (вимова, лексика, граматика), які оновлюються після кожної спроби і визначають складність наступної вправи.

Проєкт розроблено в рамках кваліфікаційної бакалаврської роботи — КНЕУ імені Вадима Гетьмана, 2026.

---

## Стек технологій

| Шар           | Технологія               |
| ------------- | ------------------------ |
| Фреймворк     | React 19 + TypeScript    |
| Збірка        | Vite                     |
| Стилі         | Tailwind CSS + shadcn/ui |
| База даних    | Supabase (PostgreSQL)    |
| ASR           | Web Speech API           |
| AI-оцінювання | Ollama (llama3.2)        |
| Стан          | Zustand + TanStack Query |
| Архітектура   | Feature-Sliced Design    |

---

## Запуск локально

```bash
# Клонувати репозиторій
git clone https://github.com/taniabarkovskya/smartseeds-client.git
cd smartseeds-client

# Встановити залежності
npm install

# Створити .env.local (на основі прикладу)
cp .env.example .env.local
# Заповни VITE_SUPABASE_URL та VITE_SUPABASE_ANON_KEY

# Запустити dev-сервер
npm run dev
```

Для роботи AI-оцінювання локально потрібен [Ollama](https://ollama.com):

```bash
ollama pull llama3.2
ollama serve
```

---

## Структура проєкту

Архітектура побудована за методологією **Feature-Sliced Design (FSD)**.

```
src/
├── app/                        # провайдери та роутер
│   └── providers/              # QueryProvider, RouterProvider
│
├── pages/                      # сторінки застосунку
│   ├── DashboardPage.tsx       # головна панель
│   ├── CourseCatalogPage.tsx   # каталог курсів
│   ├── CoursePage.tsx          # деталі курсу
│   ├── TaskPage.tsx            # виконання вправ
│   ├── TheoryPage.tsx          # теоретичний матеріал
│   ├── TasksPage.tsx           # мої завдання
│   ├── AIAssistantPage.tsx     # чат з AI-асистентом Flippy
│   ├── NotificationsPage.tsx   # сповіщення
│   ├── FavoritesPage.tsx       # збережені курси
│   ├── LoginPage.tsx
│   └── RegisterPage.tsx
│
├── widgets/                    # великі самостійні блоки UI
│   └── AppHeader/              # навігаційна шапка
│
├── features/                   # ізольована функціональність
│   ├── auth/                   # форми входу, реєстрації, відновлення паролю
│   └── speech-recorder/        # хук Web Speech API (ASR)
│
├── entities/                   # доменні сутності
│   ├── user/                   # модель та API користувача
│   ├── course/                 # модель та API курсу
│   └── activity/               # модель та API активності
│
├── shared/                     # спільна інфраструктура
│   ├── api/                    # supabase, ollama AI, mock-дані, вправи
│   ├── config/                 # env змінні
│   ├── lib/                    # адаптивний алгоритм Pu, Zustand store, utils
│   └── ui/                     # перевикористовувані UI-компоненти
│
└── components/
    └── ui/                     # shadcn/ui компоненти (button, card, dialog…)
```

---

## Автор

Барковська Тетяна — [@taniabarkovskya](https://github.com/taniabarkovskya)
