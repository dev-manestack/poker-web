import {
  Button,
  Flex,
  Form,
  message,
  Modal,
  Slider,
  Spin,
  Typography,
} from "antd";
import { useEffect, useRef, useState } from "react";
import PokerCard from "./poker-card";
import "./texas-table-game.css";
import {
  // DealCardAudio,
  DisconnectAudio,
  SuccessAudio,
} from "../../assets/sounds";
import {
  websocketURL,
  type GameCard,
  type GamePlayer,
  type TableState,
  type WebsocketEvent,
} from "../../api/game";
import { useNavigate, useParams } from "react-router";
import TablePlayer from "./table-player";
import PokerActions from "./poker-actions";
import type { User } from "../../api/user";
import PokerChip from "./poker-chip";
import {
  containerStyles,
  tableStyles,
  playerCardStyle,
  seatChipStyle,
  playerSeatStyle,
  actionBarStyles,
  authLoadingStyles,
} from "../../styles/PokerTableStyles.ts";
import { FundOutlined, WalletOutlined } from "@ant-design/icons";
import TableActionButtons from "./table-action-buttons.tsx"; // adjust path
import useResponsiveTableSize from "../../hooks/useResponsiveTableSize.tsx"; // adjust path as needed
import { useTranslation } from "react-i18next";
import { DesktopTable, MobileTable } from "../../assets/image/index.ts";
import { useIsMobile } from "../../hooks/useIsMobile.tsx";
import { motion } from "framer-motion";

interface GameState {
  minBuyIn: number;
  maxBuyIn: number;
  smallBlind: number;
  bigBlind: number;

  usableBalance: number;
  isAuthenticated: boolean;
  isSpectator: boolean;
  turnPlayer: User | null;
  isFolded: boolean;
  isAllIn: boolean;
  currentBets: Record<number, number>;
  currentPot: number;

  seats: GamePlayer[];
  winners: GamePlayer[];

  currentPlayerSeat: number;
  communityCards?: GameCard[];
  state:
    | "WAITING_FOR_PLAYERS"
    | "PRE_FLOP"
    | "FLOP"
    | "TURN"
    | "RIVER"
    | "SHOWDOWN"
    | "FINISHED";
}

