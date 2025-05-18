import { MenuOutlined } from "@ant-design/icons";
import { Button, Flex } from "antd";

function UserHeader() {
  return (
    <Flex
      justify="space-between"
      align="center"
      style={{ width: "100%", height: "100%", padding: "0 20px" }}
    >
      <Flex>
        <MenuOutlined
          onClick={() => {
            console.log("menu clicked");
          }}
        />
      </Flex>
      <Flex>
        <Button type="primary">Login</Button>
      </Flex>
    </Flex>
  );
}

export default UserHeader;
