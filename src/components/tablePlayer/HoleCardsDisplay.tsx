import React from "react";
import type { GameCard } from "../../api/game";
import PokerCard from "../../features/poker/poker-card";
import "../../styles/TablePlayer.css";

interface HoleCardsDisplayProps {
  holeCards: GameCard[];
  isWinner?: boolean;
  revealWinnerCards: boolean;
  isMyCard: (holeCard: GameCard) => boolean;
}

const HoleCardsDisplay: React.FC<HoleCardsDisplayProps> = ({ holeCards, isWinner, revealWinnerCards, isMyCard }) => {
  return (
    <div className={`hole-cards-overlay ${isWinner ? "winner" : ""}`}>
      {holeCards[0] && (
        <PokerCard
          info={revealWinnerCards || !isWinner ? holeCards[0] : { ...holeCards[0], secret: false }}
          style={{
            transform: "rotate(-10deg)",
            position: "absolute",
            left: "-15px",
            top: "0",
            outline: "none",
            ...(isMyCard(holeCards[0]) && isWinner
              ? {
                  boxShadow: "0 0 12px 4px gold",
                  animation: "pulse-glow 2s infinite ease-in-out",
                  borderRadius: "8px",
                  zIndex: 10,
                }
              : {}),
          }}
          // Note: remove className prop if PokerCard does not accept it
        />
      )}
      {holeCards[1] && (
        <PokerCard
          info={revealWinnerCards || !isWinner ? holeCards[1] : { ...holeCards[1], secret: false }}
          style={{
            transform: "rotate(10deg)",
            position: "absolute",
            right: "-15px",
            top: "0",
            outline: "none",
            ...(isMyCard(holeCards[1]) && isWinner
              ? {
                  boxShadow: "0 0 12px 4px gold",
                  animation: "pulse-glow 2s infinite ease-in-out",
                  borderRadius: "8px",
                  zIndex: 10,
                }
              : {}),
          }}
        />
      )}
    </div>
  );
};

export default HoleCardsDisplay;
