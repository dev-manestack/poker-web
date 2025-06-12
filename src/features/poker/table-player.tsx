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
  const size = 80; // default size, adjust if needed or make dynamic if you want
  const stroke = 3;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  const isMyCard = (holeCard: GameCard): boolean => {
    return (
      player?.hand?.combinationCards?.some(
        (card) => card.suit === holeCard.suit && card.rank === holeCard.rank
      ) ?? false
    );
  };

  return (
    <Flex style={{ flexDirection: "column" }} justify="center" align="center">
      {player?.hand?.rank && (
        <Typography.Text className="rank-text">
          {player.hand.rank}
        </Typography.Text>
      )}
      <Flex className="hole-cards-container">
        {holeCards[0] && (
          <PokerCard
            info={holeCards[0]}
            style={{
              outline: isMyCard(holeCards[0]) ? "5px solid red" : "none",
            }}
          />
        )}
        {holeCards[1] && (
          <PokerCard
            info={holeCards[1]}
            style={{
              outline: isMyCard(holeCards[1]) ? "5px solid red" : "none",
            }}
          />
        )}
      </Flex>

      <div className="player-image-wrapper">
        {progress > 0 && (
          <svg
            width="100%"
            height="100%"
            className="svg-circle"
            viewBox={`0 0 ${size} ${size}`} // pass fixed size for circle math, optional
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
          src="https://static.vecteezy.com/system/resources/thumbnails/048/216/761/small/modern-male-avatar-with-black-hair-and-hoodie-illustration-free-png.png"
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
