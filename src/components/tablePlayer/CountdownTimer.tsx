import React from "react";

type CountdownTimerProps = {
  displaySeconds: number;
  isRunningOut: boolean;
  isVisible: boolean;
  size: number;
};

const CountdownTimer: React.FC<CountdownTimerProps> = ({ displaySeconds, isRunningOut, isVisible, size }) => {
  if (!isVisible) return null;

  const minutes = Math.floor(displaySeconds / 60);
  const seconds = Math.floor(displaySeconds % 60);
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: size,
        height: size,
        backgroundColor: "rgba(0,0,0,0.5)", // covers the full avatar
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2, // above the image
      }}
    >
      <span
        style={{
          fontSize: size * 0.25, // dynamic based on size
          color: isRunningOut ? "#FF3B3B" : "#FFFFFF",
          fontWeight: "bold",
          userSelect: "none",
        }}
      >
        {formattedTime}
      </span>
    </div>
  );
};

export default CountdownTimer;
