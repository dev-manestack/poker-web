import { Typography } from "antd";
import { ChipStack } from "../../assets/chip";
import "./poker-chip.css";
import { motion } from "motion/react";

function PokerChip({ amount }: { amount: number }) {
  return (
    <motion.div
      id="#073d91"
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "5px",
        width: "100px",
      }}
    >
      <img
        src={ChipStack}
        alt="Poker Chip"
        style={{
          height: "30px",
          width: "30px",
        }}
      />
      <Typography.Text
        style={{
          width: "50%",
          textAlign: "center",
          lineHeight: "30px",
          color: "#fff",
          // background: "rgba(0, 0, 0, 0.7)",
          fontFamily: "'Bebas Neue', sans-serif",
        }}
      >
        {amount}
      </Typography.Text>
    </motion.div>
  );
}

export default PokerChip;
