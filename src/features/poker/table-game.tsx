import { Button } from "antd";
import "./table-game.css";
import { useEffect, useRef } from "react";
import PokerCard from "./poker-card";

function TableGame({
  isPreview = false,
  seatCount = 8,
}: {
  isPreview?: boolean;
  seatCount?: number;
}) {
  const ws = useRef<WebSocket | null>(null);

  const centerX = 50;
  const centerY = 50;
  const radiusX = 50;
  const radiusY = 50;

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
      <Button className="seat" style={style} key={i}>
        {isPreview ? "" : `Суух`}
      </Button>
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
            height: "100px",
            width: "100px",
          }}
        >
          <PokerCard suit="Heart" rank="Ten" />
        </div>
        <div>{seats}</div>
      </div>
    </div>
  );
}

export default TableGame;
