export interface Activity {
  id: string;
  user_id: string;
  task_id: string;
  score: number;
  audio_path?: string;
  executed_at: string;
}

export interface ErrorType {
  id: string;
  activity_id: string;
  error_code: string;
  category: "Фонетична" | "Лексична" | "Граматична";
  description?: string;
}