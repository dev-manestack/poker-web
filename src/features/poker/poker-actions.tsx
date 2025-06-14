import { Button, Checkbox, Flex, message } from "antd";
import { useEffect, useState } from "react";
import type { User } from "../../api/user";
import ArcSlider from "./arc-slider";
import "../../styles/poker-actions.css";

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
  const [checkFold, setCheckFold] = useState(false);
  const [foldAnyBet, setFoldAnyBet] = useState(false);

  useEffect(() => {
    if (turnPlayer && turnPlayer?.userId === player?.userId) {
      setDisabled(false);
      setSelectedAmount(currentRequiredBet + minRaise);
      if (currentRequiredBet > 0) {
        if (checkFold || foldAnyBet) {
          sendAction("FOLD", 0);
        }
      } else if (currentRequiredBet === 0 && checkFold) {
        sendAction("CHECK", 0);
      }
    } else {
      setDisabled(true);
      setSelectedAmount(0);
    }
  }, [turnPlayer, turnPlayer, isFolded, isAllIn]);

  return (
    <Flex className="poker-actions-container" justify="space-between" align="center">
      {contextHolder}
      <Flex className="poker-actions-inner">
        <Flex className="poker-actions-buttons">
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

        <div className="arc-slider-wrapper">
          <ArcSlider
            value={selectedAmount}
            onChange={(value) => {
              setSelectedAmount(Number(value.toFixed(0)));
            }}
            onClick={() => {}}
            minValue={minRaise}
            maxValue={stack}
            label=""
          />
        </div>

        <Flex className="poker-actions-buttons">
          <Button className="poker-action-button" disabled={isDisabled} onClick={() => sendAction("FOLD", 0)}>
            FOLD
          </Button>

          <Button
            className="poker-action-button"
            disabled={isDisabled}
            onClick={() => {
              if (currentBet === currentRequiredBet) {
                // Dispatch chipFly event on CHECK (usually no chips move, but you can skip or keep)
                window.dispatchEvent(
                  new CustomEvent("chipFly", {
                    detail: { fromPlayerId: player?.userId, amount: 0 }, // amount 0 since check no chips
                  })
                );
                sendAction("CHECK", 0);
              } else {
                let missingBet = currentRequiredBet - currentBet;
                let amount = missingBet;
                if (missingBet > stack) {
                  amount = stack;
                }
                // Dispatch chipFly event on CALL with amount
                window.dispatchEvent(
                  new CustomEvent("chipFly", {
                    detail: { fromPlayerId: player?.userId, amount },
                  })
                );
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
            className="poker-action-button"
            disabled={isDisabled}
            onClick={() => {
              if (selectedAmount < currentRequiredBet && selectedAmount !== stack) {
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
              sendAction("RAISE", Number(selectedAmount));
            }}
          >
            {selectedAmount === stack ? "ALL IN" : `RAISE ${selectedAmount}₮`}
          </Button>
        </Flex>

        <Flex className="poker-actions-bottom" gap={8} justify="space-between" align="center">
          <Checkbox onChange={(e) => setFoldAnyBet(e.target.checked)}>Fold to any bet</Checkbox>
          <Checkbox onChange={(e) => setCheckFold(e.target.checked)}>Check/Fold</Checkbox>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default PokerActions;
