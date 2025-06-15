import type { GameState } from "./texas-table-game";
import type { User } from "../../../api/user";
import type { GamePlayer } from "../../../api/game";
import { motion } from "motion/react";
import PokerChip from "../poker-chip";
import { seatChipStyle } from "../../../styles/PokerTableStyles";

function TexasTablePlayerChips({
  gameState,
  userInfo,
  seatCount = 8,
  centerX = 50,
  centerY = 50,
  chipRadiusX = 30,
  chipRadiusY = 30,
}: {
  gameState: GameState;
  userInfo: User | undefined;
  seatCount?: number;
  centerX?: number;
  centerY?: number;
  chipRadiusX?: number;
  chipRadiusY?: number;
}) {
  return (
    <div>
      {gameState.seats.map((_: GamePlayer, i: number) => {
        const isMobile = window.innerWidth < 768;

        const myUserId = userInfo?.userId;
        const mySeatIndex = gameState.seats.findIndex(
          (seat) => seat.user?.userId === myUserId
        );
        const centerIndex = Math.floor(seatCount / 4);
        let rotatedIndex = i;

        if (mySeatIndex !== -1) {
          const relativePosition = i - mySeatIndex;
          rotatedIndex =
            (relativePosition + centerIndex + seatCount) % seatCount;
        }

        const angle = (2 * Math.PI * rotatedIndex) / seatCount;

        const extraYOffset = isMobile ? -22 : 0;
        const chipOffsetX = isMobile ? 7 : -7;
        const chipOffsetY = isMobile ? 5 : 15;

        const chipRadiusXAdjusted = chipRadiusX - chipOffsetX;
        const chipRadiusYAdjusted = chipRadiusY - chipOffsetY;

        // Both avatar and chip use the same mobile adjustment
        const avatarRadiusX = isMobile
          ? chipRadiusX * 0.8
          : chipRadiusXAdjusted;
        const avatarRadiusY = isMobile
          ? chipRadiusY * 0.9
          : chipRadiusYAdjusted;

        const distanceFactorAvatar = 1.2; // seat (avatar) position
        const distanceFactorChip = 1; // chip comes closer to center

        // Starting point (from avatar/seat)
        const avatarX =
          centerX + avatarRadiusX * distanceFactorAvatar * Math.cos(angle);
        const avatarY =
          centerY +
          avatarRadiusY * distanceFactorAvatar * Math.sin(angle) +
          extraYOffset;

        // Ending point (where chip stops)
        const chipX =
          centerX + avatarRadiusX * distanceFactorChip * Math.cos(angle);
        const chipY =
          centerY +
          avatarRadiusY * distanceFactorChip * Math.sin(angle) +
          extraYOffset;

        const playerBet = gameState.currentBets[i] || 0;

        if (playerBet > 0) {
          return (
            <motion.div
              key={i}
              initial={{
                left: `${avatarX}%`,
                top: `${avatarY}%`,
              }}
              animate={{
                left: `${chipX}%`,
                top: `${chipY}%`,
              }}
              transition={{
                type: "spring",
                stiffness: 150,
                damping: 20,
              }}
              style={{
                ...seatChipStyle,
                position: "absolute",
              }}
            >
              <PokerChip amount={playerBet} />
            </motion.div>
          );
        }
        return null;
      })}
    </div>
  );
}

export default TexasTablePlayerChips;
