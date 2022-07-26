import { GetServerSideProps, NextPage } from "next";
import Image from 'next/image'
import prisma from '../../lib/prisma'
import { Exercise } from '../../types';

export const getServerSideProps: GetServerSideProps<any> = async ({ params }) => {
  const exercise = await prisma.exercise.findUnique({
    where: {
      id: String(params?.id),
    },
    select: {
      id: true,
      title: true,
      description: true,
      mediaURL: true
    }
  });

  return {
    props: exercise,
  }
}

const Exercise: NextPage<Exercise> = (props: Exercise) => (
  <div>
    <h3>{ props.title }</h3>
    <p>{ props.description }</p>
    { props.mediaURL ? <Image src={ props.mediaURL } alt="Test" width={ 300 } height={ 300 } /> : "" }
  </div>
)

export default Exercise