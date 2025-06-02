import { Button, Flex, message, Spin, Typography } from "antd";
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
import { useParams } from "react-router";
import TablePlayer from "./table-player";
import PokerActions from "./poker-actions";
import type { User } from "../../api/user";
import PokerChip from "./poker-chip";

interface GameState {
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
    | "INITIAL"
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
  const { id: tableId } = useParams();
  const [messageAPI, contextHolder] = message.useMessage();
  const [gameState, setGameState] = useState<GameState>({
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
    state: "INITIAL",
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

  const takeSeat = (seatIndex: number) => {
    if (gameState.isAuthenticated) {
      ws.current?.send(
        JSON.stringify({
          type: "TABLE",
          data: {
            tableId: parseInt(tableId || "0"),
            action: "TAKE_SEAT",
            seatIndex: seatIndex,
          },
        })
      );
    } else {
      messageAPI.error("Та ширээнд суухын тулд эхлээд холбогдох хэрэгтэй");
    }
  };

  const handleTableEvent = (data: any) => {
    const tableState: TableState = data?.table;
    const tempArray = new Array(seatCount).fill(null);
    Object.entries(tableState.seats).forEach(([index, seat]) => {
      tempArray[parseInt(index)] = {
        user: seat.user,
        stack: seat.stack,
      };
    });
    setGameState((prevState) => ({
      ...prevState,
      // seats: tempArray,
      seats: tempArray.map((seat) => ({
        ...seat,
        holeCards: seat?.holeCards || [],
        isAllIn: seat?.isAllIn || false,
        isFolded: seat?.isFolded || false,
      })),
    }));
    switch (data.action) {
      case "TAKE_SEAT": {
        const sound = new Howl({
          src: [SuccessAudio],
          volume: 0.5,
        });
        sound.play();
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
        if (gameState.state !== "FINISHED") {
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
      case "REVEAL_CARDS": {
        console.log("Received reveal cards event:", data);
        setGameState((prevState) => {
          const newState = {
            ...prevState,
            seats: prevState.seats.map((seat, idx) => {
              console.log(data?.revealedCards?.[idx]);
              return data?.revealedCards?.[idx]
                ? { ...seat, holeCards: data.revealedCards?.[idx] }
                : seat;
            }),
          };
          console.log("Updated game state with revealed cards:", newState);
          return newState;
        });
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
          seats: prevState.seats.map((seat, idx) =>
            data?.stacks?.[idx]
              ? { ...seat, stack: data.stacks[idx], hand: data.hands[idx] }
              : seat
          ),
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
    }));
    console.log("Authenticated", data?.user);
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
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
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
      <Flex
        vertical
        justify="center"
        align="center"
        gap={16}
        style={{
          height: "100vh",
          width: "100vw",
        }}
      >
        <Spin />
        <Typography.Text>Та түр хүлээнэ үү.</Typography.Text>
      </Flex>
    );
  }

  return (
    <Flex
      vertical
      style={{ width: "100vw", height: "100%", overflow: "hidden" }}
    >
      <Flex
        style={{
          position: "absolute",
          width: "60%",
          height: "40%",
          marginTop: "10%",
          marginLeft: "20%",
        }}
      >
        {contextHolder}
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "#314361",
            border: "30px solid #3B4F6F",
            borderRadius: "50% / 40%",
            boxShadow: "0 0 15px rgba(0, 0, 0, 0.6)",
            position: "relative",
          }}
        >
          <Flex
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "0 30px",
              height: "400px",
              flexWrap: "wrap",
            }}
            vertical
            gap={12}
          >
            <Typography.Text
              style={{
                color: "#fff",
              }}
            >
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
                  <div key={index} style={{ height: "100px" }}>
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
              const style = {
                left: `${x}%`,
                top: `${y}%`,
                height: "50px",
                width: "50px",
              };
              return (
                <Button
                  className="seat"
                  style={style}
                  key={i}
                  onClick={() => {
                    takeSeat(i);
                  }}
                  disabled={isPreview}
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
                      position: "absolute",
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: "translate(-50%, -50%)",
                      width: "28px",
                      height: "28px",
                      zIndex: 2,
                      pointerEvents: "none",
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
        <Flex
          style={{
            width: "100%",
            position: "absolute",
            bottom: 0,
            right: 10,
            paddingTop: "16px",
          }}
          align="center"
          justify="center"
          gap={16}
        >
          {gameState.state !== "INITIAL" && (
            <PokerActions
              stack={500}
              player={userInfoRef.current}
              turnPlayer={gameState.turnPlayer}
              isFolded={gameState.isFolded}
              isAllIn={gameState.isAllIn}
              currentBet={
                gameState.currentBets[gameState.currentPlayerSeat] || 0
              }
              currentRequiredBet={Math.max(
                ...Object.values(gameState.currentBets),
                0
              )}
              currentPot={gameState.currentPot}
              minRaise={100}
              sendAction={(action, amount) => sendGameAction(action, amount)}
            />
          )}
        </Flex>
      )}
    </Flex>
  );
}

export default TexasTableGame;
