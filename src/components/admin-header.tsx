import {
  BellOutlined,
  LogoutOutlined,
  MessageOutlined,
  UserOutlined,
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
import { useNavigate } from "react-router";
import { useMeQuery } from "../api/user";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, setAuthenticated, setUserInfo } from "../providers/auth-slice";

const { Text } = Typography;

function AdminHeader({ style }: { style?: React.CSSProperties }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isAuthenticated = useSelector(
    (state: any) => state.auth.isAuthenticated
  );
  const { data: userInfo, refetch } = useMeQuery();

  useEffect(() => {
    refetch();
  }, [isAuthenticated]);

  useEffect(() => {
    if (userInfo) {
      dispatch(setAuthenticated(true));
      dispatch(setUserInfo(userInfo));
    }
  }, [userInfo]);

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "User View",
      onClick: () => {
        navigate("/");
      },
      icon: <UserOutlined />,
    },
    {
      key: "2",
      label: <Text>Logout</Text>,
      onClick: () => {
        dispatch(logout());
      },
      icon: <LogoutOutlined />,
      danger: true,
    },
  ];

  return (
    <Flex
      justify="space-between"
      align="center"
      style={{
        ...style,
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
            <Avatar src={userInfo?.profileURL} />
            <Text>{userInfo?.username}</Text>
          </Flex>
        </Dropdown>
      </Flex>
    </Flex>
  );
}

export default AdminHeader;
