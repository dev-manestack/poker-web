import { Flex, Image, Typography } from "antd";
import type { GameCard, GamePlayer } from "../../api/game";
import PokerCard from "./poker-card";
import "../../styles/TablePlayer.css";

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
  const size = 80;
  const stroke = 3;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  const isMyCard = (holeCard: GameCard): boolean => {
    return (
      player?.hand?.combinationCards?.some(
        (card) => card.suit === holeCard.suit && card.rank === holeCard.rank
      ) ?? false
    );
  };

  return (
    <Flex
      style={{ flexDirection: "column", position: "relative" }}
      justify="center"
      align="center"
    >
      {player?.hand?.rank && (
        <Typography.Text className="rank-text">
          {player.hand.rank}
        </Typography.Text>
      )}

      {/* Cards over the avatar */}
      <div className="hole-cards-overlay">
        {holeCards[0] && (
          <PokerCard
            info={holeCards[0]}
            style={{
              transform: "rotate(-10deg)",
              position: "absolute",
              left: "-15",
              top: "0",
              outline: isMyCard(holeCards[0]) ? "3px solid red" : "none",
            }}
          />
        )}
        {holeCards[1] && (
          <PokerCard
            info={holeCards[1]}
            style={{
              transform: "rotate(10deg)",
              position: "absolute",
              right: "-15px",
              top: "0",
              outline: isMyCard(holeCards[1]) ? "3px solid red" : "none",
            }}
          />
        )}
      </div>

      <div className="player-image-wrapper">
        {progress > 0 && (
          <svg
            width="100%"
            height="100%"
            className="svg-circle"
            viewBox={`0 0 ${size} ${size}`}
          >
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#fff"
              strokeWidth={stroke}
              strokeDasharray={circumference}
              strokeDashoffset={isTurn ? circumference * (1 - progress) : 0}
              style={{ transition: "stroke-dashoffset 0.2s linear" }}
            />
          </svg>
        )}
        <Image
          preview={false}
          style={{
            width: "100%",
            height: "100%",
          }}
          className={`player-image${
            isTurn && progress === 0 ? " turn-active" : ""
          }`}
          src="https://i.imgur.com/SyIZEu7.png"
        />
      </div>

      <Flex className="stack-box">
        <Typography.Text className="username-text">
          {player?.user?.username ?? "Waiting for player"}
        </Typography.Text>
        <Typography.Text className="stack-text">
          {player?.stack ? player.stack.toLocaleString("mn-MN") : 0}₮
        </Typography.Text>
      </Flex>
    </Flex>
  );
}

export default TablePlayer;