function TexasTableGame({
  isPreview = false,
  seatCount = 8,
  previewTableId,
  setPreviewSeats,
}: {
  isPreview?: boolean;
  seatCount?: number;
  previewTableId?: string;
  setPreviewSeats?: (seats: GamePlayer[]) => void;
}) {
  const navigate = useNavigate();
  const intervalRef = useRef<number | null>(null);
  const { id: pathTableId } = useParams();
  const [tableId, setTableId] = useState<string>("");
  const [isDisconnected, setIsDisconnected] = useState(false);
  const [messageAPI, contextHolder] = message.useMessage();
  const [modalType, setModalType] = useState("");
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    minBuyIn: 0,
    maxBuyIn: 0,
    smallBlind: 0,
    bigBlind: 0,

    usableBalance: 0,
    isAuthenticated: false,
    isSpectator: false,
    turnPlayer: null,
    isFolded: false,
    isAllIn: false,
    currentBets: {},
    currentPot: 0,
    seats: [],
    winners: [],
    currentPlayerSeat: 0,
    communityCards: [],
    state: "WAITING_FOR_PLAYERS",
  });
  const [turnProgress, setTurnProgress] = useState(1); // 1 = 100%, 0 = 0%
  const userInfoRef = useRef<User | null>(null);
  const isMobile = useIsMobile();
  const [rechargeAmount, setRechargeAmount] = useState<number>(0);
  const isSmallPhone =
    typeof window !== "undefined" && window.innerWidth <= 389;

  const tableHeight = isMobile ? (isSmallPhone ? 500 : 550) : "auto";

  const tableWidth = isMobile ? "100%" : "100%";

  const maxTableWidth = isMobile ? (isSmallPhone ? "100%" : "600px") : "100%";

  const seatRadiusX = isMobile
    ? isSmallPhone
      ? 40 // tighter horizontally on small phone
      : 40 // normal mobile
    : 40;

  const seatRadiusY = isMobile
    ? isSmallPhone
      ? 55 // closer vertically on small phone
      : 45 // normal mobile
    : 50;

  const ws = useRef<WebSocket | null>(null);

  const centerX = 50;
  const centerY = 50;
  const radiusX = 45;
  const radiusY = 55;
  const chipRadiusX = radiusX - 20;
  const chipRadiusY = radiusY - 20;
  const turnDuration = 20; // seconds

  const { width, height } = useResponsiveTableSize(isPreview);

  const userHasSeat = gameState.seats.some(
    (seat) => seat.user?.userId === userInfoRef.current?.userId
  );
  const userSeatIndex = gameState.seats.findIndex(
    (seat) => seat.user?.userId === userInfoRef.current?.userId
  );

  const isSeatTaken = (seatIndex: number) => {
    return (
      gameState.seats[seatIndex]?.user !== null &&
      gameState.seats[seatIndex]?.user !== undefined
    );
  };

  const { t } = useTranslation();

  const startTurnTimer = () => {
    setTurnProgress(1);
    console.log("Starting turn timer with duration:", turnDuration);

    // Clear any existing interval
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setTurnProgress((prev) => {
        const newProgress = prev - 1 / (turnDuration * 10);

        if (newProgress <= 0) {
          if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return 0;
        }

        console.log("Updating turn progress:", newProgress);
        return newProgress;
      });
    }, 100);
  };

  const authenticateSocket = () => {
    const accessToken = localStorage.getItem("accessToken");
    ws.current?.send(
      JSON.stringify({
        type: "AUTH",
        data: {
          accessToken: accessToken,
        },
      })
    );
  };

  const takeSeat = (seatIndex: number | null | undefined, amount: number) => {
    if (seatIndex === null || seatIndex === undefined) {
      messageAPI.error("Та суудал сонгоно уу");
    }
    if (gameState.isAuthenticated) {
      ws.current?.send(
        JSON.stringify({
          type: "TABLE",
          data: {
            tableId: parseInt(tableId || "0"),
            action: "TAKE_SEAT",
            seatIndex: seatIndex,
            amount: amount,
          },
        })
      );
    } else {
      messageAPI.error("Та ширээнд суухын тулд эхлээд холбогдох хэрэгтэй");
    }
  };

  const recharge = (amount: number) => {
    if (gameState.isAuthenticated) {
      ws.current?.send(
        JSON.stringify({
          type: "TABLE",
          data: {
            tableId: parseInt(tableId || "0"),
            action: "RECHARGE",
            amount: amount,
          },
        })
      );
      console.log(amount);
    } else {
      messageAPI.error("Та цэнэглэхийн тулд эхлээд холбогдох хэрэгтэй");
    }
  };

  const leaveSeat = (seatIndex: number) => {
    if (gameState.isAuthenticated) {
      ws.current?.send(
        JSON.stringify({
          type: "TABLE",
          data: {
            tableId: parseInt(tableId || "0"),
            action: "LEAVE_SEAT",
            seatIndex: seatIndex,
          },
        })
      );
    } else {
      messageAPI.error("Та ширээнээс гарахын тулд эхлээд холбогдох хэрэгтэй");
    }
  };

  const handleTableEvent = (data: any) => {
    const tableState: TableState = data?.table;
    const currentSession = data?.session;
    const tempArray = new Array(seatCount).fill(null);
    const holeCards = currentSession?.holeCards || [];
    Object.entries(tableState.seats).forEach(([index, seat]) => {
      if (seat) {
        tempArray[parseInt(index)] = {
          user: seat.user,
          stack: seat.stack,
          holeCards: holeCards[parseInt(index)] || [],
        };
      } else {
        tempArray[parseInt(index)] = {
          user: null,
          stack: 0,
          holeCards: gameState.seats[parseInt(index)]?.holeCards || [],
        };
      }
    });
    setGameState((prevState) => ({
      ...prevState,
      maxBuyIn: tableState?.maxBuyIn || 0,
      minBuyIn: tableState?.minBuyIn || 0,
      smallBlind: tableState?.smallBlind || 0,
      bigBlind: tableState?.bigBlind || 0,
      seats: tempArray.map((seat) => ({
        ...seat,
        holeCards: seat?.holeCards || [],
        isAllIn: seat?.isAllIn || false,
        isFolded: seat?.isFolded || false,
      })),
      turnPlayer: currentSession?.turnPlayer || gameState.turnPlayer,
      isFolded: currentSession?.isFolded || gameState.isFolded,
      isAllIn: currentSession?.isAllIn || gameState.isAllIn,
      currentBets: currentSession?.currentBets || gameState.currentBets,
      currentPot: currentSession?.currentPot || gameState.currentPot,
      state: currentSession?.state || gameState.state,
      currentPlayerSeat:
        currentSession?.currentPlayerSeat || gameState.currentPlayerSeat,
      communityCards:
        currentSession?.communityCards || gameState.communityCards,
      isSpectator: data?.isSpectator || false,
    }));
    switch (data.action) {
      case "TAKE_SEAT": {
        const sound = new Howl({
          src: [SuccessAudio],
          volume: 0.5,
        });
        sound.play();
        setModalType("");
        break;
      }
      case "LEAVE_SEAT": {
        const sound = new Howl({
          src: [DisconnectAudio],
          volume: 0.5,
        });
        sound.play();
        break;
      }
      case "LEAVE_TABLE": {
        const sound = new Howl({
          src: [DisconnectAudio],
          volume: 0.5,
        });
        sound.play();
        break;
      }
      case "RECHARGE": {
        const sound = new Howl({
          src: [SuccessAudio],
          volume: 0.5,
        });
        sound.play();
        setModalType("");
        break;
      }
    }
  };

  const handleGameEvent = (data: any) => {
    switch (data?.action) {
      case "GAME_STATE_UPDATE": {
        console.log("Received game state event:", data);
        setGameState((prevState) => {
          let newState: GameState = {
            ...prevState,
            communityCards: data.communityCards || [],
            state: data?.state,
            currentBets: {},
            currentPot: data?.state === "FINISHED" ? 0 : data?.currentPot || 0,
          };
          if (data?.state === "PRE_FLOP") {
            newState = {
              ...newState,
              winners: [],
            };
          } else if (data?.state === "WAITING_FOR_PLAYERS") {
            newState = {
              ...newState,
              seats: newState.seats.map((seat) => ({
                ...seat,
                holeCards: [],
                hand: null,
              })),
            };
          }
          return newState;
        });
        break;
      }
      case "TURN_UPDATE": {
        console.log("Received turn update event:", data);
        setGameState((prevState) => {
          const newState: GameState = {
            ...prevState,
            currentPlayerSeat: data?.currentPlayerSeat || 0,
            turnPlayer: prevState.seats[data?.currentPlayerSeat]?.user || null,
          };
          return newState;
        });
        if (data?.currentPlayerSeat) {
          startTurnTimer();
        }
        break;
      }
      case "HOLE_CARDS": {
        console.log("Received hole cards event:", data);
        setGameState((prevState) => ({
          ...prevState,
          seats: prevState.seats.map((seat, idx) =>
            data?.holeCards?.[idx]
              ? { ...seat, holeCards: data.holeCards[idx], hand: null }
              : seat
          ),
        }));
        break;
      }
      case "PLAYER_ACTION": {
        console.log("Received player action event:", data);
        setGameState((prevState) => {
          const newState: GameState = {
            ...prevState,
            seats: prevState.seats.map((seat, idx) =>
              idx === data?.seatId
                ? {
                    ...seat,
                    isFolded: data?.action === "FOLD",
                    isAllIn: data?.action === "ALL_IN",
                    stack: seat?.stack - (data?.amount || 0),
                  }
                : seat
            ),
            currentPot: data?.currentPot,
            currentBets: data?.currentBets || {},
          };
          return newState;
        });
        break;
      }
      case "PLAYER_STACKS": {
        console.log("Received player stacks event:", data);

        setGameState((prevState) => {
          return {
            ...prevState,
            winners: data?.winners || [],
            seats: prevState.seats.map((seat, idx) => {
              return data?.stacks?.[idx]
                ? {
                    ...seat,
                    stack: data.stacks[idx],
                    hand: data.hands[idx],
                    holeCards: data.revealedCards?.[idx],
                  }
                : seat;
            }),
          };
        });

        break;
      }
    }
  };

  const handleAuthEvent = (data: any) => {
    messageAPI.success("Та амжилттай холбогдлоо");
    setGameState((prevState) => ({
      ...prevState,
      isAuthenticated: true,
      usableBalance: data?.balance || 0,
    }));
    console.log(data);
    // console.log("Authenticated", data?.user);
    if (data?.user) {
      userInfoRef.current = data?.user;
      ws.current?.send(
        JSON.stringify({
          type: "TABLE",
          data: {
            tableId: parseInt(tableId || "0"),
            action: "SUBSCRIBE",
          },
        })
      );
    }
  };

  const sendGameAction = (action: string, amount?: number) => {
    console.log("Sending action:", action, "with amount:", amount);
    ws.current?.send(
      JSON.stringify({
        type: "GAME",
        data: {
          tableId: parseInt(tableId || "0"),
          action: action,
          amount: amount,
        },
      })
    );
  };

  const seatOut = () => {
    // Remove player from their seat
    leaveSeat(selectedSeat || 0); // your existing seat leave logic
    setSelectedSeat(null); // or however you're clearing the seat
    console.log("Player has left the seat");
  };

  const establishWebSocketConnection = (delay = 0) => {
    if (
      ws.current &&
      (ws.current.readyState === WebSocket.OPEN ||
        ws.current.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    setTimeout(() => {
      ws.current = new WebSocket(websocketURL);

      ws.current.onmessage = (event) => {
        const message: WebsocketEvent = JSON.parse(event.data);
        switch (message.type) {
          case "CONNECTED": {
            setIsDisconnected(false);
            authenticateSocket();
            break;
          }
          case "AUTH": {
            handleAuthEvent(message.data);
            break;
          }
          case "TABLE": {
            handleTableEvent(message.data);
            break;
          }
          case "GAME": {
            handleGameEvent(message.data);
            break;
          }
          case "ERROR": {
            messageAPI.error(
              message.data?.error ? message.data.error : "Алдаа гарлаа"
            );
            break;
          }
        }
      };

      ws.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      ws.current.onclose = () => {
        console.log("WebSocket disconnected");
        if (!isDisconnected) {
          messageAPI.error("Холболт тасалдлаа. Дахин холбогдож байна...");
          setIsDisconnected(true);
        }

        ws.current = null;
        establishWebSocketConnection(2000);
      };
    }, delay);

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  };

  useEffect(() => {
    if (tableId.length > 0) {
      establishWebSocketConnection();
    }
    return () => {
      if (ws.current) {
        ws.current.close();
        ws.current = null;
      }
    };
  }, [tableId]);

  useEffect(() => {
    if (previewTableId) {
      setTableId(previewTableId);
    } else if (pathTableId) {
      setTableId(pathTableId);
    }
  }, [previewTableId, pathTableId]);

  useEffect(() => {
    if (setPreviewSeats) {
      setPreviewSeats(gameState.seats);
    }
    if (
      gameState.state === "FINISHED" ||
      gameState.state === "WAITING_FOR_PLAYERS"
    ) {
      gameState.seats.forEach((seat, index) => {
        if (seat.user?.userId === userInfoRef.current?.userId) {
          if (seat.stack <= gameState.bigBlind) {
            setSelectedSeat(index);
            setModalType("RECHARGE");
          }
        }
      });
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState?.minBuyIn && rechargeAmount === 0) {
      setRechargeAmount(gameState.minBuyIn);
    }
  }, [gameState.minBuyIn]);

  if (!gameState.isAuthenticated) {
    return (
      <Flex style={authLoadingStyles}>
        <Spin size="large" tip="Loading..." />
        <Typography.Text
          style={{ marginTop: 16, fontSize: 14, fontStyle: "italic" }}
        >
          LOADING...
        </Typography.Text>
      </Flex>
    );
  }

  const iconBtnStyle = () => ({
    background: "transparent",
    border: "none",
    color: "white",
  });

  return (
    <Flex
      vertical
      style={{
        ...containerStyles,
      }}
    >
      <TableActionButtons
        isPreview={isPreview}
        iconBtnStyle={iconBtnStyle}
        setModalType={setModalType}
        userHasSeat={userHasSeat}
        userSeatIndex={userSeatIndex}
        seatOut={seatOut}
        leaveSeat={leaveSeat}
        selectedSeat={selectedSeat ?? undefined}
        navigate={navigate}
      />
      <Flex
        style={
          isPreview
            ? {
                position: "absolute",
                top: "100%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: width,
                height: height,
                marginTop: 0,
                marginLeft: 0,
              }
            : {
                position: "absolute",
                top: "45%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: width,
                height: height,
                marginTop: 0,
                marginLeft: 0,
              }
        }
      >
        {contextHolder}
        <Modal
          className="custom-login-modal"
          open={modalType?.length > 0}
          footer={null}
          title={
            modalType === "RECHARGE" ? t("modal.recharge") : t("modal.sit")
          }
          onCancel={() => setModalType("")}
        >
          <Form
            onFinish={() => {
              if (modalType === "RECHARGE") {
                recharge(rechargeAmount);
              } else {
                console.log(
                  "Calling takeSeat with:",
                  selectedSeat,
                  rechargeAmount
                );
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
                        if (
                          prevValue - gameState.bigBlind <
                          gameState.minBuyIn
                        ) {
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
                        if (
                          prevValue + gameState.bigBlind >
                          gameState.maxBuyIn
                        ) {
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
              <Button
                type="default"
                htmlType="submit"
                style={{ fontSize: "12px" }}
              >
                {modalType === "RECHARGE"
                  ? t("modal.recharge")
                  : t("modal.sit")}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
        <div
          style={{
            ...tableStyles,
            position: "relative",
            backgroundImage: `url(${isMobile ? MobileTable : DesktopTable})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            height: tableHeight,
            width: tableWidth,
            maxWidth: maxTableWidth,
            transform: isMobile ? "translateY(-130px)" : "none", // Move UP 50px on mobile
            transition: "transform 0.3s ease", // optional smoothness
          }}
        >
          <Flex
            style={{ width: "100%", height: "100%" }}
            vertical
            justify="center"
            align="center"
            gap={12}
          >
            <Flex>
              <Typography.Text className="total-pot">
                Total Pot: {gameState.currentPot}
              </Typography.Text>
            </Flex>
            <Flex>
              {gameState.communityCards?.map((communityCard, index) => {
                let isMyCard = false;
                gameState.seats.forEach((seat) => {
                  if (userInfoRef.current?.userId === seat.user?.userId) {
                    seat?.hand?.combinationCards?.forEach((card) => {
                      if (
                        card.suit === communityCard.suit &&
                        card.rank === communityCard.rank
                      ) {
                        isMyCard = true;
                      }
                    });
                  }
                });
                // console.log(gameState.seats);
                return (
                  <div key={index} style={playerCardStyle}>
                    <PokerCard
                      info={communityCard}
                      style={{
                        outline: isMyCard ? `5px solid red` : "none",
                      }}
                    />
                  </div>
                );
              })}
            </Flex>
          </Flex>
        </div>

        {/* Player seats - absolutely positioned relative to outer table */}

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 2,
            transform: isMobile
              ? isSmallPhone
                ? "translateY(-70px)" // small phone
                : "translateY(-100px)" // other mobiles
              : "none",
            transition: "transform 0.3s ease",
          }}
        >
          {gameState.seats.map((seat: GamePlayer, ind: number) => {
            const myUserId = userInfoRef.current?.userId;
            const mySeatIndex = gameState.seats.findIndex(
              (seat) => seat.user?.userId === myUserId
            );
            const centerIndex = Math.floor(seatCount / 4);
            let rotatedIndex = ind;

            if (mySeatIndex !== -1) {
              const relativePosition = ind - mySeatIndex;
              rotatedIndex =
                (relativePosition + centerIndex + seatCount) % seatCount;
            }

            const angle = (2 * Math.PI * rotatedIndex) / seatCount;

            const sin = Math.sin(angle);

            // Adjust Y radius for top/bottom seats
            let adjustedRadiusY = seatRadiusY;
            if (Math.abs(sin) > 0.9) {
              adjustedRadiusY = isMobile ? (isSmallPhone ? 50 : 45) : 40;
            }

            const x = centerX + seatRadiusX * Math.cos(angle);
            const y = centerY + adjustedRadiusY * sin;

            return (
              <Button
                className={`seat${isPreview ? " preview" : ""}`}
                key={ind}
                onClick={() => {
                  setSelectedSeat(ind);
                  setModalType("TAKE_SEAT");
                }}
                disabled={isPreview || isSeatTaken(ind)}
                style={{
                  ...playerSeatStyle,
                  position: "absolute",
                  left: `${x}%`,
                  top: `${y}%`,
                  pointerEvents: "auto",
                  fontStyle: "italic",
                }}
              >
                {seat?.user?.userId ? (
                  <Flex>
                    <TablePlayer
                      player={seat}
                      isMe={ind === mySeatIndex}
                      isTurn={ind === gameState.currentPlayerSeat}
                      holeCards={seat?.holeCards || []}
                      progress={
                        ind === gameState.currentPlayerSeat ? turnProgress : 0
                      }
                    />
                  </Flex>
                ) : (
                  `${t("seat")}`
                )}
              </Button>
            );
          })}
        </div>

        {/* Player chips - absolutely positioned relative to outer table */}
        <div>
          {gameState.seats.map((_: GamePlayer, i: number) => {
            const isMobile = window.innerWidth < 768;

            const myUserId = userInfoRef.current?.userId;
            const mySeatIndex = gameState.seats.findIndex(
              (seat) => seat.user?.userId === myUserId
            );
            const centerIndex = Math.floor(seatCount / 4);
            let rotatedIndex = i;

            if (mySeatIndex !== -1) {
              const relativePosition = i - mySeatIndex;
              rotatedIndex =
                (relativePosition + centerIndex + seatCount) % seatCount;
            }

            const angle = (2 * Math.PI * rotatedIndex) / seatCount;

            const extraYOffset = isMobile ? -22 : 0;
            const chipOffsetX = isMobile ? 7 : -7;
            const chipOffsetY = isMobile ? 5 : 15;

            const chipRadiusXAdjusted = chipRadiusX - chipOffsetX;
            const chipRadiusYAdjusted = chipRadiusY - chipOffsetY;

            // Both avatar and chip use the same mobile adjustment
            const avatarRadiusX = isMobile
              ? chipRadiusX * 0.8
              : chipRadiusXAdjusted;
            const avatarRadiusY = isMobile
              ? chipRadiusY * 0.9
              : chipRadiusYAdjusted;

            const distanceFactorAvatar = 1.2; // seat (avatar) position
            const distanceFactorChip = 1; // chip comes closer to center

            // Starting point (from avatar/seat)
            const avatarX =
              centerX + avatarRadiusX * distanceFactorAvatar * Math.cos(angle);
            const avatarY =
              centerY +
              avatarRadiusY * distanceFactorAvatar * Math.sin(angle) +
              extraYOffset;

            // Ending point (where chip stops)
            const chipX =
              centerX + avatarRadiusX * distanceFactorChip * Math.cos(angle);
            const chipY =
              centerY +
              avatarRadiusY * distanceFactorChip * Math.sin(angle) +
              extraYOffset;

            const playerBet = gameState.currentBets[i] || 0;

            if (playerBet > 0) {
              return (
                <motion.div
                  key={i}
                  initial={{
                    left: `${avatarX}%`,
                    top: `${avatarY}%`,
                  }}
                  animate={{
                    left: `${chipX}%`,
                    top: `${chipY}%`,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 150,
                    damping: 20,
                  }}
                  style={{
                    ...seatChipStyle,
                    position: "absolute",
                  }}
                >
                  <PokerChip amount={playerBet} />
                </motion.div>
              );
            }
            return null;
          })}
        </div>
      </Flex>

      {!isPreview && (
        <Flex style={actionBarStyles} align="center" justify="center" gap={16}>
          {gameState.state !== "WAITING_FOR_PLAYERS" && (
            <PokerActions
              stack={
                gameState.seats?.filter(
                  (seat) => seat.user?.userId === userInfoRef.current?.userId
                )[0]?.stack || 0
              }
              player={userInfoRef.current}
              turnPlayer={gameState.turnPlayer}
              isFolded={
                gameState.isFolded ||
                gameState.state === "FINISHED" ||
                gameState.state === "SHOWDOWN"
              }
              isAllIn={gameState.isAllIn}
              currentBet={
                gameState.currentBets[gameState.currentPlayerSeat] || 0
              }
              currentRequiredBet={Math.max(
                ...Object.values(gameState.currentBets),
                0
              )}
              currentPot={gameState.currentPot}
              minRaise={gameState.bigBlind}
              sendAction={(action, amount) => sendGameAction(action, amount)}
            />
          )}
        </Flex>
      )}
    </Flex>
  );
}

export default TexasTableGame;
