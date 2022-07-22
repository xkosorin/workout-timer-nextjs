import { GetServerSideProps, NextPage } from "next";
import React, { SyntheticEvent, useState } from "react";
import Layout from "../../components/Layout";
import 'xtendui';
import 'xtendui/src/groupnumber';
import CreateExerciseRow from "../../components/CreateExerciseRow";
import prisma from "../../lib/prisma";
import { getSession } from "next-auth/react";
import { v4 as uuid } from 'uuid';

type Laps = {
  laps: UsedExercise[];
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
}

let defaultData: UsedExercise[] = [
  {uuid: uuid(), title: "Squat", exerciseId: "cl5uwpkb80097jotq46rpt1gy", reps: 0, timed: false},
  {uuid: uuid(), title: "Front squat", exerciseId: "cl5uwpkb80dd097jotq46rpt1gy", reps: 0, timed: false}
]

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
  const [showSelect, setShowSelect] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [data, setData] = useState(defaultData);

  const submitData = async(e: SyntheticEvent) => {
    e.preventDefault();
  }

  const handleUpdate = (id: string, reps: number, timed: boolean) => {
    const newState = data.map(data => {
      if (data.uuid === id) 
        return {...data, reps, timed};

      return data;
    });

    setData(newState);
  }

  const handleTitleUpdate = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    let name = e.currentTarget.name;
    let value = e.currentTarget.type === "switch-usage" ? (e.currentTarget as HTMLInputElement).checked : e.currentTarget.value;
  }

  const handleSelect = (e: SyntheticEvent) => {
    setSelectedExercise({
      id: (e.target as HTMLInputElement).value,
      title: props.exerciseList.find(exercise => exercise.id === (e.target as HTMLInputElement).value)?.title
    });
  }

  const handleAddExerciseClick = (e: SyntheticEvent) => {
    e.preventDefault();
    setShowSelect(true);

    if (selectedExercise === null)
      return;

    const newExercise: UsedExercise = {
      uuid: uuid(),
      exerciseId: selectedExercise.id,
      title: selectedExercise.title ?? "Unknown exercise",
      reps: 0,
      timed: false
    }

    setData([...data, newExercise])
  }

  const handleDelete = (id: string) => {
    setData((prevData) =>
      prevData.filter((prevItem) => prevItem.uuid !== id)
    );
  }

  return (
    <Layout>
      <form onSubmit={submitData}>
        <h2 className="p-10 pl-0 text-xl">Create new workout</h2>
        <div className="mb-4">
          <label className="input-label" htmlFor="title">Workout title</label>
          <input className="input-text" autoFocus onChange={handleTitleUpdate} type="text" placeholder="Exercise title" id="title" name="title" />
        </div>
        <div className="mb-4">
          <label className="input-label" htmlFor="title">Exercises in lap #</label>
          <div className="block w-full">
            <table className="w-full bg-gray-50 text-gray-700 border border-slate-300 py-3 mb-3 leading-tight">
              <thead className="text-xs border-b border-slate-300 rounded-tl-lg rounded-tr-lg">
                <tr>
                  <th className="w-8/12 text-left pl-4 py-4">Exercise</th>
                  <th className="w-1/12 text-center py-4">Reps. / Sec.</th>
                  <th className="w-1/12 text-center py-4">Is timed</th>
                  <th className="w-2/12 text-center py-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((exercise) => (
                  <CreateExerciseRow id={ exercise.uuid } title={ exercise.title } onUpdate={ handleUpdate } onDelete={ handleDelete } key={ exercise.uuid } />
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td className="pt-4 pl-4">
                    {
                      showSelect &&
                      <div className="inline-block mr-5">
                        <select
                          className="inline-block w-full xt-select rounded-md py-2.5 px-3.5 pr-20 text-gray-900 placeholder-black placeholder-opacity-75 bg-gray-100 transition focus:bg-gray-200 focus:outline-none"
                          aria-label="Select"
                          onChange={handleSelect}>
                          <option defaultValue="">Select an option</option>
                          {props.exerciseList.map((exercise) => (
                            <option value={ exercise.id } key={ exercise.id }>{ exercise.title }</option>
                          ))}
                        </select>
                      </div>
                    }
                    <button onClick={handleAddExerciseClick} disabled={(showSelect && selectedExercise === null)}>Add { !showSelect && "exercise"}</button>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        <button className="">Add lap</button>
      </form>
    </Layout>
  );
}

export default CreateWorkout;