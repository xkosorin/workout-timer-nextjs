import { GetServerSideProps, NextPage } from "next";
import Layout from "../../components/Layout";
import prisma from '../../lib/prisma'

type ThisExercise = {
  title: string;
  description: string;
}

type Exercise = {
  exercise: ThisExercise;
  timed: boolean;
  amount: number;
}

type UsedExercise = {
  usedExercise: Exercise;
}

type Lap = {
  exercises: UsedExercise[];
}

type ThisWorkout = {
  id: string;
  title: string;
  description: string;
  laps: Lap[];
}

export const getServerSideProps: GetServerSideProps<any> = async ({ params }) => {
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
                  timed: true,
                  amount: true,
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
        }
      },
      user: {
        select: {
          name: true
        }
      }
    }
  });

  return { props: workout }
}

const Workout: NextPage<ThisWorkout> = (props: ThisWorkout) => (
  <Layout>
    <div>
      <h3>{props.title}</h3>
      <p>{props.description}</p>
      {props.laps.map((lap, i) => (
        <div key={ i }>
          <label className="input-label" htmlFor="title">Exercises in lap #{ i + 1 }</label>
          <div className="block w-full">
            <table className="w-full bg-gray-50 text-gray-700 border border-slate-300 py-3 mb-3 leading-tight">
            <thead className="text-xs border-b border-slate-300 rounded-tl-lg rounded-tr-lg">
              <tr>
                <th className="w-10/12 text-left pl-4 py-4">Exercise</th>
                <th className="w-2/12 text-center py-4">Reps.</th>
              </tr>
            </thead>
            <tbody>
            { lap.exercises.map((exercise, i) => (
              <tr key={ i }>
                <td className="py-1 pl-4">{ exercise.usedExercise.exercise.title }</td>
                <td className="text-center">{ exercise.usedExercise.amount + " " + (exercise.usedExercise.timed ? "sec." : "reps.") }</td>
              </tr>
            ))}
            </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  </Layout>
)

export default Workout