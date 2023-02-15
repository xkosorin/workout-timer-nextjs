import { useState } from "react";
import { useInterval } from "usehooks-ts";

interface TimerControllers {
  startTimer: () => void;
  stopTimer: () => void;
  restartTimer: () => void;
}

const useCountdownTimer = (timeInSeconds: number) => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(timeInSeconds * 1000 || 0);

  useInterval(
    () => {
      if (timeLeft <= 0) {
        setIsRunning(false);
        return;
      }
      setTimeLeft((prevTime) => prevTime - 10);
    },
    isRunning ? 10 : null
  );

  const startTimer = () => {
    setIsRunning(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
  };

  const restartTimer = () => {
    setTimeLeft(timeInSeconds * 1000);
  };

  return [
    isRunning,
    timeLeft,
    { startTimer, stopTimer, restartTimer } as TimerControllers,
  ] as const;
};

export default useCountdownTimer;
