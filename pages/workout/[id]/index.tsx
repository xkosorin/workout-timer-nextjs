import { GetServerSideProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Router from "next/router";
import { SyntheticEvent } from "react";
import Layout from "../../../components/Layout";
import prisma from '../../../lib/prisma'
import { Lap, UsedExerciseArrayItem, Workout } from "../../../types";

type Props = {
  workout: Workout;
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
        }
      },
      user: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });

  return { 
    props: { 
      workout 
    } 
  }
}

const Workout: NextPage<Props> = (props: Props) => {
  const { data: session, status } = useSession();
  let options;

  const handleDeleteButton = async(e: SyntheticEvent, id: string) => {
    e.preventDefault();

    try {
      await fetch(`/api/workout/${id}`, {
        method: 'DELETE',
      });
      await Router.push('/workouts');
    } catch (error) {
      console.error(error);
    }
  }

  // @ts-ignore
  if (status === "authenticated" && session.user.id === props.workout.user.id) {
    options = <>
      <Link href={ "/workout/" + props.workout.id + "/edit" }><a className="add-button mr-2">Edit workout</a></Link>
      <button onClick={ e => handleDeleteButton(e, props.workout.id) } className="delete-button">Delete Workout</button>
    </>;
  }

  return (
    <Layout>
      <div>
        <div className="flex justify-between">
          <h3>{ props.workout.title }</h3>
          <span>{ options }</span>
        </div>
        <p>{ props.workout.description }</p>
        { props.workout.laps.map((lap: Lap, i: number) => (
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
              { lap.exercises.map((exercise: UsedExerciseArrayItem, i: number) => (
                <tr key={ i }>
                  <td className="py-1 pl-4">{ exercise.usedExercise.exercise.title }</td>
                  <td className="text-center">{ exercise.usedExercise.reps + " " + (exercise.usedExercise.timed ? "sec." : "reps.") }</td>
                </tr>
              ))}
              </tbody>
              </table>
            </div>
          </div>
        )) }
      </div>
    </Layout>
  );
}

export default Workout