import type { CSSProperties } from "react";

export const containerStyles: CSSProperties = {
  width: "100vw",
  height: "100%",
  overflow: "hidden",
  background: "radial-gradient(circle, #0b1a48, #1a237e, #4a148c, #7b1fa2)",
};

export const tableStyles: React.CSSProperties = {
  width: "100%",
  height: "100%",
  borderRadius: "50% / 100%", // oval with flat top/bottom
  position: "relative",
  overflow: "visible",
};

export const feltStyles: React.CSSProperties = {
  position: "absolute",
  top: "15%", // leave border space
  left: "10%",
  width: "80%",
  height: "70%",
  background: "linear-gradient(145deg, #064e3b, #0b6b49)", // felt green gradient
  borderRadius: "40% / 60%", // inner oval shape
  boxShadow: "inset 0 0 15px #093624, 0 5px 10px rgba(0,0,0,0.4)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  paddingTop: "10px",
  color: "white",
  zIndex: 1,
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

export const authLoadingStyles: React.CSSProperties = {
  height: "100vh",
  width: "100vw",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "radial-gradient(circle, #0b1a48, #1a237e, #4a148c, #7b1fa2)",
  gap: "20px",
};
