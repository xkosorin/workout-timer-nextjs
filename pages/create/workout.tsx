import { GetServerSideProps, NextPage } from "next";
import React, { SyntheticEvent, useEffect, useState } from "react";
import Layout from "../../components/Layout";
import prisma from "../../lib/prisma";
import { getSession, useSession } from "next-auth/react";
import LapTable from "../../components/lapTable/LapTable";
import { v4 as uuidv4 } from 'uuid';
import Router from "next/router";
import { Exercise, Lap, UsedExerciseArrayItem } from "../../types";

type Props = {
  exerciseList: Exercise[];
}

type State = {
  userId: string;
  title: string;
  description: string;
  laps: Lap[];
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return { 
      props: { 
        exerciseList: [] 
      } 
    };
  }

  const exerciseList = await prisma.exercise.findMany();

  return { 
    props: { 
      exerciseList: JSON.parse(JSON.stringify(exerciseList)) 
    } 
  };
}

const CreateWorkout: NextPage<Props> = (props) => {
  const [data, setData] = useState<State>({
    userId: "",
    title: "",
    description: "",
    laps: [],
  })

  const { data: session, status } = useSession();

  if (status === "unauthenticated") {
    return (
      <Layout>
        <pre>Access Denied</pre>
      </Layout>
    )
  }

  const submitData = async(e: SyntheticEvent) => {
    e.preventDefault();

    try {
      const body = { ...data };
      await fetch('/api/workout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      await Router.push('/workouts');
    } catch (error) {
      console.error(error);
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    let name = e.currentTarget.name;
    let value = e.currentTarget.value;

    setData({
      ...data,
      [name]: value
    })
  }

  const handleAddLapButton = (e: SyntheticEvent) => {
    e.preventDefault();

    const newLap: Lap = {
      id: uuidv4(),
      exercises: [],
      exerciseCount: 0
    }

    setData(prevData => ({
      ...data,
      laps: [...prevData.laps, newLap]
    }))
  }

  const handleUpdate = (id: string, exercises: UsedExerciseArrayItem[]) => {
    const newLaps = data.laps.map(lap => {
      if (lap.id === id) 
        return {id: lap.id, exercises: exercises, exerciseCount: exercises.length};

      return lap;
    });

    setData(prevData => ({
      ...data,
      laps: newLaps
    }))
  }

  const handleDeleteLapButton = (e: SyntheticEvent, id: string) => {
    e.preventDefault();

    setData(prevData => ({
      ...data,
      laps: prevData.laps.filter((prevLap) => prevLap.id !== id)
    }))
  }

  useEffect(() => {
      setData({
        ...data,
        // @ts-ignore
        userId: session?.user.id
      })
    }, [session]);

  return (
    <Layout>
      <form onSubmit={ submitData }>
        <h2 className="p-10 pl-0 text-xl">Add new workout to database</h2>
        <div className="mb-4">
          <label className="input-label" htmlFor="title">Workout title</label>
          <input className="input-text" autoFocus onChange={ handleInput } type="text" placeholder="Exercise title" id="title" name="title" />
        </div>
        <div className="mb-4">
          <label className="input-label" htmlFor="description">Exercise description</label>
          <textarea className="input-text" onChange={ handleInput } cols={ 30 } placeholder="Exercise description" rows={ 3 } id="description" name="description" />
        </div>
        <div className="mb-4">
            {data.laps.map((lap, i) => (
              <LapTable id={ lap.id } lapIndex={ i } exercises={ [] } exerciseList={ props.exerciseList } onUpdate={ handleUpdate } onDelete={ handleDeleteLapButton } key={ lap.id } />
            ))}
        </div>
        <button className="add-button" onClick={ handleAddLapButton }>Add lap</button>
        <input className="ml-4 send-button" disabled={ data.laps.length == 0 || data.laps[0].exerciseCount == 0 || !data.title } type="submit" value="Create workout" />
      </form>
    </Layout>
  );
}

export default CreateWorkout;