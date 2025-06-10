import type { CSSProperties } from "react";

export const containerStyles: CSSProperties = {
  width: "100vw",
  height: "100%",
  overflow: "hidden",
  background: "#2C2F33",
};

export const tableStyles: CSSProperties = {
  width: "100%",
  height: "100%",
  background: "#326E81",
  border: "30px solid #234CAB",
  borderRadius: "50% / 40%",
  boxShadow: "0 0 15px rgba(0, 0, 0, 0.6)",
  position: "relative",
};

export const contentStyles: CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "0 30px",
  height: "400px",
  flexWrap: "wrap",
};

export const playerCardStyle: CSSProperties = {
  height: "100px",
};

export const seatChipStyle: CSSProperties = {
  position: "absolute",
  transform: "translate(-50%, -50%)",
  width: "28px",
  height: "28px",
  zIndex: 2,
  pointerEvents: "none",
};

export const playerSeatStyle: CSSProperties = {
  position: "absolute",
  height: "50px",
  width: "50px",
};

export const actionBarStyles: CSSProperties = {
  width: "100%",
  position: "absolute",
  bottom: 0,
  right: 10,
  paddingTop: "16px",
};

export const authLoadingStyles: CSSProperties = {
  height: "100vh",
  width: "100vw",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: 16,
};
