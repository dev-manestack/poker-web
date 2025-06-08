import { Button, Typography } from "antd";
import React, { useEffect, useRef, useState, type JSX } from "react";

type ArcSliderProps = {
  radius?: number;
  strokeWidth?: number;
  value: number;
  minValue?: number;
  maxValue?: number;
  label: string;
  onClick?: () => void;
  onChange: (value: number) => void;
};

export default function ArcSlider({
  radius = 100,
  strokeWidth = 10,
  value = 0,
  minValue = 0,
  maxValue = 1,
  label,
  onClick,
  onChange,
}: ArcSliderProps): JSX.Element {
  const [angle, setAngle] = useState(0);
  const [thumb, setThumb] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);
  const center = radius + strokeWidth;
  const r = radius;

  const polarToCartesian = (angle: number) => ({
    x: center + r * Math.cos(angle - Math.PI),
    y: center + r * Math.sin(angle - Math.PI),
  });

  const describeArc = (endAngle: number) => {
    const start = polarToCartesian(0);
    const end = polarToCartesian(endAngle);
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${
      endAngle > Math.PI ? 1 : 0
    } 1 ${end.x} ${end.y}`;
  };

  const valueToAngle = (val: number) => {
    const result = Math.PI * ((val - minValue) / (maxValue - minValue));
    return result < 0 ? 0 : result > Math.PI ? Math.PI : result;
  };

  const handlePointerMove = (e: PointerEvent) => {
    const rect = svgRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left - center;
    const y = e.clientY - rect.top - center;
    const a = Math.atan2(y, x);
    const clamped = Math.min(Math.max(a, 0), Math.PI);
    const ratio = clamped / Math.PI;
    const newValue = minValue + ratio * (maxValue - minValue);
    onChange(newValue);
  };

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    svgRef.current!.setPointerCapture(e.pointerId);
    handlePointerMove(e.nativeEvent);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener(
      "pointerup",
      () => {
        window.removeEventListener("pointermove", handlePointerMove);
      },
      { once: true }
    );
  };

  useEffect(() => {
    setAngle(valueToAngle(value));
    setThumb(polarToCartesian(valueToAngle(value)));
  }, [angle, value, minValue, maxValue]);

  return (
    <div
      style={{ position: "relative", width: center * 2, height: center * 2 }}
    >
      <svg
        ref={svgRef}
        width={center * 2}
        height={center * 2}
        onPointerDown={handlePointerDown}
        style={{ transform: "rotate(-90deg)", touchAction: "none" }}
      >
        <path
          d={describeArc(Math.PI)}
          stroke="#333"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
        />
        <path
          d={describeArc(angle)}
          stroke="#00c96b"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
        />
        <circle
          cx={thumb.x}
          cy={thumb.y}
          r={strokeWidth * 1.5}
          fill="#00c96b"
        />
      </svg>
      <Button
        style={{
          position: "absolute",
          left: center - 50,
          top: center - 50,
          width: 100,
          height: 100,
          borderRadius: "50%",
          backgroundColor: "#00c96b",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "#fff",
          fontWeight: "bold",
          fontSize: 16,
        }}
        onClick={onClick}
      >
        <Typography.Text>{label}</Typography.Text>
        <Typography.Text>${Math.round(value)}</Typography.Text>
      </Button>
    </div>
  );
}
