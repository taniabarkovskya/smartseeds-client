import { supabase } from "@/shared/api/supabase";
import type { User, CompetencyVector } from "@/entities/user/model/types";
import type { CompetencyVectorValues } from "@/shared/lib/adaptiveAlgorithm";

export async function getUserById(id: string): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export async function getCompetencyVector(userId: string): Promise<CompetencyVector | null> {
  const { data, error } = await supabase
    .from("competency_vectors")
    .select("*")
    .eq("user_id", userId)
    .single();
  if (error) throw error;
  return data;
}

export async function updateCompetencyVector(
  userId: string,
  values: CompetencyVectorValues,
): Promise<void> {
  const { error } = await supabase
    .from("competency_vectors")
    .update({ pu_vector: values, updated_at: new Date().toISOString() })
    .eq("user_id", userId);
  if (error) throw error;
}