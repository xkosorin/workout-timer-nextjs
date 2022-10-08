import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { getSession, useSession } from "next-auth/react";
import Link from "next/link";
import Router from "next/router";
import { SyntheticEvent } from "react";
import { useBoolean } from "usehooks-ts";
import Layout from "../../../components/Layout";
import Modal from "../../../components/Modal";
import prisma from '../../../lib/prisma'
import { Lap, UsedExerciseArrayItem, Workout } from "../../../types";

type Props = {
  workout: Workout;
}

const Workout: NextPage<Props> = (props: Props) => {
  const { data: session, status } = useSession();
  const { value: isModalShown, toggle: toggleModal } = useBoolean();
  let options = null;

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
    options = 
    <div className="flex">
        <Link href={ "/workout/" + props.workout.id + "/edit" }><a className="add-button mr-2">Edit workout</a></Link>
        <a onClick={ toggleModal } className="delete-button">Delete Workout</a>
    </div>;
  }

  return (
    <Layout>
      <Modal isShown={ isModalShown } toggle={ toggleModal }>
        <h4>Are you sure you want to delete this exercise?</h4>
        <div className="flex justify-around">
          <button onClick={ e => handleDeleteButton(e, props.workout.id) } className="delete-button w-44">Yes</button>
          <button onClick={ toggleModal } className="add-button w-44">No</button>
        </div>
      </Modal>
      <div>
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center">
            <h3 style={{marginBottom: 0}}>{ props.workout.title }</h3>
            <Link href={ "/workout/" + props.workout.id + "/play" }><a className="start-button h-11 active:h-10 md:w-44 md:justify-items-start ml-5 font-semibold">Work out!</a></Link>
          </div>
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

export const getServerSideProps: GetServerSideProps<any> = async (context: GetServerSidePropsContext) => {
  const session = await getSession(context)

  if (!session) {
    return {
      redirect: {
        destination: '/404',
        permanent: false,
      },
    }
  }

  const workout = await prisma.workout.findUnique({
    where: {
      id: String(context.params?.id),
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

export default Workout