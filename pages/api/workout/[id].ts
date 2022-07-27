import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const method = req.method;
  const workoutId: string = (req.query.id as string);

  switch(method) {
    case 'DELETE':
      if (!workoutId) {
        res.status(404).json("No id specified");
        return;
      }

      const laps = await prisma.lap.findMany({
        where: {
          workoutId
        },
        select: {
          id: true
        }
      })

      const lapsArray = laps.map((lap) => {
        return lap.id;
      })

      const deleteUsedExercises = prisma.usedExercise.deleteMany({
        where: {
          laps: {
            some: {
              lapId: {
                in: lapsArray
              }
            }
          }
        }
      })

      const deleteWorkout = prisma.workout.delete({
        where: {
          id: workoutId
        }
      })

      const transaction = await prisma.$transaction([deleteUsedExercises, deleteWorkout])
      res.status(200).json(transaction)
  }
}