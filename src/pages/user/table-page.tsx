import { Flex } from "antd";
import TexasTableGame from "../../features/poker/texas/texas-table-game";

function TablePage() {
  return (
    <Flex
      style={{
        height: "100vh",
        width: "100vw",
        background: "#1B243C",
      }}
    >
      <TexasTableGame />
    </Flex>
  );
}

export default TablePage;
