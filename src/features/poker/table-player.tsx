import { Flex, Image, Typography } from "antd";
import type { GamePlayer } from "../../api/game";

function TablePlayer({ player }: { player: GamePlayer | undefined }) {
  return (
    <Flex vertical justify="center" align="center">
      <Image
        preview={false}
        style={{
          width: "100px",
          height: "100px",
          background: "#030A01",
          borderRadius: "10px",
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
        }}
        vertical
        gap={5}
      >
        <Typography.Text style={{ marginLeft: "8px", color: "#fff" }}>
          {player ? player.user.username : "Waiting for player..."}
        </Typography.Text>
        <Typography.Text style={{ marginLeft: "8px", color: "#fff" }}>
          {player?.stack ? player?.stack.toLocaleString("mn-MN") : 0}₮
        </Typography.Text>
      </Flex>
    </Flex>
  );
}

export default TablePlayer;
