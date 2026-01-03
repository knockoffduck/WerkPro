import { Models } from 'appwrite';

export type SetType = 'normal' | 'warmup' | 'drop' | 'failure';

export interface UserProfile extends Models.Document {
  user_id: string;
  default_unit: 'kg' | 'lbs';
  timer_duration_sec: number;
}

export interface Exercise extends Models.Document {
  user_id: string | null;
  name: string;
  target_body_part: string | null;
  category: string | null; // Barbell, Dumbbell, Machine
}

export interface Template extends Models.Document {
  user_id: string;
  name: string;
  data: string; // JSON string of TemplateExercise[]
}

export interface Workout extends Models.Document {
  user_id: string;
  template_id: string | null;
  name: string | null;
  start_time: string;
  end_time: string | null;
  volume_kg: number | null;
  note: string | null;
}

export interface WorkoutExercise extends Models.Document {
  workout_id: string;
  exercise_id: string;
  order: number;
}

export interface WorkoutSet extends Models.Document {
  workout_id: string;
  workout_exercise_id: string; // Link to the specific exercise instance
  set_order: number;
  weight: number;
  reps: number;
  type: SetType;
  completed: boolean;
  rest_timer_duration?: number;
  rpe: number | null;
}

// App-level interfaces (non-document versions if needed for logic)
export interface ActiveWorkoutState {
  id: string;
  name: string;
  startTime: Date;
  exercises: {
    id: string;
    exerciseId: string;
    name: string;
    sets: {
      id: string;
      weight: string;
      reps: string;
      type: SetType;
      completed: boolean;
      previous?: string;
      rest_timer_duration?: number;
    }[];
  }[];
}
