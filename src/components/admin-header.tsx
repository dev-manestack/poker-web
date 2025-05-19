import {
  BellOutlined,
  LogoutOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Dropdown,
  Flex,
  Select,
  Typography,
  type MenuProps,
} from "antd";

const { Text } = Typography;

const items: MenuProps["items"] = [
  {
    key: "1",
    label: <Text>Logout</Text>,
    onClick: () => {},
    icon: <LogoutOutlined />,
    danger: true,
  },
];

function AdminHeader() {
  return (
    <Flex
      justify="space-between"
      align="center"
      style={{
        padding: "10px 24px",
        boxShadow: "0 0 3px rgba(0, 0, 0, 0.5)",
      }}
    >
      <Select
        showSearch
        placeholder="Хайлт хийх"
        style={{
          width: "300px",
        }}
      />
      <Flex gap={5} align="center">
        <Button icon={<BellOutlined />} />
        <Button icon={<MessageOutlined />} />
        <Dropdown menu={{ items }}>
          <Flex align="center" gap={5} style={{ flex: 1 }}>
            <Avatar />
            <Text>Test</Text>
          </Flex>
        </Dropdown>
      </Flex>
    </Flex>
  );
}

export default AdminHeader;
