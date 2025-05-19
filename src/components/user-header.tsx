import {
  BellOutlined,
  CloseOutlined,
  MenuOutlined,
  MessageOutlined,
  MoonFilled,
  SunFilled,
} from "@ant-design/icons";
import { Avatar, Button, Dropdown, Flex, Modal, Typography } from "antd";
import { useEffect, useState } from "react";
import LoginForm from "../features/user/login-form";
import RegisterForm from "../features/user/register-form";
import ForgotPasswordForm from "../features/user/forgot-password-form";
import { useDispatch, useSelector } from "react-redux";
import { toggleMode } from "../providers/theme-slice";
import { useMeQuery } from "../api/user";
import { logout } from "../providers/auth-slice";

const { Text } = Typography;

function UserHeader() {
  const [modalType, setModalType] = useState("");
  const themeMode = useSelector((state: any) => state.theme.mode);
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state: any) => state.auth.isAuthenticated
  );

  const items = [
    {
      key: "1",
      label: <Text>Logout</Text>,
      onClick: () => dispatch(logout()),
      danger: true,
    },
  ];

  const { data: userInfo, refetch } = useMeQuery();

  useEffect(() => {
    refetch();
  }, [isAuthenticated]);

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
      <Flex gap={5}>
        <Button
          onClick={() => {
            dispatch(toggleMode());
          }}
        >
          {themeMode === "dark" ? <SunFilled /> : <MoonFilled />}
        </Button>
        {isAuthenticated ? (
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
        ) : (
          <Button
            type="primary"
            onClick={() => {
              setModalType("login");
            }}
          >
            Нэвтрэх
          </Button>
        )}
      </Flex>
      <Modal
        open={modalType?.length > 0}
        onOk={() => setModalType("")}
        onCancel={() => setModalType("")}
        title={
          modalType === "login"
            ? "Нэвтрэх"
            : modalType === "register"
            ? "Бүртгүүлэх"
            : "Нууц үг сэргээх"
        }
        closeIcon={
          <CloseOutlined
            style={{
              color: "#EEFFFF",
            }}
          />
        }
        footer={[]}
      >
        {modalType === "login" && <LoginForm setModalType={setModalType} />}
        {modalType === "register" && (
          <RegisterForm setModalType={setModalType} />
        )}
        {modalType === "forgot-password" && <ForgotPasswordForm />}
      </Modal>
    </Flex>
  );
}

export default UserHeader;
