import { Button, Flex } from "antd";
import TexasTableGame from "../../features/poker/texas-table-game";
import { LeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";

function TablePage() {
  const navigate = useNavigate();
  return (
    <Flex
      style={{
        height: "100vh",
        width: "100vw",
        background: "#1B243C",
      }}
    >
      <Button
        type="primary"
        style={{
          position: "absolute",
          top: 20,
          left: 20,
        }}
        icon={<LeftOutlined />}
        onClick={() => navigate("/")}
      >
        Буцах
      </Button>
      <TexasTableGame />
    </Flex>
  );
}

export default TablePage;
