import PokerChip from "../poker-chip";
import type { GameState } from "./texas-table-game";
import { motion } from "motion/react";

function TexasTableSplitChipAnimation({
  centerX,
  centerY,
  seatRadiusX,
  seatRadiusY,
  gameState,
  seatCount,
  animationKey,
}: {
  centerX: number;
  centerY: number;
  seatRadiusX: number;
  seatRadiusY: number;
  gameState: GameState;
  seatCount: number;
  animationKey: number;
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
        if (seat?.user?.userId && animationKey > 0) {
          return (
            <motion.div
              key={animationKey + "." + index}
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
              <PokerChip amount={0} />
            </motion.div>
          );
        } else {
          return <></>;
        }
      })}
    </div>
  );
}

export default TexasTableSplitChipAnimation;
