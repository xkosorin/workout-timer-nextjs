type Exercise = {
  title: string;
  amount: number;
  isTimed: boolean;
}

type Props = {
  exercises?: Exercise[];
  onChange;
  onRemove;
}

const LapTable: React.FC<Props> = (props: Props) => (
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
      {
        props.exercises && props.exercises?.map((exercise, i) => (
          <tr className="border-b border-slate-300" key={i}>
            <td className="py-6 pl-4">{ exercise.title }</td>
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
                    aria-label="Amount of reps or seconds for exercise"
                    value={ exercise.amount }
                    min="0"
                    onChange={ props.onChange }
                    name="amount"
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
                checked={ exercise.isTimed }
                onClick={ props.onChange }
              />
            </td>
            <td className="text-center"><button onClick={ props.onRemove }>Remove</button></td>
          </tr>
        ))
      }
    </tbody>
  </table>
)

export default LapTable;