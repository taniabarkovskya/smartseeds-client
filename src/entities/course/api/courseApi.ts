import { supabase } from "@/shared/api/supabase";
import type { Course, Module, Task } from "@/entities/course/model/types";

export async function getCourses(): Promise<Course[]> {
  const { data, error } = await supabase.from("courses").select("*");
  if (error) throw error;
  return data ?? [];
}

export async function getModulesByCourse(courseId: string): Promise<Module[]> {
  const { data, error } = await supabase
    .from("modules")
    .select("*")
    .eq("course_id", courseId)
    .order("order_index");
  if (error) throw error;
  return data ?? [];
}

export async function getTasksByModule(moduleId: string): Promise<Task[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("module_id", moduleId);
  if (error) throw error;
  return data ?? [];
}

export async function getTaskById(taskId: string): Promise<Task | null> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", taskId)
    .single();
  if (error) throw error;
  return data;
}