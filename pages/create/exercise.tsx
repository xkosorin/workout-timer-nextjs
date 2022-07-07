import { NextPage } from "next";
import React, { useState } from "react";
import Header from "../../components/Header";

const initialData = {
  title: "",
  description: "",
  mediaURL: "",
  mediaIsImage: false,
}

const CreateExercise: NextPage = () => {
  const [data, setData] = useState(initialData);
  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    try {
      const body = { ...data };
      await fetch('/api/exercise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    } catch (error) {
      console.error(error);
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    let name = e.currentTarget.name;
    let value = e.currentTarget.type === "checkbox" ? (e.currentTarget as HTMLInputElement).checked : e.currentTarget.value;
    setData({
      ...data,
      [name]: value,
    })
  }

  return (
    <div>
      <Header />
      <form onSubmit={submitData} className="w-full md:w-10/12 m-auto">
        <h2 className="p-10 pl-0">Add new exercise to database</h2>
        <div className="mb-4">
          <label className="input-label" htmlFor="title">Exercise title</label>
          <input className="input-text" autoFocus onChange={handleInput} type="text" placeholder="Exercise title" id="title" name="title" />
        </div>
        <div className="mb-4">
          <label className="input-label" htmlFor="description">Exercise description</label>
          <textarea className="input-text" onChange={handleInput} cols={30} placeholder="Exercise description" rows={3} id="description" name="description" />
        </div>
        <div className="mb-4">
          <label className="input-label" htmlFor="mediaURL">Link for image / video</label>
          <input className="input-text" onChange={handleInput} type="url" placeholder="Exercise image / vide URL" id="mediaURL" name="mediaURL" />
        </div>
        <div className="mb-4">
          <input className="input-checkbox" onChange={handleInput} type="checkbox" id="mediaIsImage" name="mediaIsImage" />
          <label className="inline-block ml-2 align-middle input-label" htmlFor="mediaIsImage">Is media image?</label>
        </div>
        <input className="send-button" disabled={!data.title} type="submit" value="Create" />
      </form>
    </div>
  )
}

export default CreateExercise;