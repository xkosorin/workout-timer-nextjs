import { GetServerSideProps, NextPage } from "next";
import Image from "next/image";
import Header from "../components/Header";
import prisma from '../lib/prisma'

type ThisExerc = {
  id: string;
  title: string;
  description: string | null;
  mediaURL: string | null;
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


const Exercises: NextPage<{ exercises: ThisExerc[] }> = (props: { exercises: ThisExerc[] }) => {
  return(
    <div>
      <Header />
      {
        props.exercises.map((single: ThisExerc, i: any) => {
          return (
            <div key={i}>
              <h3 key={i}>{single.title}</h3>
              <p>{single.description}</p>
              {single.mediaURL ? <Image src={single.mediaURL} width={300} height={300} alt="Picture of the author" /> : ""}
            </div>
          )
        })
      }
    </div>
  )
}

export default Exercises;