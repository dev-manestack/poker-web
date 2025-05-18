import { CloseOutlined, MenuOutlined } from "@ant-design/icons";
import { Button, Flex, Modal } from "antd";
import { useState } from "react";
import LoginForm from "../features/user/login-form";
import RegisterForm from "../features/user/register-form";
import ForgotPasswordForm from "../features/user/forgot-password-form";

function UserHeader() {
  const [modalType, setModalType] = useState("");

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
