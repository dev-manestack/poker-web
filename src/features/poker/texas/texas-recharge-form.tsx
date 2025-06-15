import { FundOutlined, WalletOutlined } from "@ant-design/icons";
import { Button, Form, Slider } from "antd";
import type { SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import type { GameState } from "./texas-table-game";

function TexasRechargeForm({
  recharge,
  takeSeat,
  gameState,
  modalType,
  selectedSeat,
  rechargeAmount = gameState.minBuyIn,
  setRechargeAmount,
}: {
  recharge: (amount: number) => void;
  takeSeat: (seatIndex: number, amount: number) => void;
  gameState: GameState;
  modalType: string;
  selectedSeat: number;
  rechargeAmount: number;
  setRechargeAmount: (value: SetStateAction<number>) => void;
}) {
  const { t } = useTranslation();

  return (
    <Form
      onFinish={() => {
        if (modalType === "RECHARGE") {
          recharge(rechargeAmount);
        } else {
          console.log("Calling takeSeat with:", selectedSeat, rechargeAmount);
          takeSeat(selectedSeat, rechargeAmount);
        }
      }}
    >
      <Form.Item>
        <>
          {/* Game Info with icons */}
          <div style={{ marginBottom: 16, fontSize: "14px" }}>
            <p>
              <FundOutlined style={{ marginRight: 8 }} />
              Game Type: Texas {gameState.smallBlind}/{gameState.bigBlind}
            </p>
            <p>
              <WalletOutlined style={{ marginRight: 8 }} />
              Available balance:{" "}
              {gameState.usableBalance.toLocaleString("mn-MN")}₮
            </p>
          </div>

          {/* Хэмжээ and Selected Amount */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
              fontSize: "12px",
            }}
          >
            <span style={{ fontWeight: 500 }}>{t("modal.amount")}</span>
            <span
              style={{
                padding: "6px 10px",
                background: "#f5f5f5 !important",
                borderRadius: 8,
                fontWeight: 600,
              }}
            >
              {rechargeAmount.toLocaleString("mn-MN")}₮
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Button
              onClick={() => {
                setRechargeAmount((prevValue) => {
                  if (prevValue - gameState.bigBlind < gameState.minBuyIn) {
                    return gameState.minBuyIn;
                  }
                  return prevValue - gameState.bigBlind;
                });
              }}
              style={{ background: "#7e57c2", border: "none" }}
            >
              -
            </Button>
            <div style={{ flexGrow: 1 }}>
              <Slider
                min={gameState.minBuyIn}
                max={gameState.maxBuyIn}
                step={gameState.maxBuyIn * 0.01}
                value={rechargeAmount}
                onChange={(value) => setRechargeAmount(value)}
                style={{ height: 8 }}
              />
            </div>
            <Button
              onClick={() =>
                setRechargeAmount((prevValue) => {
                  if (prevValue + gameState.bigBlind > gameState.maxBuyIn) {
                    return gameState.maxBuyIn;
                  }
                  if (
                    prevValue + gameState.bigBlind >
                    gameState.usableBalance
                  ) {
                    return prevValue;
                  }
                  return prevValue + gameState.bigBlind;
                })
              }
              style={{ background: "#7e57c2", border: "none" }}
            >
              +
            </Button>
          </div>

          {/* Preset Buttons */}
          <div style={{ marginTop: 20, display: "flex", gap: 8 }}>
            <Button
              onClick={() => {
                setRechargeAmount(gameState.minBuyIn);
              }}
              style={{ fontSize: "12px" }}
            >
              Min
            </Button>
            <Button
              onClick={() => {
                if (gameState.usableBalance < gameState.bigBlind * 40) {
                  setRechargeAmount(gameState.usableBalance);
                } else if (gameState.maxBuyIn < gameState.bigBlind * 40) {
                  setRechargeAmount(gameState.maxBuyIn);
                } else {
                  setRechargeAmount(gameState.bigBlind * 40);
                }
              }}
              style={{ fontSize: "12px" }}
            >
              40BB
            </Button>
            <Button
              onClick={() => {
                if (gameState.usableBalance < gameState.bigBlind * 70) {
                  setRechargeAmount(gameState.usableBalance);
                } else {
                  setRechargeAmount(gameState.bigBlind * 70);
                }
              }}
              style={{ fontSize: "12px" }}
            >
              70BB
            </Button>
            <Button
              onClick={() => {
                if (gameState.usableBalance < gameState.maxBuyIn) {
                  setRechargeAmount(gameState.usableBalance);
                } else {
                  setRechargeAmount(gameState.maxBuyIn);
                }
              }}
              style={{ fontSize: "12px" }}
            >
              Max
            </Button>
          </div>
        </>
      </Form.Item>

      <Form.Item
        style={{
          display: "flex",
          justifyContent: "end",
        }}
      >
        <Button type="default" htmlType="submit" style={{ fontSize: "12px" }}>
          {modalType === "RECHARGE" ? t("modal.recharge") : t("modal.sit")}
        </Button>
      </Form.Item>
    </Form>
  );
}

export default TexasRechargeForm;
