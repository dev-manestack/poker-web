import { useEffect, useState } from "react";
import { Image } from "antd";
import ProgressCircle from "./ProgressCircle";
import CountdownTimer from "./CountdownTimer";

export type PlayerAvatarProps = {
  isTurn: boolean;
  progress: number;
};

const PlayerAvatar = ({ isTurn, progress }: PlayerAvatarProps) => {
  const [circleSize, setCircleSize] = useState(120);
  const [secondsLeft, setSecondsLeft] = useState(15);

  useEffect(() => {
    const updateCircleSize = () => {
      const width = window.innerWidth;
      const size = width < 500 ? 70 : 120;
      setCircleSize(size);
    };

    updateCircleSize();
    window.addEventListener("resize", updateCircleSize);
    return () => window.removeEventListener("resize", updateCircleSize);
  }, []);

  useEffect(() => {
    let interval: number | undefined;
    if (isTurn) {
      setSecondsLeft(15); // Reset timer every time it's turn
      interval = window.setInterval(() => {
        setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else {
      setSecondsLeft(15); // Reset when not your turn
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTurn]);

  return (
    <div className="player-image-wrapper" style={{ position: "relative", width: circleSize, height: circleSize }}>
      {progress > 0 && (
        <ProgressCircle
          progress={isTurn ? progress : 0}
          size={circleSize}
          strokeColor="#32CD32"
          strokeWidth={3}
          className="svg-circle"
        />
      )}

      <Image
        preview={false}
        style={{ width: "100%", height: "100%" }}
        className={`player-image${isTurn && progress === 0 ? " turn-active" : ""}`}
        src="https://i.imgur.com/SyIZEu7.png"
      />

      {isTurn && (
        <CountdownTimer
          displaySeconds={secondsLeft}
          isRunningOut={secondsLeft <= 5}
          isVisible={true}
          size={circleSize}
        />
      )}
    </div>
  );
};

export default PlayerAvatar;
