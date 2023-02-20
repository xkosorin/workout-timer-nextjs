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
  id?: string;
  title: string;
  description?: string;
  mediaURL?: string;
  mediaIsImage?: boolean;
};

export type Workout = {
  id: string;
  title: string;
  isPublic: boolean;
  description: string;
  laps: Lap[];
  user: User;
};
