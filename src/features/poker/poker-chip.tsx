import "./poker-chip.css";
import { motion } from "motion/react";

function PokerChip({ amount }: { amount: number }) {
  return (
    <motion.div
      id="#073d91"
      style={{
        height: "50px",
        width: "50px",
        borderRadius: "50%",
        border: "3px dashed white",
        transition: "all 1s",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontFamily: "'Lato', sans-serif",
        fontSize: "12px",
        margin: "0px 8px",
        background: "#073d91",
      }}
    >
      <span
        style={{
          height: "30px",
          width: "30px",
          borderRadius: " 50%",
          textAlign: "center",
          lineHeight: "30px",
        }}
      >
        {amount}₮
      </span>
    </motion.div>
  );
}

export default PokerChip;
