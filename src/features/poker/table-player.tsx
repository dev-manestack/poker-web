import { Flex, Image, Typography } from "antd";
import type { GameCard, GamePlayer } from "../../api/game";
import PokerCard from "./poker-card";
import * as styles from "../../styles/TablePlayer.styles";

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
  const { size, radius, circumference, stroke } = styles.sizeConst;
  const offset = circumference * (1 - progress);

  const isMyCard = (holeCard: GameCard): boolean => {
    return (
      player?.hand?.combinationCards?.some((card) => card.suit === holeCard.suit && card.rank === holeCard.rank) ??
      false
    );
  };

  return (
    <Flex style={{ flexDirection: "column" }} justify="center" align="center">
      {player?.hand?.rank && <Typography.Text style={styles.rankText}>{player.hand.rank}</Typography.Text>}
      <Flex style={styles.holeCardsContainer}>
        {holeCards[0] && <PokerCard info={holeCards[0]} style={styles.pokerCardOutline(isMyCard(holeCards[0]))} />}
        {holeCards[1] && <PokerCard info={holeCards[1]} style={styles.pokerCardOutline(isMyCard(holeCards[1]))} />}
      </Flex>
      <div style={styles.playerImageWrapper}>
        {progress > 0 && (
          <svg width={size} height={size} style={styles.svgCircle}>
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
          style={styles.playerImage(isTurn && progress === 0)}
          src="https://static.vecteezy.com/system/resources/thumbnails/048/216/761/small/modern-male-avatar-with-black-hair-and-hoodie-illustration-free-png.png"
        />
      </div>
      <Flex style={styles.stackBox}>
        <Typography.Text style={styles.usernameText}>{player?.user?.username ?? "Waiting for player"}</Typography.Text>
        <Typography.Text style={styles.stackText}>
          {player?.stack ? player.stack.toLocaleString("mn-MN") : 0}₮
        </Typography.Text>
      </Flex>
    </Flex>
  );
}

export default TablePlayer;
