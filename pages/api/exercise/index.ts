import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../../lib/prisma";

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    title: "",
    description: "",
    mediaURL: "",
    mediaIsImage: false,
  };
}

export default async function handle(req: ExtendedNextApiRequest, res: NextApiResponse) {
  const { title, description, mediaURL, mediaIsImage } = req.body;
  
  //const session = await getSession({ req });
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