import { Flex } from "antd";
import RoomBackground from "../assets/room-background.jpg";
import TableGame from "../features/poker/table-game";

function TablePage() {
  return (
    <Flex
      style={{
        height: "100vh",
        width: "100vw",
        background: `url(${RoomBackground})`,
        backgroundSize: "contain",
      }}
    >
      <TableGame />
    </Flex>
  );
}

export default TablePage;
