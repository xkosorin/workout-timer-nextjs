import { GetServerSideProps, NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
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
        props.exercises.map((exercise: Exercise, i: number) => {
          return (
            <div key={ i } className="flex flex-col items-center">
              <Link href={ "/exercise/" + exercise.id }><h3 key={ i } className="uppercase text-lg text-gray-600 font-semibold flex-1">{ exercise.title }</h3></Link>
              <p className="text-sm font-light text-slate-400">{ exercise.description }</p>
              { exercise.mediaURL ? <Image src={ exercise.mediaURL } width={ 300 } height={ 300 } alt="Picture of the author" className="flex-1"/> : "" }
            </div>
          )
        })
      }
      </div>
    </Layout>
  )
}

export default Exercises;