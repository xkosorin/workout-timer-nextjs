import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../../lib/prisma";

type Lap = {
  uuid: string;
  usedExercises: UsedExercise[];
  exerciseCount: number;
}

type UsedExercise = {
  uuid: string;
  exerciseId: string;
  title: string;
  reps: number;
  timed: boolean;
}

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    userId: string,
    title: string,
    description: string,
    laps: Lap[],
  };
}

export default async function handle(req: ExtendedNextApiRequest, res: NextApiResponse) {
  const { userId, title, description, laps } = req.body;
  
  console.log(laps);

  //const session = await getSession({ req });
  const result = await prisma.workout.create({
    data: {
      user: {
        connect: {
          id: userId
        }
      },
      title: title,
      description: description,
      laps: {
        create: laps.map((lap) => (
          {
            exercises: {
              create: lap.usedExercises.map((exercise) => (
                {
                  usedExercise: {
                    create: {
                      exerciseId: exercise.exerciseId,
                      amount: exercise.reps,
                      timed: exercise.timed
                    }
                  }
                }
                
              ))
            },
            exerciseCount: lap.usedExercises.length
          }
        ))
      }
    }
  });
  res.status(200).json(result);
}