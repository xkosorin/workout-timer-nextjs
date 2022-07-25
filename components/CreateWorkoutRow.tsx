import { FC, SyntheticEvent, useEffect, useState } from 'react';

type Props = {
  id: string;
  title: string;
  onUpdate: Function;
  onDelete: Function;
}

const CreateExerciseRow: FC<Props> = (props: Props) => {
  const [reps, setReps] = useState(0);
  const [timed, setTimed] = useState(false);

  const updateReps = (e: SyntheticEvent, direction: string) => {
    e.preventDefault();
    
    if (direction === "plus") {
      setReps(reps + 1)
      return;
    }
    
    if (direction === "minus" && reps > 0)
      setReps(reps - 1);
  }

  const handleInput = (e:SyntheticEvent) => {
    e.preventDefault();

    setReps(Number((e.target as HTMLInputElement).value));
  }

  const handleToggle = (e:SyntheticEvent) => {
    setTimed((e.target as HTMLInputElement).checked);
  }

  useEffect(
    () => {
      props.onUpdate(props.id, reps, timed)
    },
    [reps, timed]
  )

  return(
    <tr className="w-full border-b">
      <td className="py-6 pl-4 font-medium">{ props.title }</td>
      <td className="text-center">                    
        <div className="xt-list flex-nowrap justify-center" data-xt-groupnumber>
          <div className="inline-flex">
            <button onClick={ (e) => updateReps(e, "minus") } className=" bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-l cursor-pointer outline-none">
                <span className="m-auto text-2xl font-thin">-</span>
            </button>
            <input type="number" value={ reps } className="outline-none focus:outline-none text-center w-full bg-gray-300 font-semibold text-md hover:text-black focus:text-black md:text-basecursor-default flex items-center text-gray-700 appearance-none" name="custom-input-number" onInput={ handleInput } min="0" />
            <button onClick={ (e) => updateReps(e, "plus") } className="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-r cursor-pointer">
                <span className="m-auto text-2xl font-thin">+</span>
            </button>
          </div>
        </div>
      </td>
      <td className="text-center">
      <input
            type="checkbox"
            aria-label="Amount of reps or seconds"
            className="xt-check xt-switch rounded-full bg-gray-200 border border-transparent transition-all checked:bg-primary-500"
            name="switch-usage"
            onChange={ handleToggle }
        />
      </td>
      <td className="text-center"><button className="border px-1 rounded-full text-red-600 bg-white border-red-800 text-lg leading-5 align-text-top" onClick={ () => props.onDelete(props.id) }>&times;</button></td>
    </tr>
  );
}

export default CreateExerciseRow;