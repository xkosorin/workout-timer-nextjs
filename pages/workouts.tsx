import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import Layout from "../components/Layout";
import prisma from '../lib/prisma'
import { Workout } from "../types";

type Props = {
  workouts: Workout[]
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

const Workouts: NextPage<Props> = (props: Props) => {
  return(
    <Layout>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {
        props.workouts.map((workout: Workout, i: number) => {
          return (
            <div key={ i } className="flex flex-col items-center">
              <Link href={ "/workout/" + workout.id }><h3 key={ i } className="uppercase text-lg text-gray-600 font-semibold flex-1">{ workout.title }</h3></Link>
              <p className="text-sm font-light text-slate-400">{ workout.description }</p>
            </div>
          )
        })
      }
      </div>
    </Layout>
  )
}

export default Workouts;