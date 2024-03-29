import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../../lib/prisma";

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

  const id: string = req.query.id as string;

  switch (method) {
    case "DELETE":
      if (!id) {
        res.status(404).json("No id specified");
        return;
      }

      const transaction = await prisma.exercise.delete({
        where: {
          id,
        },
      });

      res.status(200).json(transaction);

    case "PUT":
      let { title, description, mediaIsImage, mediaURL } = req.body;
      let updateTransaction;

      try {
        updateTransaction = await prisma.exercise.update({
          where: {
            id: id,
          },
          data: { title, description, mediaIsImage, mediaURL },
        });
      } catch (e) {
        console.error(e);
        res.status(500);
      }

      res.status(200).json(updateTransaction);
  }
}
