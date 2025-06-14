import type { CSSProperties } from "react";

const isMobile = window.innerWidth <= 768;

export const containerStyles: CSSProperties = {
  width: "100vw",
  height: "100%",
  overflow: "hidden",
  background: "radial-gradient(circle, #0b1a48, #1a237e, #4a148c, #7b1fa2)",
};

export const tableStyles: React.CSSProperties = {
  width: "100%",
  height: "100%",
  position: "relative",
  overflow: "visible",
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
  height: isMobile ? "50px" : "100px",
  width: isMobile ? "40px" : "90px", // add width for consistency
  transition: "all 0.3s ease-in-out",
};
export const seatChipStyle: React.CSSProperties = {
  position: "absolute",
  transform: "translate(-50%, -50%)", // to center the chip exactly
  zIndex: 1000, // show on top
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
