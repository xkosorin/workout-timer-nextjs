import { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import { SyntheticEvent, useState } from "react";
import LapTable from "../../../components/lapTable/LapTable";
import Layout from "../../../components/Layout";
import prisma from "../../../lib/prisma";
import { v4 as uuidv4 } from 'uuid';
import { Exercise, Lap, UsedExerciseArrayItem } from "../../../types";
import Router from "next/router";

type Props = {
  workout: State;
  exerciseList: Exercise[];
}

type State = {
  id: string;
  title: string;
  description: string;
  laps: Lap[];
}

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

  const exerciseList = await prisma.exercise.findMany();
  const workout = await prisma.workout.findUnique({
    where: {
      id: String(params?.id),
    },
    select: {
      id: true,
      title: true,
      description: true,
      laps: {
        select: {
          exercises: {
            select: {
              usedExercise: {
                select: {
                  id: true,
                  timed: true,
                  reps: true,
                  exercise: {
                    select: {
                      title: true,
                      description: true
                    }
                  }
                }
              }
            }
          },
          exerciseCount: true,
          id: true
        }
      }
    }
  });

  return { 
    props: { 
      workout,
      exerciseList: JSON.parse(JSON.stringify(exerciseList)) 
    } 
  }
}

const EditWorkout: NextPage<Props> = (props: Props) => {
  const [data, setData] = useState<State>(props.workout)

  const handleEditButton = async(e: SyntheticEvent, id: string) => {
    e.preventDefault();

    try {
      await fetch(`/api/workout/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      await Router.push('/workouts');
    } catch (error) {
      console.error(error);
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    let name = e.currentTarget.name;
    let value = e.currentTarget.value;

    setData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleAddLapButton = (e: SyntheticEvent) => {
    e.preventDefault();

    const newLap: Lap = {
      id: uuidv4(),
      exercises: [],
      exerciseCount: 0
    }

    setData(prevData => ({
      ...prevData,
      laps: [...prevData.laps, newLap]
    }));
  }

  const handleUpdate = (id: string, exercises: UsedExerciseArrayItem[]) => {
    const newLaps = data.laps.map(lap => {
      if (lap.id === id) 
        return {id: lap.id, exercises: exercises, exerciseCount: exercises.length};

      return lap;
    });

    setData(prevData => ({
      ...prevData,
      laps: newLaps
    }));
  }

  const handleDeleteLapButton = (e: SyntheticEvent, id: string) => {
    e.preventDefault();

    const newLaps = data.laps.filter((prevLap) => prevLap.id !== id);

    setData(prevData => ({
      ...prevData,
      laps: newLaps
    }));
  } 

  return(
    <Layout>
      <form onSubmit={ e => handleEditButton(e, data.id) }>
        <h2 className="p-10 pl-0 text-xl">Add new workout to database</h2>
        <div className="mb-4">
          <label className="input-label" htmlFor="title">Workout title</label>
          <input className="input-text" onChange={ handleInput } autoFocus type="text" placeholder="Exercise title" id="title" name="title" value={ data.title } />
        </div>
        <div className="mb-4">
          <label className="input-label" htmlFor="description">Exercise description</label>
          <textarea className="input-text" onChange={ handleInput } cols={ 30 } placeholder="Exercise description" rows={ 3 } id="description" name="description" value={ data.description } />
        </div>
        <div className="mb-4">
        { 
          data.laps && data.laps.map((lap: Lap, i: number) => (
            <LapTable id={ lap.id } lapIndex={ i } exercises={ lap.exercises } exerciseList={ props.exerciseList } onUpdate={ handleUpdate } onDelete={ handleDeleteLapButton } key={ lap.id } />
          )) 
        }
        </div>
        <button className="add-button" onClick={ handleAddLapButton }>Add lap</button>
        <input className="ml-4 send-button"type="submit" value="Edit workout" />
      </form>
    </Layout>
  );
}

export default EditWorkout;