import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../../lib/prisma";
import { Lap, UsedExercise, UsedExerciseArrayItem } from "../../../types";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;

  const session = await getSession({ req });

  if (!session) {
    res.status(403).json({
      message:
        "You must be signed in to view the protected content on this page.",
    });
  }

  const workoutId: string = req.query.id as string;

  switch (method) {
    case "DELETE":
      if (!workoutId) {
        res.status(404).json("No id specified");
        return;
      }

      const lapsToDelete = await prisma.lap.findMany({
        where: {
          workoutId,
        },
        select: {
          id: true,
        },
      });

      const lapsIds = lapsToDelete.map((lap) => lap.id);

      const deleteUsedExercises = prisma.usedExercise.deleteMany({
        where: {
          laps: {
            some: {
              lapId: {
                in: lapsIds,
              },
            },
          },
        },
      });

      const deleteWorkout = prisma.workout.delete({
        where: {
          id: workoutId,
        },
      });

      let deleteTransaction;
      try {
        await prisma.$transaction([deleteUsedExercises, deleteWorkout]);
      } catch (e) {
        console.error(e);
        res.status(500);
      }

      res.status(200).json(deleteTransaction);

    case "PUT":
      let { id, title, isPublic, accessibleBy, description, laps } = req.body;
      let updateTransaction;

      try {
        updateTransaction = await prisma.$transaction(async (prisma) => {
          //* Get updated usedExercises from req
          const updatedUsedExercises = laps.map((lap: Lap) => lap.exercises);

          //* Update usedExercises and create new ones if needed
          const updateUsedExercises: UsedExercise[][] = await Promise.all(
            updatedUsedExercises.map(
              async (usedExercises: UsedExerciseArrayItem[]) =>
                await Promise.all(
                  usedExercises.map(
                    async (exercise: UsedExerciseArrayItem) =>
                      await prisma.usedExercise.upsert({
                        where: {
                          id: exercise.usedExercise.id,
                        },
                        update: {
                          timed: exercise.usedExercise.timed,
                          reps: exercise.usedExercise.reps,
                        },
                        create: {
                          timed: exercise.usedExercise.timed,
                          reps: exercise.usedExercise.reps,
                          exercise: {
                            connect: {
                              title: exercise.usedExercise.exercise.title,
                            },
                          },
                        },
                      })
                  )
                )
            )
          );

          //* Get ids of laps
          const lapsIds = laps.map((lap: Lap) => lap.id);

          //* Remove deleted laps from DB
          await prisma.lap.deleteMany({
            where: {
              AND: {
                workoutId: id,
                id: {
                  notIn: lapsIds,
                },
              },
            },
          });

          //* Update laps and create new ones if needed
          //* and recreate usedExercise-Lap relations
          await Promise.all(
            laps.map(async (lap: Lap, i: number) =>
              prisma.lap.upsert({
                where: {
                  id: lap.id,
                },
                update: {
                  exerciseCount: lap.exerciseCount,
                  exercises: {
                    deleteMany: {
                      lapId: lap.id,
                    },
                    create: await Promise.all(
                      lap.exercises.map((_, j: number) => ({
                        usedExerciseId: updateUsedExercises[i][j].id,
                      }))
                    ),
                  },
                },
                create: {
                  exerciseCount: lap.exerciseCount,
                  exercises: {
                    create: await Promise.all(
                      lap.exercises.map((_, j: number) => ({
                        usedExerciseId: updateUsedExercises[i][j].id,
                      }))
                    ),
                  },
                  workout: {
                    connect: {
                      id,
                    },
                  },
                },
              })
            )
          );

          //* Delete usedExercises which has no relation to any lap
          await prisma.usedExercise.deleteMany({
            where: {
              laps: {
                none: {},
              },
            },
          });

          await prisma.userOnWorkout.deleteMany({
            where: {
              workoutId: id,
            },
          });

          //* Update workout info
          return prisma.workout.update({
            where: {
              id,
            },
            data: {
              title: title,
              isPublic: isPublic,
              description: description,
              accessibleBy: {
                create: accessibleBy.map((userId: string) => ({
                  userId: userId,
                })),
              },
            },
          });
        });
      } catch (e) {
        console.error(e);
        res.status(500);
      }

      res.status(200).json(updateTransaction);
  }
}
