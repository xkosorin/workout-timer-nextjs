import { MdPlayArrow, MdPause, MdReplay } from "react-icons/md";
import useCountdownTimer from "../hooks/useCountdownTimer";

type Props = {
  timeInSeconds: number;
};

const Timer: React.FC<Props> = (props: Props) => {
  const [isRunning, timeLeft, { startTimer, stopTimer, restartTimer }] =
    useCountdownTimer(props.timeInSeconds);

  const startButton = () => (
    <button onClick={() => startTimer()} className="start-button">
      <MdPlayArrow />
      <span>Start</span>
    </button>
  );

  const pauseButton = () => (
    <button onClick={() => stopTimer()} className="pause-button">
      <MdPause />
      <span>Pause</span>
    </button>
  );

  const restartButton = () => (
    <button onClick={() => restartTimer()} className="restart-button">
      <MdReplay />
      <span>Reset</span>
    </button>
  );

  return (
    <>
      <div>
        <span className="flex justify-center text-3xl tabular-nums text-green-800">
          {("0" + Math.floor((timeLeft / 1000) % 60)).slice(-2) +
            ":" +
            ("0" + Math.floor((timeLeft / 10) % 100)).slice(-2)}
        </span>
        <div className="w-full flex flex-col justify-center items-center">
          {!isRunning ? startButton() : pauseButton()}
          {restartButton()}
        </div>
      </div>
    </>
  );
};

export default Timer;
