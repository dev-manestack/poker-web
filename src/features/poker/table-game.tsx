import { Avatar, Button, Flex } from "antd";
import { useEffect, useRef, useState } from "react";
import type { CardInfo } from "./poker-card";
import PokerCard from "./poker-card";
import "./table-game.css";
import { DealCardAudio } from "../../assets/sounds";

function TableGame({
  isPreview = false,
  seatCount = 8,
}: {
  isPreview?: boolean;
  seatCount?: number;
}) {
  const [mySeat, setMySeat] = useState<number | null>(null);
  const [cards, setCards] = useState<CardInfo[]>([]);

  const ws = useRef<WebSocket | null>(null);

  const centerX = 50;
  const centerY = 50;
  const radiusX = 50;
  const radiusY = 50;
  const cardRadiusX = radiusX - 5;
  const cardRadiusY = radiusY - 10;

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
          setMySeat(i);
        }}
        disabled={isPreview}
      >
        {isPreview ? "" : mySeat === i ? <Avatar /> : `Суух`}
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

  const establishWebSocketConnection = () => {
    const accessToken = "12345";

    if (ws.current?.OPEN) {
      return;
    }

    ws.current = new WebSocket(
      `ws://127.0.0.1:8080/ws/table/1?accessToken=${accessToken}`
    );

    ws.current.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("Message received:", message);
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.current.onclose = () => {
      console.log("WebSocket disconnected");
      ws.current = null;
      establishWebSocketConnection();
    };

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

export default TableGame;
