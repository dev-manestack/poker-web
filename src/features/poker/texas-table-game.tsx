import { Button, Flex, message, Spin, Typography } from "antd";
import { useEffect, useRef, useState } from "react";
import type { CardInfo } from "./poker-card";
import PokerCard from "./poker-card";
import "./texas-table-game.css";
import {
  // DealCardAudio,
  DisconnectAudio,
  SuccessAudio,
} from "../../assets/sounds";
import {
  websocketURL,
  type GameState,
  type TableState,
  type WebsocketEvent,
} from "../../api/game";
import { useParams } from "react-router";
import TablePlayer from "./table-player";
import PokerActions from "./poker-actions";
import PokerChat from "./poker-chat";

function TexasTableGame({
  isPreview = false,
  seatCount = 8,
}: {
  isPreview?: boolean;
  seatCount?: number;
}) {
  const { id: tableId } = useParams();
  const [messageAPI, contextHolder] = message.useMessage();
  const [cards, setCards] = useState<CardInfo[]>([]);
  const [gameState, setGameState] = useState<GameState>({
    isAuthenticated: false,
    seats: [],
  });

  const ws = useRef<WebSocket | null>(null);

  const centerX = 50;
  const centerY = 50;
  const radiusX = 50;
  const radiusY = 50;
  // const cardRadiusX = radiusX - 5;
  // const cardRadiusY = radiusY - 10;
  // const chipRadiusX = radiusX - 20;
  // const chipRadiusY = radiusY - 20;

  const seats = Array.from({ length: seatCount }, (_, i) => {
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
        {gameState?.seats?.length > i && gameState.seats[i]?.user ? (
          <TablePlayer player={gameState?.seats[i]} />
        ) : (
          "Суух"
        )}
      </Button>
    );
  });

  // const seatCards = Array.from({ length: seatCount }, (_, i) => {
  //   const angle = (2 * Math.PI * i) / seatCount;
  //   const x = centerX + cardRadiusX * Math.cos(angle);
  //   const y = centerY + cardRadiusY * Math.sin(angle);
  //   return (
  //     <Flex
  //       key={i}
  //       className="seat-cards"
  //       style={{
  //         left: `calc(${x}% - 20px)`,
  //         top: `${y}%`,
  //         position: "absolute",
  //         width: "40px",
  //         height: "60px",
  //         transform: "translate(-50%, -50%)",
  //         display: isPreview ? "none" : "flex",
  //       }}
  //     >
  //       <PokerCard suit="Heart" rank="Ace" isRevealed={false} />
  //       <PokerCard suit="Spade" rank="Ace" isRevealed={false} />
  //     </Flex>
  //   );
  // });

  // const seatChips = Array.from({ length: seatCount }, (_, i) => {
  //   const angle = (2 * Math.PI * i) / seatCount;
  //   const x = centerX - 1 + chipRadiusX * Math.cos(angle);
  //   const y = centerY - 2 + chipRadiusY * Math.sin(angle);
  //   return (
  //     <div
  //       key={i}
  //       className="seat-chip"
  //       style={{
  //         position: "absolute",
  //         left: `${x}%`,
  //         top: `${y}%`,
  //         transform: "translate(-50%, -50%)",
  //         width: "28px",
  //         height: "28px",
  //         zIndex: 2,
  //         pointerEvents: "none",
  //       }}
  //     >
  //       <PokerChip amount={5000} />
  //     </div>
  //   );
  // });

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
      seats: tempArray,
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
    console.log(data);
  };

  const establishWebSocketConnection = (delay = 0) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      return;
    }

    setTimeout(() => {
      ws.current = new WebSocket(websocketURL);

      ws.current.onopen = () => {
        console.log("WebSocket connected");
      };

      ws.current.onmessage = (event) => {
        const message: WebsocketEvent = JSON.parse(event.data);
        switch (message.type) {
          case "CONNECTED": {
            authenticateSocket();
            break;
          }
          case "AUTH": {
            messageAPI.success("Та амжилттай холбогдлоо");
            setGameState((prevState) => ({
              ...prevState,
              isAuthenticated: true,
            }));
            ws.current?.send(
              JSON.stringify({
                type: "TABLE",
                data: {
                  tableId: parseInt(tableId || "0"),
                  action: "JOIN_TABLE",
                },
              })
            );
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
          width: "80%",
          height: "60%",
          marginTop: "5%",
          marginLeft: "10%",
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
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "0 30px",
              height: "400px",
              marginTop: "calc(40vh - 200px)",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            {cards?.map((card, index) => (
              <div
                key={index}
                style={{ height: "100px" }}
                onClick={() => {
                  setCards((prevCards) =>
                    prevCards.map((c, i) =>
                      i === index ? { ...c, isRevealed: true } : c
                    )
                  );
                }}
              >
                <PokerCard
                  suit={card.suit}
                  rank={card.rank}
                  isRevealed={card.isRevealed}
                />
              </div>
            ))}
          </div>
          <div>{seats}</div>
        </div>
      </Flex>
      {!isPreview && (
        <Flex
          style={{
            width: "100%",
            padding: "16px",
            position: "absolute",
            bottom: 20,
            right: 10,
          }}
          align="center"
          justify="space-between"
          gap={16}
        >
          <PokerChat />
          <PokerActions />
        </Flex>
      )}
    </Flex>
  );
}

/*
<Button
          onClick={() => {
            setCards([
              ...cards,
              { suit: "Heart", rank: "Ten", isRevealed: false },
            ]);
            const sound = new Howl({
              src: [DealCardAudio],
              volume: 0.5,
            });
            sound.play();
          }}
        >
          Test
        </Button> 
*/

export default TexasTableGame;
