import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import Link from "next/link";
import Layout from "../components/Layout";
import prisma from "../lib/prisma";
import { Exercise } from "../types";
import { getSession } from "next-auth/react";
import ExerciseMedia from "../components/ExerciseMedia";

type Props = {
  exercises: Exercise[];
};

const Exercises: NextPage<Props> = (props: Props) => {
  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {props.exercises.map((exercise: Exercise, i: number) => {
          return (
            <div key={i} className="flex flex-col items-center">
              <Link href={"/exercise/" + exercise.id}>
                <h3
                  key={i}
                  className="uppercase text-lg text-gray-600 font-semibold flex-1 cursor-pointer"
                >
                  {exercise.title}
                </h3>
              </Link>
              <p className="text-sm font-light text-slate-400 truncate w-full text-center">
                {exercise.description}
              </p>
              <div style={{ width: "100%", height: "100%" }}>
                <ExerciseMedia
                  mediaURL={exercise.mediaURL}
                  mediaIsImage={exercise.mediaIsImage}
                  showThumbnail={true}
                  width={400}
                  height={400}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }

  const res = await prisma.exercise.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      mediaURL: true,
      mediaIsImage: true,
    },
  });

  return {
    props: {
      exercises: JSON.parse(JSON.stringify(res)),
    },
  };
};

export default Exercises;
