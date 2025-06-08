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
        width: "100%",
        height: "100px",
        marginBottom: "16px",
      }}
      justify="space-between"
      align="center"
    >
      {contextHolder}
      <Flex
        style={{ width: "150px", height: "100px" }}
        justify="center"
        align="center"
      >
        <p></p>
      </Flex>
      <Flex gap={12} vertical>
        <Flex gap={12}>
          <Button
            style={{
              borderRadius: "50px",
              height: "75px",
              width: "75px",
              background: "#2D3038",
            }}
            disabled={isDisabled}
            onClick={() => sendAction("FOLD", 0)}
          >
            Fold
          </Button>
          <Button
            style={{
              width: "150px",
              height: "75px",
              background: "#04BA78",
              fontSize: "16px",
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
              ? "Check"
              : currentRequiredBet - currentBet > stack
              ? `All-In ${stack}`
              : `Call ${currentRequiredBet - currentBet}₮`}
          </Button>
          <Button
            style={{
              width: "150px",
              height: "75px",
              background: "#EF800D",
              fontSize: "16px",
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
            {selectedAmount === stack ? "All In" : `Raise ${selectedAmount}₮`}
          </Button>
        </Flex>
        <Flex gap={8} justify="space-between" align="center">
          <Checkbox>Fold to any bet</Checkbox>
          <Checkbox>Check/Fold</Checkbox>
        </Flex>
      </Flex>
      <Flex style={{ marginTop: "-300px" }} vertical gap={8}>
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
        <Button
          onClick={() => {
            const amount =
              currentRequiredBet + Math.min(stack, currentPot, minRaise);
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
      </Flex>
    </Flex>
  );
}

export default PokerActions;
