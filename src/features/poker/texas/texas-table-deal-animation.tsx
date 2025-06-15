import PokerCard from "../poker-card";
import type { GameState } from "./texas-table-game";
import { motion } from "motion/react";

function TexasTableDealAnimation({
  centerX,
  centerY,
  seatRadiusX,
  seatRadiusY,
  gameState,
  seatCount,
  dealCardAnimationKey,
}: {
  centerX: number;
  centerY: number;
  seatRadiusX: number;
  seatRadiusY: number;
  gameState: GameState;
  seatCount: number;
  dealCardAnimationKey: number;
}) {
  const calculateRotatedIndex = (
    mySeatIndex: number,
    centerIndex: number,
    index: number
  ) => {
    if (mySeatIndex !== -1) {
      const relativePosition = index - mySeatIndex;
      const rotatedIndex =
        (relativePosition + centerIndex + seatCount) % seatCount;
      return rotatedIndex;
    } else {
      return index;
    }
  };

  return (
    <div>
      {gameState.seats.map((seat, index) => {
        if (seat?.user?.userId && dealCardAnimationKey > 0) {
          return (
            <motion.div
              key={dealCardAnimationKey + "." + index}
              style={{
                width: "50px",
                height: "70px",
                position: "absolute",
                zIndex: 0,
              }}
              initial={{
                top: "48%",
                left: "50%",
              }}
              animate={{
                top: `${
                  centerY +
                  seatRadiusY *
                    Math.sin(
                      (2 *
                        Math.PI *
                        calculateRotatedIndex(
                          gameState.currentPlayerSeat,
                          Math.floor(seatCount / 4),
                          index
                        )) /
                        seatCount
                    )
                }%`,
                left: `${
                  centerX +
                  seatRadiusX *
                    Math.cos(
                      (2 *
                        Math.PI *
                        calculateRotatedIndex(
                          gameState.currentPlayerSeat,
                          Math.floor(seatCount / 4),
                          index
                        )) /
                        seatCount
                    )
                }%`,
                opacity: 0,
              }}
              transition={{
                duration: 0.5,
              }}
            >
              <PokerCard
                style={{}}
                info={{
                  suit: null,
                  rank: null,
                  secret: true,
                }}
              />
            </motion.div>
          );
        } else {
          return <></>;
        }
      })}
    </div>
  );
}

export default TexasTableDealAnimation;
