import { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import Router from "next/router";
import React, { ChangeEvent, SyntheticEvent, useState } from "react";
import Auth from "../../../components/Auth";
import Layout from "../../../components/Layout";
import prisma from "../../../lib/prisma";
import { Exercise } from "../../../types";

type Props = {
  exercise: State;
  id: string;
}

type State = Exercise

export const getServerSideProps: GetServerSideProps<any> = async ({ params, req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return { 
      props: { 
        exerciseList: [] 
      } 
    };
  }

  const exercise = await prisma.exercise.findUnique({
    where: {
      id: String(params?.id),
    },
    select: {
      id: true,
      title: true,
      description: true,
      mediaURL: true,
      mediaIsImage: true,
    }
  });

  return { 
    props: { 
      exercise
    } 
  }
}

const EditExercise: NextPage<Props> = (props: Props) => {
  const [data, setData] = useState<State>(props.exercise)

  const handleEditButton = async (e: SyntheticEvent, id: string) => {
    e.preventDefault();

    try {
      await fetch(`/api/exercise/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      await Router.push('/exercises');
    } catch (error) {
      console.error(error);
    }
  }

  const handleInput = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
    let name = e.currentTarget.name;
    let value = e.currentTarget.type === "checkbox" ? (e.currentTarget as HTMLInputElement).checked : e.currentTarget.value;
    setData({
      ...data,
      [name]: value,
    })
  }

  return (
    <Layout>
      <Auth>
        <form onSubmit={ e => handleEditButton(e, data.id!) }>
          <h2 className="p-10 pl-0 text-xl">Edit exercise - { props.exercise.title }</h2>
          <div className="mb-4">
            <label className="input-label" htmlFor="title">Exercise title</label>
            <input className="input-text" autoFocus onChange={ handleInput } type="text" placeholder="Exercise title" id="title" name="title" value={ data.title } />
          </div>
          <div className="mb-4">
            <label className="input-label" htmlFor="description">Exercise description</label>
            <textarea className="input-text" onChange={ handleInput } cols={ 30 } placeholder="Exercise description" rows={ 3 } id="description" name="description" value={ data.description } />
          </div>
          <div className="mb-4">
            <label className="input-label" htmlFor="mediaURL">Link for image / video</label>
            <input className="input-text" onChange={ handleInput } type="url" placeholder="Exercise image / vide URL" id="mediaURL" name="mediaURL" value={ data.mediaURL } />
          </div>
          <div className="mb-4">
            <input className="input-checkbox" onChange={ handleInput } type="checkbox" id="mediaIsImage" name="mediaIsImage" defaultChecked={ data.mediaIsImage }/>
            <label className="inline-block ml-2 align-middle input-label" htmlFor="mediaIsImage">Is media image?</label>
          </div>
          <input className="send-button" disabled={ !data.title } type="submit" value="Create" />
        </form>
      </Auth>
    </Layout>
  )
}

export default EditExercise;