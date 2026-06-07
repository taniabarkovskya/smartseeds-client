export interface Course {
  id: string;
  code: string;
  title: string;
  description?: string;
}

export interface Module {
  id: string;
  course_id: string;
  code: string;
  title: string;
  order_index: number;
}

export interface Task {
  id: string;
  module_id: string;
  code: string;
  complexity: number;
  content_json: {
    text: string;
    instruction?: string;
    expected_word: string;
    audio_example_url?: string;
  };
}