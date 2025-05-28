import { Button, Flex, message, Slider, Typography } from "antd";
import { motion } from "motion/react";
import { useState } from "react";
import type { User } from "../../api/user";

function PokerActions({
  player,
  turnPlayer,
  isFolded,
  isAllIn,
  currentBet,
  currentRequiredBet,
  currentPot,
  stack,
  minRaise,
  sendAction,
}: {
  player: User | null;
  turnPlayer: User | null;
  isFolded: boolean;
  isAllIn: boolean;
  currentBet: number;
  currentRequiredBet: number;
  currentPot: number;
  stack: number;
  minRaise: number;
  sendAction: (action: string, amount?: number) => void;
}) {
  const [messageAPI, contextHolder] = message.useMessage();
  const [selectedAmount, setSelectedAmount] = useState(0);

  return (
    <Flex
      style={{
        width: "50%",
        backgroundColor: "#192135",
        padding: "16px",
      }}
      vertical
      gap={16}
    >
      {contextHolder}
      <Typography.Title
        style={{ color: "#fff", textAlign: "center" }}
        level={3}
      >
        Current Player: {turnPlayer?.username}
      </Typography.Title>
      <Flex
        justify="center"
        align="center"
        style={{
          color: "#fff",
          fontSize: "24px",
          width: "200px",
          padding: "16px",
          background: "#192135",
        }}
      >
        {selectedAmount}₮
      </Flex>
      <Flex gap={16}>
        <Slider
          style={{ width: "100%" }}
          value={selectedAmount}
          max={stack}
          onChange={(value) => setSelectedAmount(value)}
          disabled={
            turnPlayer?.userId !== player?.userId || isFolded || isAllIn
          }
          styles={{
            track: { backgroundColor: "#8CC15B" },
            rail: { backgroundColor: "#192135" },
            handle: { backgroundColor: "#8CC15B", borderColor: "#8CC15B" },
          }}
        />
        <Flex justify="end" gap={8} align="center">
          <Button
            style={{
              color: "#fff",
              background: "#192135",
            }}
            disabled={
              turnPlayer?.userId !== player?.userId || isFolded || isAllIn
            }
            onClick={() => {
              if (minRaise < stack) {
                setSelectedAmount(minRaise);
              } else {
                messageAPI.error(
                  "You cannot raise less than the minimum raise."
                );
              }
            }}
          >
            Min
          </Button>
          <Button
            style={{
              color: "#fff",
              background: "#192135",
            }}
            disabled={
              turnPlayer?.userId !== player?.userId || isFolded || isAllIn
            }
            onClick={() => setSelectedAmount(stack / 2)}
          >
            Half
          </Button>
          <Button
            style={{
              color: "#fff",
              background: "#192135",
            }}
            disabled={
              turnPlayer?.userId !== player?.userId || isFolded || isAllIn
            }
            onClick={() => {
              if (currentPot < stack) {
                setSelectedAmount(currentPot);
              } else {
                messageAPI.error("You cannot bet more than your stack.");
              }
            }}
          >
            Pot
          </Button>
          <Button
            style={{
              color: "#fff",
              background: "#192135",
            }}
            disabled={
              turnPlayer?.userId !== player?.userId || isFolded || isAllIn
            }
            onClick={() => {
              if (stack > 0) {
                setSelectedAmount(stack);
              } else {
                messageAPI.error("You cannot go all in with a zero stack.");
              }
            }}
          >
            All In
          </Button>
        </Flex>
      </Flex>
      <Flex justify="space-around" align="center" gap={16}>
        <motion.div
          style={{
            width: "100%",
            height: "50px",
          }}
          whileHover={{ scale: 1.1 }}
        >
          <Button
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "20px",
              background:
                turnPlayer?.userId !== player?.userId || isFolded || isAllIn
                  ? ""
                  : "#EA5C61",
              color: "#fff",
              textTransform: "uppercase",
              fontFamily: "Roboto, sans-serif",
              fontSize: "20px",
              border: "none",
            }}
            disabled={
              turnPlayer?.userId !== player?.userId || isFolded || isAllIn
            }
            onClick={() => sendAction("FOLD", 0)}
          >
            Fold
          </Button>
        </motion.div>

        <motion.div
          style={{
            width: "100%",
            height: "50px",
          }}
          whileHover={{ scale: 1.1 }}
        >
          <Button
            style={{
              width: "100%",
              borderRadius: "20px",
              background:
                turnPlayer?.userId !== player?.userId || isFolded || isAllIn
                  ? ""
                  : "#192135",
              height: "50px",
              color: "#fff",
              textTransform: "uppercase",
              fontFamily: "Roboto, sans-serif",
              border: "none",
              fontSize: "20px",
            }}
            disabled={
              turnPlayer?.userId !== player?.userId || isFolded || isAllIn
            }
            onClick={() => {
              if (currentBet === currentRequiredBet) {
                sendAction("CHECK", 0);
              } else {
                sendAction("CALL", currentRequiredBet - currentBet);
              }
            }}
          >
            {currentBet === currentRequiredBet
              ? "Check"
              : `Call ${currentRequiredBet - currentBet}₮`}
          </Button>
        </motion.div>

        <motion.div
          style={{
            width: "100%",
            height: "50px",
          }}
          whileHover={{ scale: 1.1 }}
        >
          <Button
            style={{
              width: "100%",
              height: "50px",
              borderRadius: "20px",
              color: "#fff",
              background:
                turnPlayer?.userId !== player?.userId || isFolded || isAllIn
                  ? ""
                  : "#8CC15B",
              textTransform: "uppercase",
              fontFamily: "Roboto, sans-serif",
              fontSize: "20px",
              border: "none",
            }}
            disabled={
              turnPlayer?.userId !== player?.userId || isFolded || isAllIn
            }
            onClick={() => {
              if (selectedAmount < currentRequiredBet) {
                messageAPI.error("You must raise at least the required bet.");
                return;
              }
              if (selectedAmount > stack) {
                messageAPI.error("You cannot raise more than your stack.");
                return;
              }
              if (selectedAmount < minRaise) {
                messageAPI.error("You must raise at least the minimum raise.");
                return;
              }
              if (typeof sendAction === "function") {
                sendAction("RAISE", selectedAmount);
              }
            }}
          >
            Raise
          </Button>
        </motion.div>
      </Flex>
    </Flex>
  );
}

export default PokerActions;
