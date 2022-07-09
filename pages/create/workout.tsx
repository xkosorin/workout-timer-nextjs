import { NextPage } from "next";
import React, { useState } from "react";
import Layout from "../../components/Layout";
import 'xtendui';
import 'xtendui/src/groupnumber';
import LapTable from "../../components/LapTable";

const CreateWorkout: NextPage = () => {
  const [showSelect, setShowSelect] = useState(false);
  const [lapsAmount, setLapsAmount] = useState(0);
  const [data, setData] = useState({});

  const submitData = async(e: React.SyntheticEvent) => {
    e.preventDefault();
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    let name = e.currentTarget.name;
    let value = e.currentTarget.type === "switch-usage" ? (e.currentTarget as HTMLInputElement).checked : e.currentTarget.value;
    console.log(name);
    console.log(value);
  }

  const handleRemove = (e: React.SyntheticEvent) => {
    e.preventDefault();
    console.log(e);
  }

  const handleAddExerciseClick = (e: React.SyntheticEvent) => {
    e.preventDefault();

    setShowSelect(true);
  }

  let exercises = [
    {title: "Squat", amount: 0, isTimed: false},
    {title: "Front squat", amount: 5, isTimed: true}
  ]

  return (
    <Layout>
      <form onSubmit={submitData}>
        <h2 className="p-10 pl-0 text-xl">Create new workout</h2>
        <div className="mb-4">
          <label className="input-label" htmlFor="title">Workout title</label>
          <input className="input-text" autoFocus onChange={handleInput} type="text" placeholder="Exercise title" id="title" name="title" />
        </div>
          <div className="mb-4">
            <label className="input-label" htmlFor="title">Exercises in lap #</label>
            <div className="block w-full bg-gray-50 text-gray-700 border border-slate-300 rounded py-3 mb-3 leading-tight">
              <table className="w-full">
                <thead className="text-xs border-b border-slate-300">
                  <tr>
                    <th className="w-8/12 text-left pl-4 pb-4">Exercise</th>
                    <th className="w-1/12 text-center pb-4">Reps. / Sec.</th>
                    <th className="w-1/12 text-center pb-4">Is timed</th>
                    <th className="w-2/12 text-center pb-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-300">
                    <td className="py-6 pl-4">Squat</td>
                    <td className="text-center">
                      <div className="xt-list flex-nowrap" data-xt-groupnumber>
                        <div className="inline-flex">
                          <button
                            type="button"
                            className="xt-button text-2xs py-1 px-2.5 rounded-md rounded-r-none border border-r-0 border-gray-300 font-medium leading-snug tracking-wider uppercase text-gray-700 bg-gray-100 transition hover:bg-gray-200 active:bg-gray-300 on:bg-gray-200"
                            data-xt-step="-1">
                            -
                          </button>
                          <input
                            type="number"
                            className="block w-16 text-center border border-gray-300 py-2.5 px-3.5 text-gray-700 placeholder-black placeholder-opacity-75 bg-gray-100 transition focus:bg-gray-200 focus:outline-none"
                            aria-label="Quantity"
                            defaultValue="0"
                            min="0"
                          />
                          <button
                            type="button"
                            className="xt-button text-2xs py-1 px-2.5 rounded-md rounded-l-none border border-l-0 border-gray-300 font-medium leading-snug tracking-wider uppercase text-gray-700 bg-gray-100 transition hover:bg-gray-200 active:bg-gray-300 on:bg-gray-200"
                            data-xt-step="1">
                            +
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
                      />
                    </td>
                    <td className="text-center"><button>Remove</button></td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td className="pt-4 pl-4">
                      {
                        showSelect &&
                        <div className="inline-block mr-5">
                          <select
                            className="inline-block w-full xt-select rounded-md py-2.5 px-3.5 pr-20 text-gray-900 placeholder-black placeholder-opacity-75 bg-gray-100 transition focus:bg-gray-200 focus:outline-none"
                            aria-label="Select">
                            <option defaultValue="">Select an option</option>
                            <option>Test</option>
                            <option>Test</option>
                            <option>Test</option>
                          </select>
                        </div>
                      }
                      <button onClick={handleAddExerciseClick}>Add { !showSelect && "exercise"}</button>
                    </td>
                  </tr>
                </tfoot>
              </table>
              <LapTable exercises={exercises} onChange={handleInput} onRemove={handleRemove} />
            </div>
          </div>
      </form>
    </Layout>
  );
}

export default CreateWorkout;