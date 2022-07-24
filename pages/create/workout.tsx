import { GetServerSideProps, NextPage } from "next";
import React, { SyntheticEvent, useEffect, useState } from "react";
import Layout from "../../components/Layout";
import prisma from "../../lib/prisma";
import { getSession, useSession } from "next-auth/react";
import CreateWorkoutTable from "../../components/CreateWorkoutTable";
import { uuid } from "uuidv4";
import Router from "next/router";

type Workout = {
  userId: string;
  title: string;
  description: string;
  laps: Lap[];
}

type Lap = {
  uuid: string;
  usedExercises: UsedExercise[];
  exerciseCount: number;
}

type UsedExercise = {
  uuid: string;
  exerciseId: string;
  title: string;
  reps: number;
  timed: boolean;
}

type Exercise = {
  id: string;
  title?: string;
}

type Props = {
  exerciseList: Exercise[];
  test: any;
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return { props: { exerciseList: [] } };
  }

  const exerciseList = await prisma.exercise.findMany();

  return { props: { exerciseList: JSON.parse(JSON.stringify(exerciseList)) } };
}

const CreateWorkout: NextPage<Props> = (props) => {
  const [workout, setWorkout] = useState<Workout>({
    userId: "",
    title: "",
    description: "",
    laps: [],
  });
  const [laps, setLaps] = useState<Lap[]>([]);

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
      const body = { ...workout };
      await fetch('/api/workout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      await Router.push('/exercises');
    } catch (error) {
      console.error(error);
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    let name = e.currentTarget.name;
    let value = e.currentTarget.value;

    setWorkout({
      ...workout,
      [name]: value
    });
  }

  const handleAddLapButton = (e: SyntheticEvent) => {
    e.preventDefault();

    const newLap: Lap = {
      uuid: uuid(),
      usedExercises: [],
      exerciseCount: 0
    }

    setLaps([...laps, newLap]);
  }

  const handleUpdate = (uuid: string, exercises: UsedExercise[]) => {
    const newState = laps.map(lap => {
      if (lap.uuid === uuid) 
        return {uuid: lap.uuid, usedExercises: exercises, exerciseCount: exercises.length};

      return lap;
    });

    setLaps(newState);
  }

  const handleDeleteLapButton = (e: SyntheticEvent, uuid: string) => {
    e.preventDefault();

    setLaps((prevLaps) =>
      prevLaps.filter((prevLap) => prevLap.uuid !== uuid)
    );
  }

  useEffect(() => {
    setWorkout({
      ...workout,
      // @ts-ignore
      userId: session?.user.id,
      laps
    })
    console.log("fired")
  }, [session, laps])

  return (
    <Layout>
      <form onSubmit={ submitData }>
        <h2 className="p-10 pl-0 text-xl">Create new workout</h2>
        <div className="mb-4">
          <label className="input-label" htmlFor="title">Workout title</label>
          <input className="input-text" autoFocus onChange={ handleInput } type="text" placeholder="Exercise title" id="title" name="title" />
        </div>
        <div className="mb-4">
          <label className="input-label" htmlFor="description">Exercise description</label>
          <textarea className="input-text" onChange={ handleInput } cols={ 30 } placeholder="Exercise description" rows={ 3 } id="description" name="description" />
        </div>
        <div className="mb-4">
            {laps.map((lap, i) => (
              <CreateWorkoutTable uuid={ lap.uuid } lapIndex={ i } exerciseList={ props.exerciseList } onUpdate={ handleUpdate } onDelete={ handleDeleteLapButton } key={ lap.uuid } />
            ))}
        </div>
        <button onClick={ handleAddLapButton }>Add lap</button>
        <input className="ml-8" type="submit" value="Create workout" />
      </form>
      <pre>
        {JSON.stringify(workout, undefined, 2)}
      </pre>
    </Layout>
  );
}

export default CreateWorkout;