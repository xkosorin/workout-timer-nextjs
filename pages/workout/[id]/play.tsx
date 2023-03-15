import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { getSession } from "next-auth/react";
import Image from "next/image";
import { SyntheticEvent, useState } from "react";
import Layout from "../../../components/Layout";
import prisma from "../../../lib/prisma";
import { UsedExercise, Workout } from "../../../types";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import Timer from "../../../components/Timer";
import { useBoolean, useEffectOnce } from "usehooks-ts";

type Props = {
  workout: Workout;
};

type State = {
  currentExercise: UsedExercise;
  lapIndex: number;
  exerciseIndex: number;
  numberOfLaps: number;
  numberOfExercises: number;
};

const Workout: NextPage<Props> = (props: Props) => {
  const [data, setData] = useState<State>({
    lapIndex: 0,
    numberOfLaps: props.workout.laps.length,
    exerciseIndex: 0,
    numberOfExercises: props.workout.laps[0].exerciseCount,
    currentExercise: props.workout.laps[0].exercises[0].usedExercise,
  });
  const {
    value: isLastExercise,
    setTrue: setLastExercise,
    setFalse: unsetLastExercise,
  } = useBoolean(false);
  const {
    value: isLastLap,
    setTrue: setLastLap,
    setFalse: unsetLastLap,
  } = useBoolean(false);

  useEffectOnce(() => {
    if (props.workout.laps.length === 1) {
      setLastLap();

      if (props.workout.laps[0].exerciseCount === 1) {
        setLastExercise();
      }
    }
  });

  const infoText = () => {
    if (data.currentExercise.timed) {
      return (
        <>
          <div className="text-xl md:text-xl flex justify-center">
            Timed exercise
          </div>
          <Timer timeInSeconds={data.currentExercise.reps} />
        </>
      );
    } else {
      return (
        <div className="text-base md:text-xl flex flex-col items-center">
          <span>Number of reps for this exercise: </span>
          <span className="text-3xl text-green-800">
            {data.currentExercise.reps}
          </span>
        </div>
      );
    }
  };

  const nextExercise = (e: SyntheticEvent) => {
    e.preventDefault();

    if (isLastExercise && isLastLap) return;

    let nextExerciseIndex = data.exerciseIndex + 1;
    let nextLapIndex = data.lapIndex;

    if (isLastExercise) {
      nextLapIndex += 1;
      nextExerciseIndex = 0;
      unsetLastExercise();
    }

    setData((prevData) => ({
      ...prevData,
      exerciseIndex: nextExerciseIndex,
      lapIndex: nextLapIndex,
      currentExercise:
        props.workout.laps[nextLapIndex].exercises[nextExerciseIndex]
          .usedExercise,
    }));

    if (nextExerciseIndex + 1 === data.numberOfExercises) {
      if (nextLapIndex + 1 === data.numberOfLaps) {
        setLastLap();
      }
      setLastExercise();
    }
  };

  const prevExercise = (e: SyntheticEvent) => {
    e.preventDefault();

    if (data.exerciseIndex === 0 && data.lapIndex === 0) return;

    let prevExerciseIndex: number = data.exerciseIndex;
    let prevLapIndex: number = data.lapIndex;

    if (data.exerciseIndex === 0) {
      prevLapIndex -= 1;
      prevExerciseIndex = props.workout.laps[prevLapIndex].exerciseCount - 1;
      unsetLastLap();
    } else {
      prevExerciseIndex = data.exerciseIndex - 1;
      unsetLastExercise();
    }

    setData((prevData) => ({
      ...prevData,
      exerciseIndex: prevExerciseIndex,
      lapIndex: prevLapIndex,
      currentExercise:
        props.workout.laps[prevLapIndex].exercises[prevExerciseIndex]
          .usedExercise,
    }));
  };

  return (
    <Layout>
      <div className="flex flex-col items-center">
        <div className="flex flex-col items-center">
          <h3>{props.workout.title}</h3>
          <h5 className="text-xl md:text-2xl font-normal leading-tight mt-0 mb-0">
            Current lap #{data.lapIndex + 1}
          </h5>
          <h5 className="text-xl md:text-2xl font-normal leading-tight mt-0 mb-2">
            Current exercise #{data.exerciseIndex + 1} -{" "}
            {data.currentExercise.exercise.title}
          </h5>
        </div>
        <div className="relative h-64 md:h-[450px] w-full">
          {data.currentExercise.exercise.mediaURL && (
            <Image
              src={data.currentExercise.exercise.mediaURL}
              alt="Image of exercise"
              fill
              sizes="100vw"
              style={{
                objectFit: "contain",
              }}
            ></Image>
          )}
        </div>
        <div className="w-full">{infoText()}</div>
        <div className="w-full flex justify-center">
          <button
            className="primary-button"
            onClick={prevExercise}
            disabled={data.exerciseIndex == 0 && data.lapIndex == 0}
          >
            <MdNavigateBefore />
            <span>Previous</span>
          </button>
          {isLastExercise && isLastLap ? (
            <button className="start-button md:w-64 w-1/2">
              <span>Finish</span>
              <MdNavigateNext />
            </button>
          ) : (
            <button className="primary-button" onClick={nextExercise}>
              <span>Next</span>
              <MdNavigateNext />
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }

  const workout = await prisma.workout.findUnique({
    where: {
      id: String(context.params?.id),
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
                  timed: true,
                  reps: true,
                  exercise: {
                    select: {
                      title: true,
                      description: true,
                      mediaURL: true,
                      mediaIsImage: true,
                    },
                  },
                },
              },
            },
          },
          exerciseCount: true,
        },
      },
    },
  });

  if (!workout) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }

  if (!workout?.accessibleBy.some((u) => u.userId === session.user.id)) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }

  return {
    props: {
      workout,
    },
  };
};

export default Workout;
