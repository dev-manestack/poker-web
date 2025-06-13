import { useState, useEffect } from "react";

export default function useResponsiveTableSize(isPreview: boolean): { width: string; height: string } {
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  let width: string, height: string;

  if (windowWidth < 480) {
    // Small phones
    width = isPreview ? "90%" : "90%";
    height = isPreview ? "90%" : "50%";
  } else if (windowWidth < 768) {
    // Larger phones / small tablets
    width = isPreview ? "90%" : "80%";
    height = isPreview ? "90%" : "60%";
  } else if (windowWidth < 1024) {
    // Tablets
    width = isPreview ? "90%" : "70%";
    height = isPreview ? "90%" : "50%";
  } else {
    // Desktop
    width = isPreview ? "90%" : "70%";
    height = isPreview ? "90%" : "60%";
  }

  return { width, height };
}
