import { Button, Flex } from "antd";
import RoomBackground from "../../assets/room-background.jpg";
import TableGame from "../../features/poker/table-game";
import { LeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";

function TablePage() {
  const navigate = useNavigate();
  return (
    <Flex
      style={{
        height: "100vh",
        width: "100vw",
        background: `url(${RoomBackground})`,
        backgroundSize: "contain",
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
        onClick={() => navigate("/home")}
      >
        Back
      </Button>
      <TableGame />
    </Flex>
  );
}

export default TablePage;
