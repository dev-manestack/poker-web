import { Button, Flex } from "antd";
import type { GamePlayer } from "../../../api/game";
import type { User } from "../../../api/user";
import type { GameState } from "./texas-table-game";
import TablePlayer from "../table-player";
import { playerSeatStyle } from "../../../styles/PokerTableStyles";
import { useTranslation } from "react-i18next";

function TexasTablePlayerSeats({
  isMobile,
  isSmallPhone,
  gameState,
  userInfo,
  seatCount,
  centerX = 50,
  centerY = 50,
  seatRadiusX = 30,
  seatRadiusY = 30,
  turnProgress,
  setSelectedSeat,
  isPreview,
}: {
  isMobile: boolean;
  isSmallPhone: boolean;
  gameState: GameState;
  userInfo: User | undefined;
  setSelectedSeat: (seatIndex: number) => void;
  isPreview: boolean;
  seatCount: number;
  centerX: number;
  centerY: number;
  seatRadiusX: number;
  seatRadiusY: number;
  turnProgress: number;
}) {
  const { t } = useTranslation();

  const isSeatTaken = (seatIndex: number) => {
    return (
      gameState.seats[seatIndex]?.user !== null &&
      gameState.seats[seatIndex]?.user !== undefined
    );
  };

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
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 2,
        transform: isMobile
          ? isSmallPhone
            ? "translateY(-70px)" // small phone
            : "translateY(-100px)" // other mobiles
          : "none",
        transition: "transform 0.3s ease",
      }}
    >
      {gameState.seats.map((seat: GamePlayer, ind: number) => {
        const myUserId = userInfo?.userId;
        const mySeatIndex = gameState.seats.findIndex(
          (seat) => seat.user?.userId === myUserId
        );
        const centerIndex = Math.floor(seatCount / 4);
        let rotatedIndex = calculateRotatedIndex(mySeatIndex, centerIndex, ind);

        const angle = (2 * Math.PI * rotatedIndex) / seatCount;

        const sin = Math.sin(angle);

        // Adjust Y radius for top/bottom seats
        let adjustedRadiusY = seatRadiusY;
        if (Math.abs(sin) > 0.9) {
          adjustedRadiusY = isMobile ? (isSmallPhone ? 50 : 45) : 40;
        }

        const x = centerX + seatRadiusX * Math.cos(angle);
        const y = centerY + adjustedRadiusY * sin;

        return (
          <Button
            className={`seat${isPreview ? " preview" : ""}`}
            key={ind}
            onClick={() => {
              setSelectedSeat(ind);
            }}
            disabled={isPreview || isSeatTaken(ind)}
            style={{
              ...playerSeatStyle,
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              pointerEvents: "auto",
              fontStyle: "italic",
            }}
          >
            {seat?.user?.userId ? (
              <Flex>
                <TablePlayer
                  player={seat}
                  isMe={ind === mySeatIndex}
                  isTurn={ind === gameState.currentPlayerSeat}
                  holeCards={seat?.holeCards || []}
                  progress={
                    ind === gameState.currentPlayerSeat ? turnProgress : 0
                  }
                />
              </Flex>
            ) : (
              `${t("seat")}`
            )}
          </Button>
        );
      })}
    </div>
  );
}

export default TexasTablePlayerSeats;
