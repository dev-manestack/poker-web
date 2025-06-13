import { useEffect, useState } from "react";
import loadingLogo from "../assets/image/logo.png";

export default function LoadingPage() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(100);
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#121212",
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
        userSelect: "none",
        background: "#001529",
      }}
    >
      <img
        src={loadingLogo}
        alt="Loading"
        style={{
          width: 200,
          height: "auto",
          marginBottom: 30,
          objectFit: "contain",
          userSelect: "none",
        }}
      />

      <AnimatedLoadingText />

      <div
        style={{
          marginTop: 20,
          width: "60%",
          height: 10,
          backgroundColor: "#333",
          borderRadius: 5,
          overflow: "hidden",
          boxShadow: "0 0 8px #00cfff",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            background: "linear-gradient(90deg, #00cfff, #0077ff)",
            borderRadius: 5,
            boxShadow: "0 0 10px #00cfff",
            transition: "width 1s ease-out",
          }}
        />
      </div>
    </div>
  );
}

function AnimatedLoadingText() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => setVisible((v) => !v), 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        opacity: visible ? 1 : 0.3,
        transition: "opacity 0.6s ease-in-out",
      }}
    >
      Loading...
    </div>
  );
}
