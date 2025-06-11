import { Button, Checkbox, Flex, message } from "antd";
import { useEffect, useState } from "react";
import type { User } from "../../api/user";
import ArcSlider from "./arc-slider";

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
  const [isDisabled, setDisabled] = useState(false);

  useEffect(() => {
    if (turnPlayer && turnPlayer?.userId === player?.userId) {
      setDisabled(false);
      setSelectedAmount(currentRequiredBet + minRaise);
    } else {
      setDisabled(true);
      setSelectedAmount(0);
    }
  }, [turnPlayer, turnPlayer, isFolded, isAllIn]);

  return (
    <Flex
      style={{
        width: "auto",
        height: "100px",
        marginBottom: "16px",
      }}
      justify="space-between"
      align="center"
    >
      {contextHolder}
      <Flex gap={12} vertical>
        <Flex style={{ marginTop: "-150px", flexDirection: "row", justifyContent: "end" }} vertical gap={8}>
          <Button
            onClick={() => {
              const amount = currentRequiredBet + Math.min(stack, minRaise);
              if (amount < minRaise) {
                messageAPI.error("You must raise at least the minimum raise.");
                return;
              }
              setSelectedAmount(amount);
            }}
          >
            Min
          </Button>
          <Button
            onClick={() => {
              const amount = currentRequiredBet + Math.min(stack, minRaise * 3);
              if (amount < minRaise) {
                messageAPI.error("You must raise at least the minimum raise.");
                return;
              }
              setSelectedAmount(amount);
            }}
          >
            3BB
          </Button>
          <Button
            onClick={() => {
              const amount = currentRequiredBet + Math.min(stack, currentPot, minRaise);
              if (amount < minRaise) {
                messageAPI.error("You must raise at least the minimum raise.");
                return;
              }
              setSelectedAmount(amount);
            }}
          >
            Pot
          </Button>
          <Button
            onClick={() => {
              if (stack <= 0) {
                messageAPI.error("You cannot go all-in with no stack.");
                return;
              }
              setSelectedAmount(stack);
            }}
          >
            Max
          </Button>
        </Flex>
        <ArcSlider
          value={selectedAmount}
          onChange={(value) => {
            setSelectedAmount(Number(value.toFixed(0)));
          }}
          onClick={() => {}}
          minValue={minRaise}
          maxValue={stack}
          label="Bet"
        />
        <Flex gap={12}>
          <Button
            style={{
              borderRadius: "10px",
              height: "60px",
              width: "120px",
              background: "#04BA78",
              border: "none",
              fontWeight: "bold",
            }}
            disabled={isDisabled}
            onClick={() => sendAction("FOLD", 0)}
          >
            FOLD
          </Button>
          <Button
            style={{
              borderRadius: "10px",
              height: "60px",
              width: "120px",
              background: "#04BA78",
              border: "none",
              fontWeight: "bold",
            }}
            disabled={isDisabled}
            onClick={() => {
              if (currentBet === currentRequiredBet) {
                sendAction("CHECK", 0);
              } else {
                let missingBet = currentRequiredBet - currentBet;
                let amount = missingBet;
                if (missingBet > stack) {
                  amount = stack;
                }
                sendAction("CALL", amount);
              }
            }}
          >
            {currentBet === currentRequiredBet
              ? "CHECK"
              : currentRequiredBet - currentBet > stack
              ? `All-In ${stack}`
              : `CALL ${currentRequiredBet - currentBet}₮`}
          </Button>
          <Button
            style={{
              borderRadius: "10px",
              height: "60px",
              width: "120px",
              background: "#04BA78",
              border: "none",
              fontWeight: "bold",
            }}
            disabled={isDisabled}
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
                sendAction("RAISE", Number(selectedAmount));
              }
            }}
          >
            {selectedAmount === stack ? "ALL IN" : `RAISE ${selectedAmount}₮`}
          </Button>
        </Flex>
        <Flex gap={8} justify="space-between" align="center">
          <Checkbox>Fold to any bet</Checkbox>
          <Checkbox>Check/Fold</Checkbox>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default PokerActions;
