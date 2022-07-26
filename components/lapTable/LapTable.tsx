import { FC, SyntheticEvent, useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { Exercise, UsedExerciseArrayItem } from "../../types";
import LapRow from "./LapRow";

type Props = {
  id: string;
  lapIndex: number;
  exercises: UsedExerciseArrayItem[];
  exerciseList: Exercise[];
  onUpdate: Function;
  onDelete: Function;
}

const LapTable: FC<Props> = (props: Props) => {
  const [showSelect, setShowSelect] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [data, setData] = useState<UsedExerciseArrayItem[]>(props.exercises ?? []);

  const handleUpdate = (id: string, reps: number, timed: boolean) => {
    const newState = data.map(data => {
      if (data.usedExercise.id === id) 
        return {
          usedExercise: {
            exercise: data.usedExercise.exercise,
            reps: reps,
            timed: timed,
            id
          }
        }

      return data;
    });

    setData(newState);
  }

  const handleSelect = (e: SyntheticEvent) => {
    setSelectedExercise({
      id: (e.target as HTMLInputElement).value,
      title: props.exerciseList.find(exercise => exercise.id === (e.target as HTMLInputElement).value)?.title ?? "Unknown exercise"
    });
  }

  const handleAddExerciseButton = (e: SyntheticEvent) => {
    e.preventDefault();
    setShowSelect(true);

    if (selectedExercise === null)
      return;

    const newExercise: UsedExerciseArrayItem = {
      usedExercise: {
        id: uuidv4(),
        exercise: {
          id: selectedExercise.id,
          title: selectedExercise.title,
          description: ""
        },
        reps: 0,
        timed: false
      }
    }

    setData(prevData => ([...prevData, newExercise]));
  }

  const handleDeleteButton = (id: string) => {
    setData(data.filter((prevData) => prevData.usedExercise.id !== id))
  }

  useEffect(() => {
    props.onUpdate(props.id, data)
  }, [data]) 

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
          { data && data.map((exercise: UsedExerciseArrayItem, i: number) => (
            <LapRow id={ exercise.usedExercise.id } title={ exercise.usedExercise.exercise.title } reps={ exercise.usedExercise.reps ?? 0 } timed={ exercise.usedExercise.timed ?? false } onUpdate={ handleUpdate } onDelete={ handleDeleteButton } key={ i } /> 
          )) }
        </tbody>
        <tfoot>
          <tr>
            <td className="py-4 pl-4" colSpan={3}>
              {
                showSelect &&
                <div className="inline-block mr-5 border-gray-900">
                  <select
                    className="inline-block w-full xt-select rounded-md py-1 px-3.5 pr-20 text-gray-900 placeholder-black placeholder-opacity-75 bg-gray-100 transition focus:bg-gray-200 focus:outline-none"
                    aria-label="Select"
                    onChange={ handleSelect }
                    defaultValue="selected"
                  >
                    <option value="selected" disabled>Select an option</option>
                    { props.exerciseList.map((exercise: Exercise) => (
                      <option value={ exercise.id } key={ exercise.id }>{ exercise.title }</option>
                    )) }
                  </select>
                </div>
              }
              <button className="add-button-sm" onClick={ handleAddExerciseButton } disabled={ (showSelect && selectedExercise === null) }>Add{ !showSelect && " exercise" }</button>
            </td>
            <td className="py-4 text-center">
              <button className="delete-button-sm" onClick={ e => props.onDelete(e, props.id) }>Remove lap</button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </>
  );
}

export default LapTable;