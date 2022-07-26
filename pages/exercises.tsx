import { GetServerSideProps, NextPage } from "next";
import Image from "next/image";
import Layout from "../components/Layout";
import prisma from '../lib/prisma'
import { Exercise } from "../types";

type Props = {
  exercises: Exercise[]
}

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await prisma.exercise.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      mediaURL: true
    }
  });

  return {
    props: {
      exercises: JSON.parse(JSON.stringify(res))
    }
  };
}


const Exercises: NextPage<Props> = (props: Props) => {
  return(
    <Layout>
      <div className="grid grid-cols-3 gap-4">
      {
        props.exercises.map((single: Exercise, i: number) => {
          return (
            <div key={ i } className="flex flex-col items-center">
              <h3 key={ i } className="uppercase text-lg text-gray-600 font-semibold flex-1">{ single.title }</h3>
              <p className="text-sm font-light text-slate-400">{ single.description }</p>
              { single.mediaURL ? <Image src={ single.mediaURL } width={ 300 } height={ 300 } alt="Picture of the author" className="flex-1"/> : "" }
            </div>
          )
        })
      }
      </div>
    </Layout>
  )
}

export default Exercises;