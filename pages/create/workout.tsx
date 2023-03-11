import { GetServerSideProps, NextPage } from "next";
import React, { SyntheticEvent, useEffect, useState } from "react";
import Layout from "../../components/Layout";
import prisma from "../../lib/prisma";
import { getSession, useSession } from "next-auth/react";
import LapTable from "../../components/lapTable/LapTable";
import { v4 as uuidv4 } from "uuid";
import Router from "next/router";
import { Exercise, Lap, UsedExerciseArrayItem, Workout } from "../../types";

type User = {
  id: string;
  name?: string;
  email: string;
};

type Props = {
  exerciseList: Exercise[];
  usersList: User[];
};

type State = Omit<Workout, "id" | "userId" | "accessibleBy"> & {
  userId: string;
  accessibleBy: string[];
};

const CreateWorkout: NextPage<Props> = (props) => {
  const [data, setData] = useState<State>({
    title: "",
    description: "",
    isPublic: true,
    accessibleBy: [],
    laps: [],
    userId: "",
  });

  const { data: session, status } = useSession();

  const submitData = async (e: SyntheticEvent) => {
    e.preventDefault();

    try {
      const body = { ...data };
      await fetch("/api/workout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await Router.push("/workouts");
    } catch (error) {
      console.error(error);
    }
  };

  const handleInput = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    let name = e.currentTarget.name;
    let value = e.currentTarget.value;

    setData({
      ...data,
      [name]: value,
    });
  };

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    let name = e.currentTarget.name;
    let value = e.currentTarget.checked;

    setData({
      ...data,
      [name]: value,
    });
  };

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    let selectedUsers: string[] = [];

    for (let i = 0; i < e.currentTarget.selectedOptions.length; i++) {
      selectedUsers.push(e.currentTarget.selectedOptions[i].id);
    }

    setData(() => ({
      ...data,
      accessibleBy: selectedUsers,
    }));
  };

  const handleAddLapButton = (e: SyntheticEvent) => {
    e.preventDefault();

    const newLap: Lap = {
      id: uuidv4(),
      exercises: [],
      exerciseCount: 0,
    };

    setData((prevData) => ({
      ...data,
      laps: [...prevData.laps, newLap],
    }));
  };

  const handleUpdate = (id: string, exercises: UsedExerciseArrayItem[]) => {
    const newLaps = data.laps.map((lap) => {
      if (lap.id === id)
        return {
          id: lap.id,
          exercises: exercises,
          exerciseCount: exercises.length,
        };

      return lap;
    });

    setData((prevData) => ({
      ...data,
      laps: newLaps,
    }));
  };

  const handleDeleteLapButton = (e: SyntheticEvent, id: string) => {
    e.preventDefault();

    setData((prevData) => ({
      ...data,
      laps: prevData.laps.filter((prevLap) => prevLap.id !== id),
    }));
  };

  useEffect(() => {
    setData({
      ...data,
      // @ts-ignore
      userId: session?.user.id,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  if (status === "unauthenticated") {
    return (
      <Layout>
        <pre>Access Denied</pre>
      </Layout>
    );
  }

  return (
    <Layout>
      <form onSubmit={submitData}>
        <h2 className="p-10 pl-0 text-xl">Add new workout to database</h2>
        <div className="mb-4">
          <label className="input-label" htmlFor="title">
            Workout title
          </label>
          <input
            className="input-text"
            autoFocus
            onChange={handleInput}
            type="text"
            placeholder="Exercise title"
            id="title"
            name="title"
          />
        </div>
        <div className="mb-4 grid grid-cols-12">
          <div className="col-span-4">
            <div className="flex flex-col justify-start h-16">
              <label
                htmlFor="isPublic"
                className="input-label justify-self-start"
              >
                Make workout public
              </label>
              <div className="flex items-center h-full">
                <input
                  className="mt-[0.3rem] mr-2 h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-[rgba(0,0,0,0.25)] outline-none before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-white after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-blue-500 checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s]"
                  type="checkbox"
                  role="switch"
                  id="isPublic"
                  aria-label="Amount of reps or seconds"
                  name="isPublic"
                  checked={data.isPublic}
                  onChange={handleToggle}
                />
              </div>
            </div>
          </div>
          <div className="col-span-8">
            <div className="flex flex-col justify-between h-16">
              <label htmlFor="select" className="input-label">
                Accessible for
              </label>
              <select
                data-te-select-init
                multiple
                name="select"
                disabled={data.isPublic}
                className="w-full"
                onChange={handleSelect}
              >
                {props.usersList.map((user, i) => (
                  <option key={user.id} id={user.id}>
                    {user.name ?? ""} ({user.email})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label className="input-label" htmlFor="description">
            Exercise description
          </label>
          <textarea
            className="input-text"
            onChange={handleInput}
            cols={30}
            placeholder="Exercise description"
            rows={3}
            id="description"
            name="description"
          />
        </div>
        <div className="mb-4">
          {data.laps.map((lap, i) => (
            <LapTable
              id={lap.id}
              lapIndex={i}
              exercises={[]}
              exerciseList={props.exerciseList}
              onUpdate={handleUpdate}
              onDelete={handleDeleteLapButton}
              key={lap.id}
            />
          ))}
        </div>
        <div className="flex">
          <button className="add-button" onClick={handleAddLapButton}>
            Add lap
          </button>
          <input
            className="ml-4 send-button"
            disabled={
              data.laps.length == 0 ||
              data.laps[0].exerciseCount == 0 ||
              !data.title
            }
            type="submit"
            value="Create workout"
          />
        </div>
      </form>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return {
      props: {
        exerciseList: [],
        usersList: [],
      },
    };
  }

  const exerciseList = await prisma.exercise.findMany();

  const usersList = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  return {
    props: {
      exerciseList: JSON.parse(JSON.stringify(exerciseList)),
      usersList: JSON.parse(JSON.stringify(usersList)),
    },
  };
};

export default CreateWorkout;
