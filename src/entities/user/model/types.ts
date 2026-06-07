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