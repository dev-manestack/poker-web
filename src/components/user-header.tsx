import {
  CloseOutlined,
  MenuOutlined,
  MoonFilled,
  SunFilled,
} from "@ant-design/icons";
import { Button, Flex, Modal } from "antd";
import { useState } from "react";
import LoginForm from "../features/user/login-form";
import RegisterForm from "../features/user/register-form";
import ForgotPasswordForm from "../features/user/forgot-password-form";
import { useDispatch, useSelector } from "react-redux";
import { toggleMode } from "../app/theme-slice";

function UserHeader() {
  const [modalType, setModalType] = useState("");
  const themeMode = useSelector((state: any) => state.theme.mode);
  const dispatch = useDispatch();

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
        <Button
          type="primary"
          onClick={() => {
            setModalType("login");
          }}
        >
          Login
        </Button>
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
