import { GetServerSideProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import Image from 'next/image'
import Link from "next/link";
import Router from "next/router";
import { SyntheticEvent } from "react";
import Layout from "../../../components/Layout";
import prisma from '../../../lib/prisma'
import { Exercise } from '../../../types';

type Props = {
  exercise: Exercise;
}

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
    props: {
      exercise
    }
  }
}

const Exercise: NextPage<Props> = (props: Props) => {
  const { data: session, status } = useSession();
  let options;
  
  const handleDeleteButton = async(e: SyntheticEvent, id: string) => {
    e.preventDefault();

    try {
      await fetch(`/api/exercise/${id}`, {
        method: 'DELETE',
      });
      await Router.push('/exercises');
    } catch (error) {
      console.error(error);
    }
  }

  options = <>
    <Link href={ "/exercise/" + props.exercise.id + "/edit" }><a className="add-button mr-2">Edit exercise</a></Link>
    <button onClick={ e => handleDeleteButton(e, props.exercise.id!) } className="delete-button">Delete exercise</button>
  </>;

  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-2 px-2 md:px-0">
        <div className="flex flex-col md:flex-row md:col-span-2">
          <h3 className="order-2 md:order-1">{ props.exercise.title }</h3>
          <span className="ml-0 md:ml-auto order-1 md:order-2">{ options }</span>
        </div>
        <p>{ props.exercise.description }</p>
        { props.exercise.mediaURL ? <Image src={ props.exercise.mediaURL } alt="Test" width={ 600 } height={ 600 } /> : "" }
      </div>
    </Layout>
  )
}

export default Exercise