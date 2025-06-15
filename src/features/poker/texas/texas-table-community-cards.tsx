import { Flex } from "antd";
import type { User } from "../../../api/user";
import PokerCard from "../poker-card";
import { playerCardStyle } from "../../../styles/PokerTableStyles";
import type { GameState } from "./texas-table-game";

function TexasTableCommunityCards({
  gameState,
  userInfo,
}: {
  gameState: GameState;
  userInfo: User | undefined;
}) {
  return (
    <Flex>
      {gameState.communityCards?.map((communityCard, index) => {
        let isMyCard = false;
        gameState.seats.forEach((seat) => {
          if (userInfo?.userId === seat.user?.userId) {
            seat?.hand?.combinationCards?.forEach((card) => {
              if (
                card.suit === communityCard.suit &&
                card.rank === communityCard.rank
              ) {
                isMyCard = true;
              }
            });
          }
        });
        return (
          <div key={index} style={playerCardStyle}>
            <PokerCard
              info={communityCard}
              style={{
                outline: isMyCard ? `5px solid red` : "none",
              }}
            />
          </div>
        );
      })}
    </Flex>
  );
}

export default TexasTableCommunityCards;
