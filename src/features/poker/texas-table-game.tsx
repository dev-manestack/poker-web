import { Avatar, Button, Flex, message } from "antd";
import { useEffect, useRef, useState } from "react";
import type { CardInfo } from "./poker-card";
import PokerCard from "./poker-card";
import "./texas-table-game.css";
import { DealCardAudio } from "../../assets/sounds";
import PokerChip from "./poker-chip";
import {
  websocketURL,
  type GameState,
  type WebsocketEvent,
} from "../../api/game";
import { useParams } from "react-router";

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
  const gameRef = useRef<GameState>({
    isAuthenticated: false,
    currentSeat: undefined,
  });

  const ws = useRef<WebSocket | null>(null);

  const centerX = 50;
  const centerY = 50;
  const radiusX = 50;
  const radiusY = 50;
  const cardRadiusX = radiusX - 5;
  const cardRadiusY = radiusY - 10;
  const chipRadiusX = radiusX - 20;
  const chipRadiusY = radiusY - 20;

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
        {isPreview ? (
          ""
        ) : gameRef.current.currentSeat === i ? (
          <Avatar />
        ) : (
          `Суух`
        )}
      </Button>
    );
  });

  const seatCards = Array.from({ length: seatCount }, (_, i) => {
    const angle = (2 * Math.PI * i) / seatCount;
    const x = centerX + cardRadiusX * Math.cos(angle);
    const y = centerY + cardRadiusY * Math.sin(angle);
    return (
      <Flex
        className="seat-cards"
        style={{
          left: `calc(${x}% - 20px)`,
          top: `${y}%`,
          position: "absolute",
          width: "40px",
          height: "60px",
          transform: "translate(-50%, -50%)",
          display: isPreview ? "none" : "flex",
        }}
      >
        <PokerCard suit="Heart" rank="Ace" isRevealed={false} />
        <PokerCard suit="Spade" rank="Ace" isRevealed={false} />
      </Flex>
    );
  });

  const seatChips = Array.from({ length: seatCount }, (_, i) => {
    const angle = (2 * Math.PI * i) / seatCount;
    const x = centerX - 1 + chipRadiusX * Math.cos(angle);
    const y = centerY - 2 + chipRadiusY * Math.sin(angle);
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
        <PokerChip amount={5000} />
      </div>
    );
  });

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
    if (gameRef.current.isAuthenticated) {
      ws.current?.send(
        JSON.stringify({
          type: "TABLE",
          data: {
            tableId: tableId,
            action: "TAKE_SEAT",
            seatIndex: seatIndex,
          },
        })
      );
    } else {
      messageAPI.error("Та ширээнд суухын тулд эхлээд холбогдох хэрэгтэй");
    }
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
        console.log("Message received:", message);
        switch (message.type) {
          case "CONNECTED": {
            authenticateSocket();
            break;
          }
          case "AUTH": {
            messageAPI.success("Та амжилттай холбогдлоо");
            gameRef.current.isAuthenticated = true;
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

  return (
    <div className="table-wrapper">
      {contextHolder}
      <div className="poker-table">
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
        <div>{seatCards}</div>
        <div
          className="pot-chip"
          style={{
            position: "absolute",
            left: `${centerX}%`,
            top: `calc(${centerY}% + 100px)`,
            transform: "translate(-50%, -50%)",
            width: "40px",
            height: "40px",
            zIndex: 2,
            pointerEvents: "none",
          }}
        >
          <PokerChip amount={5000} />
        </div>
        <div>{seatChips}</div>
      </div>
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
    </div>
  );
}

export default TexasTableGame;
