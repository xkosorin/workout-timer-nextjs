import { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import { SyntheticEvent, useState } from "react";
import LapTable from "../../../components/lapTable/LapTable";
import Layout from "../../../components/Layout";
import prisma from "../../../lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { Exercise, Lap, UsedExerciseArrayItem, Workout } from "../../../types";
import Router from "next/router";
import Auth from "../../../components/Auth";

type User = {
  id: string;
  name?: string;
  email: string;
};

type Props = {
  workout: State;
  exerciseList: Exercise[];
  usersList: User[];
};

type State = Omit<Workout, "userId" | "accessibleBy"> & {
  accessibleBy: string[];
};

const EditWorkout: NextPage<Props> = (props: Props) => {
  const [data, setData] = useState<State>(props.workout);
  const selectedUsers = props.workout.accessibleBy.map((user) => user);

  const handleEditButton = async (e: SyntheticEvent, id: string) => {
    e.preventDefault();

    try {
      await fetch(`/api/workout/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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

    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
      selectedUsers.push(e.currentTarget.selectedOptions[i].value);
    }

    console.log(selectedUsers);

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
      ...prevData,
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
      ...prevData,
      laps: newLaps,
    }));
  };

  const handleDeleteLapButton = (e: SyntheticEvent, id: string) => {
    e.preventDefault();

    const newLaps = data.laps.filter((prevLap) => prevLap.id !== id);

    setData((prevData) => ({
      ...prevData,
      laps: newLaps,
    }));
  };

  return (
    <Layout>
      <Auth>
        <form onSubmit={(e) => handleEditButton(e, data.id)}>
          <h2 className="p-10 pl-0 text-xl">
            Edit workout - {props.workout.title}
          </h2>
          <div className="mb-4">
            <label className="input-label" htmlFor="title">
              Workout title
            </label>
            <input
              className="input-text"
              onChange={handleInput}
              autoFocus
              type="text"
              placeholder="Exercise title"
              id="title"
              name="title"
              value={data.title}
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
                    aria-label="Make workout public toggle switch"
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
                  value={selectedUsers}
                >
                  {props.usersList.map((user, i) => (
                    <option key={user.id} value={user.id}>
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
              value={data.description || ""}
            />
          </div>
          <div className="mb-4">
            {data.laps &&
              data.laps.map((lap: Lap, i: number) => (
                <LapTable
                  id={lap.id}
                  lapIndex={i}
                  exercises={lap.exercises}
                  exerciseList={props.exerciseList}
                  onUpdate={handleUpdate}
                  onDelete={handleDeleteLapButton}
                  key={lap.id}
                />
              ))}
          </div>
          <button className="add-button" onClick={handleAddLapButton}>
            Add lap
          </button>
          <input
            className="ml-4 send-button"
            type="submit"
            value="Edit workout"
          />
        </form>
      </Auth>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<any> = async ({
  params,
  req,
  res,
}) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return {
      props: {
        exerciseList: [],
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
  const workout = await prisma.workout.findUnique({
    where: {
      id: String(params?.id),
    },
    select: {
      id: true,
      title: true,
      isPublic: true,
      accessibleBy: {
        select: {
          userId: true,
        },
      },
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
                      description: true,
                    },
                  },
                },
              },
            },
          },
          exerciseCount: true,
          id: true,
        },
      },
    },
  });

  if (!workout) {
    return { props: {} };
  }

  let flattenAccessibleUsersIds: string[] = workout.accessibleBy.flatMap(
    (user) => user.userId
  );
  let workoutRet = {
    ...workout,
    accessibleBy: flattenAccessibleUsersIds,
  };

  return {
    props: {
      workout: JSON.parse(JSON.stringify(workoutRet)),
      exerciseList: JSON.parse(JSON.stringify(exerciseList)),
      usersList: JSON.parse(JSON.stringify(usersList)),
    },
  };
};

export default EditWorkout;
