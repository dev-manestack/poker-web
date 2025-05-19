import { Flex } from "antd";
import LoginForm from "../features/user/login-form";
import { useNavigate } from "react-router";
import RegisterForm from "../features/user/register-form";
import ForgotPasswordForm from "../features/user/forgot-password-form";

function AuthPage({ type }: { type: string }) {
  const navigate = useNavigate();

  const setModalType = (modalType: string) => {
    navigate("/auth/" + modalType);
  };

  return (
    <Flex
      style={{
        width: "100%",
        marginTop: "30vh",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
      }}
    >
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
