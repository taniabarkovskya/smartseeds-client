export const env = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL as string,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY as string,
  ollamaUrl: import.meta.env.VITE_OLLAMA_URL as string,
  useMock: import.meta.env.VITE_USE_MOCK === "true",
};