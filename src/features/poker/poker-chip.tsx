import { Typography } from "antd";
import { ChipStack } from "../../assets/chip";
import "./poker-chip.css";
import { motion } from "motion/react";

function PokerChip({ amount }: { amount: number }) {
  return (
    <motion.div className="poker-chip-container">
      <img src={ChipStack} alt="Poker Chip" className="poker-chip-image" />
      <Typography.Text className="poker-chip-amount">{amount.toLocaleString()}</Typography.Text>
    </motion.div>
  );
}

export default PokerChip;
