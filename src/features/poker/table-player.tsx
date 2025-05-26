import { Flex, Image, Typography } from "antd";
import type { GameCard, GamePlayer } from "../../api/game";
import PokerCard from "./poker-card";

function TablePlayer({
  player,
  isTurn,
  holeCards,
}: {
  player: GamePlayer | undefined;
  isTurn: boolean;
  holeCards: GameCard[];
}) {
  return (
    <Flex vertical justify="center" align="center">
      <Flex style={{ height: "80px", marginBottom: "-40px" }}>
        {holeCards[0] && <PokerCard info={holeCards[0]} />}
        {holeCards[1] && (
          <PokerCard info={holeCards[1]} style={{ marginLeft: "-30px" }} />
        )}
      </Flex>
      <Image
        preview={false}
        style={{
          width: "100px",
          height: "100px",
          background: "#030A01",
          borderRadius: "50%",
          border: isTurn ? "3px solid rgba(255, 255, 255, 0.5)" : "",
        }}
        src={
          "https://static.vecteezy.com/system/resources/thumbnails/048/216/761/small/modern-male-avatar-with-black-hair-and-hoodie-illustration-free-png.png"
        }
      />
      <Flex
        style={{
          borderRadius: "10px",
          background: "#030A01",
          padding: "8px 16px",
          border: "1px solid rgba(255, 255, 255, 0.5)",
          marginTop: "-16px",
          width: "80px",
          zIndex: 2,
        }}
        vertical
        gap={5}
      >
        <Typography.Text style={{ marginLeft: "8px", color: "#fff" }}>
          {player?.stack ? player?.stack.toLocaleString("mn-MN") : 0}₮
        </Typography.Text>
      </Flex>
      <Typography.Text
        style={{
          marginLeft: "8px",
          color: "#000",
          background: "#fff",
          padding: "8px 16px",
          borderRadius: "10px",
        }}
      >
        {player?.user?.username ? player?.user?.username : "Waiting for player"}
      </Typography.Text>
    </Flex>
  );
}

export default TablePlayer;
