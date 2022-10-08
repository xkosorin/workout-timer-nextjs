import { useState } from "react";
import { MdPlayArrow, MdPause, MdReplay } from "react-icons/md";
import { useInterval } from 'usehooks-ts';

type Props = {
  timeInSeconds: number;
}

const Timer: React.FC<Props> = (props: Props) => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(props.timeInSeconds * 1000 || 0);

  useInterval(() => {
    if (timeLeft <= 0) {
      setIsRunning(false);
      return;
    } 
    setTimeLeft((prevTime) => prevTime - 10);
  }, isRunning ? 10 : null)

  const startButton = () => (
    <button onClick={() => setIsRunning(!isRunning)} className="start-button">
      <MdPlayArrow />
      <span>Start</span>
    </button>
  )

  const pauseButton = () => (
    <button onClick={() => setIsRunning(!isRunning)} className="pause-button">
      <MdPause />
      <span>Pause</span>
    </button>
  )

  const restartButton = () => (
    <button onClick={() => setTimeLeft(props.timeInSeconds * 1000)} className="restart-button">
      <MdReplay />
      <span>Reset</span>
    </button>
  )

  return(
    <>
      <div>
        <span className="flex justify-center text-3xl tabular-nums text-green-800">{ ("0" + Math.floor((timeLeft / 1000) % 60)).slice(-2) + ":" + ("0" + Math.floor((timeLeft / 10) % 100)).slice(-2) }</span>
        <div className="w-full flex flex-col justify-center items-center">
          { !isRunning ? startButton() : pauseButton() }
          { restartButton() }
        </div>
      </div>
    </>
  )
}

export default Timer