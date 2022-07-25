import { Lap, User } from "@prisma/client";
import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import Layout from "../components/Layout";
import prisma from '../lib/prisma'

type ThisWorkout = {
  id: string;
  title: string;
  description: string;
  laps: Lap[];
  user: User;
}

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await prisma.workout.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      laps: true,
      user: true
    }
  });

  return {
    props: {
      workouts: JSON.parse(JSON.stringify(res))
    }
  };
}


const Workouts: NextPage<{ workouts: ThisWorkout[] }> = (props: { workouts: ThisWorkout[] }) => {
  return(
    <Layout>
      <div className="grid grid-cols-3 gap-4">
      {
        props.workouts.map((single: ThisWorkout, i: any) => {
          return (
            <div key={i} className="flex flex-col items-center">
              <Link href={ "/workout/" + single.id }><h3 key={i} className="uppercase text-lg text-gray-600 font-semibold flex-1">{single.title}</h3></Link>
              <p className="text-sm font-light text-slate-400">{single.description}</p>
            </div>
          )
        })
      }
      </div>
    </Layout>
  )
}

export default Workouts;