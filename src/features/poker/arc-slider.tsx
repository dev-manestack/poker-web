import { Typography } from "antd";
import React, { type JSX } from "react";

type ArcSliderProps = {
  value: number;
  minValue?: number;
  maxValue?: number;
  label: string;
  onClick?: () => void;
  onChange: (value: number) => void;
  style?: React.CSSProperties;
};

export default function ArcSlider({
  value,
  minValue = 0,
  maxValue = 100,
  label,
  onClick,
  onChange,
  style,
}: ArcSliderProps): JSX.Element {
  return (
    <div
      style={{
        // border: "1px solid #ddd",
        borderRadius: "8px",
        // padding: "16px",
        width: "100%",
        minWidth: 200,
        ...style,
      }}
      onClick={onClick}
    >
      <Typography.Text strong>{label}</Typography.Text>
      <div style={{ marginTop: 8 }}>
        <input
          type="range"
          min={minValue}
          max={maxValue}
          step={0.1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            width: "100%",
            cursor: "pointer",
            transition: "background 0.2s", // for smoother visual feedback
          }}
        />

        <div style={{ textAlign: "center", marginTop: 4 }}>
          <Typography.Text>${value}</Typography.Text>
        </div>
      </div>
    </div>
  );
}
