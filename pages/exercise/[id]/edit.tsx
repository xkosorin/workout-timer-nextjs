import { NextPage } from "next";
import { useSession } from "next-auth/react";
import Router from "next/router";
import React, { ChangeEvent, SyntheticEvent, useState } from "react";
import Auth from "../../../components/Auth";
import Layout from "../../../components/Layout";
import { Exercise } from "../../../types";

type Props = {

}

type State = {

}

const CreateExercise: NextPage = () => {
  const [data, setData] = useState<Exercise>({
    title: "",
    description: "",
    mediaURL: "",
    mediaIsImage: false,
  });

  const submitData = async (e: SyntheticEvent) => {
    e.preventDefault();

    try {
      const body = { ...data };
      await fetch('/api/exercise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
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
        <form onSubmit={ submitData }>
          <h2 className="p-10 pl-0 text-xl">Add new exercise to database</h2>
          <div className="mb-4">
            <label className="input-label" htmlFor="title">Exercise title</label>
            <input className="input-text" autoFocus onChange={ handleInput } type="text" placeholder="Exercise title" id="title" name="title" />
          </div>
          <div className="mb-4">
            <label className="input-label" htmlFor="description">Exercise description</label>
            <textarea className="input-text" onChange={ handleInput } cols={ 30 } placeholder="Exercise description" rows={ 3 } id="description" name="description" />
          </div>
          <div className="mb-4">
            <label className="input-label" htmlFor="mediaURL">Link for image / video</label>
            <input className="input-text" onChange={ handleInput } type="url" placeholder="Exercise image / vide URL" id="mediaURL" name="mediaURL" />
          </div>
          <div className="mb-4">
            <input className="input-checkbox" onChange={ handleInput } type="checkbox" id="mediaIsImage" name="mediaIsImage" />
            <label className="inline-block ml-2 align-middle input-label" htmlFor="mediaIsImage">Is media image?</label>
          </div>
          <input className="send-button" disabled={ !data.title } type="submit" value="Create" />
        </form>
      </Auth>
    </Layout>
  )
}

export default CreateExercise;