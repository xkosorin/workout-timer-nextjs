import { User } from "@prisma/client";

export type Lap = {
  id: string;
  exercises: UsedExerciseArrayItem[];
  exerciseCount: number;
};

export type UsedExerciseArrayItem = {
  usedExercise: UsedExercise;
};

export type UsedExercise = {
  id: string;
  exercise: Exercise;
  reps: number;
  timed: boolean;
};

export type Exercise = {
  id: string;
  title: string;
  description?: string | null;
  mediaURL?: string | null;
  mediaIsImage?: boolean | null;
};

export type Workout = {
  id: string;
  title: string;
  isPublic: boolean;
  accessibleBy: User[];
  description?: string | null;
  laps: Lap[];
  userId: string;
};
