import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../../lib/prisma";

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    title: string,
    description: string,
    mediaURL: string,
    mediaIsImage: boolean
  };
}

export default async function handle(req: ExtendedNextApiRequest, res: NextApiResponse) {
  const { title, description, mediaURL, mediaIsImage } = req.body;
  
  const session = await getSession({ req });

  if (!session) {
    res.status(403).json({
      message:
        'You must be sign in to view the protected content on this page.',
    })
  }

  const result = await prisma.exercise.create({
    data: {
      title: title,
      description: description,
      mediaURL: mediaURL,
      mediaIsImage: mediaIsImage,
    }
  });
  res.status(200).json(result);
}