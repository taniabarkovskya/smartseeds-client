import { supabase } from "@/shared/api/supabase";
import type { Activity } from "@/entities/activity/model/types";

export async function createActivity(
  payload: Omit<Activity, "id" | "executed_at">,
): Promise<Activity> {
  const { data, error } = await supabase
    .from("activity")
    .insert({ ...payload, executed_at: new Date().toISOString() })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getActivitiesByUser(userId: string): Promise<Activity[]> {
  const { data, error } = await supabase
    .from("activity")
    .select("*")
    .eq("user_id", userId)
    .order("executed_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}