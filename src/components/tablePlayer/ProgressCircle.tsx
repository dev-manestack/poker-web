import React from "react";

type ProgressCircleProps = {
  progress: number; // from 0 to 1 (1 = full circle)
  size?: number; // diameter in px, default 80
  strokeColor?: string; // default green
  strokeWidth?: number; // default 3
  className?: string; // optional CSS class
};

const ProgressCircle: React.FC<ProgressCircleProps> = ({
  progress,
  size = 80,
  strokeColor = "#32CD32",
  strokeWidth = 3,
  className,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <svg width={size} height={size} className={className} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        style={{ transition: "stroke-dashoffset 0.5s ease-out" }}
      />
    </svg>
  );
};

export default ProgressCircle;
