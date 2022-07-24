import { FC, SyntheticEvent, useEffect, useState } from "react";
import { uuid } from "uuidv4";
import CreateExerciseRow from "./CreateWorkoutRow";

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
  uuid: string;
  lapIndex: number;
  exerciseList: Exercise[];
  onUpdate: Function;
  onDelete: Function;
}

const CreateWorkoutTable: FC<Props> = (props: Props) => {
  const [showSelect, setShowSelect] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [data, setData] = useState<UsedExercise[]>([]);

  const handleUpdate = (uuid: string, reps: number, timed: boolean) => {
    const newState = data.map(data => {
      if (data.uuid === uuid) 
        return {...data, reps, timed};

      return data;
    });

    setData(newState);
  }

  const handleSelect = (e: SyntheticEvent) => {
    setSelectedExercise({
      id: (e.target as HTMLInputElement).value,
      title: props.exerciseList.find(exercise => exercise.id === (e.target as HTMLInputElement).value)?.title
    });
  }

  const handleAddExerciseButton = (e: SyntheticEvent) => {
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

    setData([...data, newExercise]);
  }

  const handleDeleteButton = (uuid: string) => {
    setData((prevData) =>
      prevData.filter((prevItem) => prevItem.uuid !== uuid)
    );
  }

  useEffect(
    () => {
      props.onUpdate(props.uuid, data)
    },
    [data]
  )

  return (
    <>
      <label className="input-label" htmlFor="title">Exercises in lap #{ props.lapIndex + 1 }</label>
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
          {data.length > 0 && data.map((exercise: UsedExercise) => (
            <CreateExerciseRow id={ exercise.uuid } title={ exercise.title } onUpdate={ handleUpdate } onDelete={ handleDeleteButton } key={ exercise.uuid } />
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className="py-4 pl-4" colSpan={3}>
              {
                showSelect &&
                <div className="inline-block mr-5">
                  <select
                    className="inline-block w-full xt-select rounded-md py-2.5 px-3.5 pr-20 text-gray-900 placeholder-black placeholder-opacity-75 bg-gray-100 transition focus:bg-gray-200 focus:outline-none"
                    aria-label="Select"
                    onChange={ handleSelect }>
                    <option defaultValue="">Select an option</option>
                    {props.exerciseList.map((exercise) => (
                      <option value={ exercise.id } key={ exercise.id }>{ exercise.title }</option>
                    ))}
                  </select>
                </div>
              }
              <button onClick={ handleAddExerciseButton } disabled={ (showSelect && selectedExercise === null) }>Add { !showSelect && "exercise" }</button>
            </td>
            <td className="py-4 pr-4 text-right">
              <button onClick={ (e) => props.onDelete(e, props.uuid) }>Remove lap</button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </>
  );
}

export default CreateWorkoutTable;