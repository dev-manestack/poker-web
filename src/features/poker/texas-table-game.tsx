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
  tableWrapperStyles,
  tableStyles,
  contentStyles,
  playerCardStyle,
  seatChipStyle,
  playerSeatStyle,
  actionBarStyles,
  authLoadingStyles,
} from "../../styles/PokerTableStyles.ts";
import { LeftOutlined, PlusOutlined } from "@ant-design/icons";
import { FundOutlined, WalletOutlined } from "@ant-design/icons";

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
}: {
  isPreview?: boolean;
  seatCount?: number;
}) {
  const navigate = useNavigate();
  const { id: tableId } = useParams();
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
    currentPlayerSeat: 0,
    communityCards: [],
    state: "WAITING_FOR_PLAYERS",
  });
  const [turnProgress, setTurnProgress] = useState(1); // 1 = 100%, 0 = 0%
  const timerRef = useRef<number | null>(null);
  const userInfoRef = useRef<User | null>(null);

  const ws = useRef<WebSocket | null>(null);

  const centerX = 50;
  const centerY = 50;
  const radiusX = 50;
  const radiusY = 50;
  const chipRadiusX = radiusX - 20;
  const chipRadiusY = radiusY - 20;
  const turnDuration = 10; // seconds

  const startTurnTimer = () => {
    if (timerRef.current) {
      cancelAnimationFrame(timerRef.current);
    }
    setTurnProgress(1);
    const start = Date.now();

    function tick() {
      const elapsed = (Date.now() - start) / 1000;
      const percent = Math.max(1 - elapsed / turnDuration, 0);
      setTurnProgress(percent);
      if (percent > 0) {
        timerRef.current = requestAnimationFrame(tick);
      }
    }

    timerRef.current = requestAnimationFrame(tick);
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

  const takeSeat = (seatIndex: number, amount: number) => {
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
    Object.entries(tableState.seats).forEach(([index, seat]) => {
      tempArray[parseInt(index)] = {
        user: seat.user,
        stack: seat.stack,
      };
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
          const newState: GameState = {
            ...prevState,
            communityCards: data.communityCards || [],
            state: data?.state,
            currentBets: {},
            currentPot: data?.state === "FINISHED" ? 0 : data?.currentPot || 0,
            seats:
              data?.state === "FINISHED"
                ? prevState.seats.map((seat) => {
                    return {
                      ...seat,
                      holeCards: [],
                    };
                  })
                : prevState.seats,
          };
          return newState;
        });
        break;
      }
      case "TURN_UPDATE": {
        setGameState((prevState) => {
          const newState: GameState = {
            ...prevState,
            currentPlayerSeat: data?.currentPlayerSeat || 0,
            turnPlayer: prevState.seats[data?.currentPlayerSeat]?.user || null,
          };
          return newState;
        });
        if (
          gameState.state !== "FINISHED" &&
          gameState.state !== "WAITING_FOR_PLAYERS"
        ) {
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
        setGameState((prevState) => ({
          ...prevState,
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
        }));
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

  const establishWebSocketConnection = (delay = 0) => {
    if (ws.current) {
      return;
    }

    setTimeout(() => {
      ws.current = new WebSocket(websocketURL);

      ws.current.onmessage = (event) => {
        const message: WebsocketEvent = JSON.parse(event.data);
        switch (message.type) {
          case "CONNECTED": {
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
        messageAPI.error("Таны холболт тасарлаа");
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
    establishWebSocketConnection();
  }, []);

  if (!gameState.isAuthenticated) {
    return (
      <Flex style={authLoadingStyles}>
        <Spin />
        <Typography.Text className="auth-waiting-text">
          Та түр хүлээнэ үү.
        </Typography.Text>
      </Flex>
    );
  }

  return (
    <Flex vertical style={containerStyles}>
      <Button
        type="primary"
        style={{
          position: "absolute",
          top: 20,
          left: 20,
        }}
        icon={<LeftOutlined />}
        onClick={() => {
          leaveSeat(selectedSeat || 0);
          navigate("/");
        }}
      >
        Гарах
      </Button>
      <Button
        style={{
          position: "absolute",
          top: 20,
          right: 20,
        }}
        icon={<PlusOutlined />}
        onClick={() => {
          setModalType("RECHARGE");
        }}
      >
        Цэнэглэх
      </Button>
      <Flex style={tableWrapperStyles}>
        {contextHolder}
        <Modal
          open={modalType?.length > 0}
          footer={null}
          title={modalType === "RECHARGE" ? "Цэнэглэх" : "Суух"}
          onCancel={() => setModalType("")}
        >
          <Form
            onFinish={(e) => {
              if (modalType === "RECHARGE") {
                recharge(e.amount);
              } else {
                takeSeat(selectedSeat ? selectedSeat : -1, e.amount);
              }
            }}
          >
            <Form.Item>
              <>
                {/* Game Info with icons */}
                <div style={{ marginBottom: 16 }}>
                  <p>
                    <FundOutlined style={{ marginRight: 8 }} />
                    Game Type: Texas 2,500/5,000
                  </p>
                  <p>
                    <WalletOutlined style={{ marginRight: 8 }} />
                    Available balance: 120,000₮
                  </p>
                </div>

                {/* Хэмжээ and Selected Amount */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <span style={{ fontWeight: 500 }}>Хэмжээ</span>
                  <span
                    style={{
                      padding: "6px 10px",
                      background: "#f5f5f5 !important",
                      borderRadius: 8,
                      fontWeight: 600,
                    }}
                  >
                    100,000₮
                  </span>
                </div>

                {/* Slider with - and + buttons */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <Button>-</Button>
                  <div style={{ flexGrow: 1 }}>
                    <Slider
                      min={25000}
                      max={100000}
                      defaultValue={100000}
                      style={{ height: 8 }} // Increased height
                    />
                  </div>
                  <Button>+</Button>
                </div>

                {/* Preset Buttons */}
                <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
                  <Button>Min</Button>
                  <Button>40BB</Button>
                  <Button>70BB</Button>
                  <Button>Max</Button>
                </div>
              </>
            </Form.Item>

            <Form.Item
              style={{
                display: "flex",
                justifyContent: "end",
              }}
            >
              <Button type="primary" htmlType="submit">
                {modalType === "RECHARGE" ? "Цэнэглэх" : "Суух"}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
        <div style={tableStyles}>
          <Flex style={contentStyles} vertical gap={12}>
            <Typography.Text style={{ color: "#fff" }}>
              Current stage: {gameState.state}
            </Typography.Text>

            <Flex gap={12} style={{ width: "100%", justifyContent: "center" }}>
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

            <PokerChip amount={gameState.currentPot} />
          </Flex>

          <div>
            {gameState.seats.map((seat: GamePlayer, i: number) => {
              const angle = (2 * Math.PI * i) / seatCount;
              const x = centerX + radiusX * Math.cos(angle);
              const y = centerY + radiusY * Math.sin(angle);

              return (
                <Button
                  className="seat"
                  key={i}
                  onClick={() => {
                    setSelectedSeat(i);
                    setModalType("TAKE_SEAT");
                  }}
                  disabled={isPreview}
                  style={{ ...playerSeatStyle, left: `${x}%`, top: `${y}%` }}
                >
                  {seat?.user?.userId ? (
                    <Flex style={{ marginTop: "-100px" }}>
                      <TablePlayer
                        player={seat}
                        isTurn={i === gameState.currentPlayerSeat}
                        holeCards={seat?.holeCards || []}
                        progress={
                          i === gameState.currentPlayerSeat ? turnProgress : 0
                        }
                      />
                    </Flex>
                  ) : (
                    "Суух"
                  )}
                </Button>
              );
            })}
          </div>

          <div>
            {gameState.seats.map((_: GamePlayer, i: number) => {
              const angle = (2 * Math.PI * i) / seatCount;
              const x = centerX + chipRadiusX * Math.cos(angle);
              const y = centerY + chipRadiusY * Math.sin(angle);
              const playerBet = gameState.currentBets[i] || 0;

              if (playerBet > 0) {
                return (
                  <div
                    key={i}
                    className="seat-chip"
                    style={{
                      ...seatChipStyle,
                      left: `${x}%`,
                      top: `${y}%`,
                    }}
                  >
                    <PokerChip amount={playerBet} />
                  </div>
                );
              } else {
                return null;
              }
            })}
          </div>
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
