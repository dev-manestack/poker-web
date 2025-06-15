import { useEffect, useState } from "react";
import { Flex, Typography } from "antd";
import type { GameCard, GamePlayer } from "../../api/game";
import HoleCardsDisplay from "../../components/tablePlayer/HoleCardsDisplay";
import PlayerAvatar from "../../components/tablePlayer/PlayerAvatar";
import "../../styles/TablePlayer.css";

function TablePlayer({
  player,
  isTurn,
  holeCards,
  progress,
  turnDuration,
  isWinner,
}: {
  player: GamePlayer | undefined;
  isTurn: boolean;
  holeCards: GameCard[];
  progress: number;
  turnDuration: number;
  isWinner?: boolean;
}) {
  const [revealWinnerCards, setRevealWinnerCards] = useState(false);

  useEffect(() => {
    if (isWinner) {
      const timeoutId = setTimeout(() => {
        setRevealWinnerCards(true);
      }, 10000);
      return () => clearTimeout(timeoutId);
    } else {
      setRevealWinnerCards(false);
    }
  }, [isWinner]);

  const isMyCard = (holeCard: GameCard): boolean => {
    return (
      player?.hand?.combinationCards?.some((card) => card.suit === holeCard.suit && card.rank === holeCard.rank) ??
      false
    );
  };

  return (
    <Flex style={{ flexDirection: "column", position: "relative" }} justify="center" align="center">
      {player?.hand?.rank && <Typography.Text className="rank-text">{player.hand.rank}</Typography.Text>}

      <HoleCardsDisplay
        holeCards={holeCards}
        isWinner={isWinner}
        revealWinnerCards={revealWinnerCards}
        isMyCard={isMyCard}
      />

      <PlayerAvatar isTurn={isTurn} progress={progress} />

      <Flex className="stack-box" align="center">
        <Typography.Text className="username-text">{player?.user?.username ?? "Waiting for player"}</Typography.Text>
        <Typography.Text className="stack-text">
          {player?.stack ? player.stack.toLocaleString("mn-MN") : 0}₮
        </Typography.Text>
      </Flex>
    </Flex>
  );
}

export default TablePlayer;
