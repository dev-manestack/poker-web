import { Flex, Typography } from "antd";
import LoginForm from "../features/user/login-form";
import { useNavigate } from "react-router";
import RegisterForm from "../features/user/register-form";
import ForgotPasswordForm from "../features/user/forgot-password-form";

const { Title } = Typography;

function AuthPage({ type }: { type: string }) {
  const navigate = useNavigate();

  const setModalType = (modalType: string) => {
    navigate("/auth/" + modalType);
  };

  return (
    <Flex
      justify="center"
      align="center"
      vertical
      style={{
        width: "100%",
        marginTop: type === "register" ? "20vh" : "30vh",
        position: "absolute",
      }}
    >
      <Title>
        {type === "register" && "Бүртгүүлэх"}
        {type === "login" && "Нэвтрэх"}
        {type === "forgot-password" && "Нууц үг сэргээх"}
      </Title>
      <Flex
        style={{
          width: "50%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {type === "register" && <RegisterForm setModalType={setModalType} />}
        {type === "login" && <LoginForm setModalType={setModalType} />}
        {type === "forgot-password" && <ForgotPasswordForm />}
      </Flex>
    </Flex>
  );
}

export default AuthPage;
