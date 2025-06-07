import type { CSSProperties } from "react";

const baseSize = 80;
const previewSize = 40;
const stroke = 3;

const size = (isPreview = false) => (isPreview ? previewSize : baseSize);
const radius = (isPreview = false) => (size(isPreview) - stroke) / 2;
const circumference = (isPreview = false) => 2 * Math.PI * radius(isPreview);

export const sizeConst = (isPreview = false) => ({
  size: size(isPreview),
  stroke,
  radius: radius(isPreview),
  circumference: circumference(isPreview),
});

export const rankText: CSSProperties = {
  background: "#fff",
  borderRadius: "10px",
  marginBottom: "4px",
  padding: "4px 8px",
};

export const holeCardsContainer: CSSProperties = {
  height: "80px",
  marginBottom: "-40px",
  display: "flex",
};

export const pokerCardOutline = (highlight: boolean, isPreview = false): CSSProperties => ({
  outline: highlight ? "5px solid red" : "none",
  width: isPreview ? 40 : 80,
  height: isPreview ? 60 : 120,
  borderRadius: 6,
});

export const playerImageWrapper = (isPreview = false): CSSProperties => ({
  position: "relative",
  width: size(isPreview),
  height: size(isPreview),
});

export const svgCircle = (isPreview = false): CSSProperties => ({
  position: "absolute",
  top: 0,
  left: 0,
  zIndex: 2,
  pointerEvents: "none",
  width: size(isPreview),
  height: size(isPreview),
});

export const playerImage = (isTurnActive: boolean, isPreview = false): CSSProperties => ({
  width: size(isPreview),
  height: size(isPreview),
  background: "#030A01",
  borderRadius: "50%",
  border: isTurnActive ? "3px solid rgba(255,255,255,0.5)" : undefined,
  position: "relative",
  zIndex: 1,
});

export const stackBox: CSSProperties = {
  borderRadius: "16px",
  background: "linear-gradient(145deg, #1c1c1c, #111)", // metallic gradient
  padding: "6px 30px",
  border: "1px solid rgba(255, 255, 255, 0.1)", // subtle edge highlight
  marginTop: "-16px",
  zIndex: 2,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: `
    inset 0 4px 5px rgba(255, 255, 255, 0.05),
    0px 4px 2px rgba(5, 5, 5, 0.8),
    0 4px 8px rgba(0, 0, 0, 0.4)
  `,
  color: "#EEE",
  textShadow: "0 0 2px rgba(0,0,0,0.6)",
  transition: "all 0.3s ease-in-out",
};

export const stackText: CSSProperties = {
  marginLeft: "8px",
  color: "#fff",
  background: "fff",
};

export const usernameText: CSSProperties = {
  marginLeft: "8px",
  color: "#f0f0f0", // soft white
  fontFamily: "'Orbitron', sans-serif", // Orbitron font
  fontWeight: 700,
  fontSize: "14px",
  letterSpacing: "0.5px",
  borderRadius: "10px",
  textAlign: "center",
};
