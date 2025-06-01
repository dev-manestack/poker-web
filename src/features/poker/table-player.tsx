import { Flex, Image, Typography } from "antd";
import type { GameCard, GamePlayer } from "../../api/game";
import PokerCard from "./poker-card";

function TablePlayer({
  player,
  isTurn,
  holeCards,
  progress,
}: {
  player: GamePlayer | undefined;
  isTurn: boolean;
  holeCards: GameCard[];
  progress: number;
}) {
  const size = 100;
  const stroke = 6;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <Flex vertical justify="center" align="center">
      <Flex style={{ height: "80px", marginBottom: "-40px" }}>
        {holeCards[0] && <PokerCard info={holeCards[0]} />}
        {holeCards[1] && (
          <PokerCard info={holeCards[1]} style={{ marginLeft: "-30px" }} />
        )}
      </Flex>
      <div style={{ position: "relative", width: size, height: size }}>
        {/* Circular progress border */}
        {progress > 0 && (
          <svg
            width={size}
            height={size}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 2,
              pointerEvents: "none",
            }}
          >
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#fff"
              strokeWidth={stroke}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{
                transition: "stroke-dashoffset 0.2s linear",
              }}
            />
          </svg>
        )}
        <Image
          preview={false}
          style={{
            width: size,
            height: size,
            background: "#030A01",
            borderRadius: "50%",
            border:
              isTurn && progress === 0 ? "3px solid rgba(255,255,255,0.5)" : "",
            position: "relative",
            zIndex: 1,
          }}
          src={
            "https://static.vecteezy.com/system/resources/thumbnails/048/216/761/small/modern-male-avatar-with-black-hair-and-hoodie-illustration-free-png.png"
          }
        />
      </div>
      <Flex
        style={{
          borderRadius: "10px",
          background: "#030A01",
          padding: "8px 16px",
          border: "1px solid rgba(255, 255, 255, 0.5)",
          marginTop: "-16px",
          width: "80px",
          zIndex: 2,
        }}
        vertical
        gap={5}
      >
        <Typography.Text style={{ marginLeft: "8px", color: "#fff" }}>
          {player?.stack ? player?.stack.toLocaleString("mn-MN") : 0}₮
        </Typography.Text>
      </Flex>
      <Typography.Text
        style={{
          marginLeft: "8px",
          color: "#000",
          background: "#fff",
          padding: "8px 16px",
          borderRadius: "10px",
        }}
      >
        {player?.user?.username ? player?.user?.username : "Waiting for player"}
      </Typography.Text>
    </Flex>
  );
}

export default TablePlayer;
