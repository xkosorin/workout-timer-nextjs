import { User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../../lib/prisma";
import { Lap } from "../../../types";

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    userId: string;
    title: string;
    isPublic: boolean;
    accessibleBy: string[];
    description: string;
    laps: Lap[];
  };
}

export default async function handle(
  req: ExtendedNextApiRequest,
  res: NextApiResponse
) {
  const { userId, title, isPublic, accessibleBy, description, laps } = req.body;

  const session = await getSession({ req });

  if (!session) {
    res.status(403).json({
      message:
        "You must be signed in to view the protected content on this page.",
    });
  }

  const result = await prisma.workout.create({
    data: {
      createdBy: {
        connect: {
          id: userId,
        },
      },
      title: title,
      isPublic: isPublic,
      accessibleBy: {
        create: accessibleBy.map((userId) => ({
          userId: userId,
        })),
      },
      description: description,
      laps: {
        create: laps.map((lap) => ({
          exercises: {
            create: lap.exercises.map((exercise) => ({
              usedExercise: {
                create: {
                  exercise: {
                    connect: {
                      id: exercise.usedExercise.exercise.id,
                    },
                  },
                  reps: exercise.usedExercise.reps,
                  timed: exercise.usedExercise.timed,
                },
              },
            })),
          },
          exerciseCount: lap.exercises.length,
        })),
      },
    },
  });
  res.status(200).json(result);
}
