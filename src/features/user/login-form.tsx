import { Button, Flex, Form, Input, message, Typography } from "antd";
import { useLoginMutation, type LoginCredentials } from "../../api/user";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { setAuthenticated } from "../../providers/auth-slice";
import { useTranslation } from "react-i18next";
import "../../styles/loginForm.css";

const { Text } = Typography;

function LoginForm({ setModalType }: { setModalType: (type: string) => void }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [messageAPI, contextHolder] = message.useMessage();
  const [login, { data, isLoading, isError, error }] = useLoginMutation();
  const { t, i18n } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  const onFinish = (values: LoginCredentials) => {
    login(values);
  };

  useEffect(() => {
    if (data) {
      messageAPI.success(t("loginForm.success"));
      localStorage.setItem("accessToken", data?.token);
      dispatch(setAuthenticated(true));
      setModalType("");
      navigate("/");
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      console.error(error);
      if ("data" in error && (error as any).data?.errorMessage) {
        messageAPI.error(
          t("loginForm.error") + ": " + (error as any).data.errorMessage
        );
      } else {
        messageAPI.error(t("loginForm.error"));
      }
    }
  }, [isError, error]);

  return (
    <Form layout="vertical" onFinish={onFinish}>
      {contextHolder}
      <Form.Item
        label={<span lang={i18n.language}>{t("loginForm.usernameLabel")}</span>}
        name="username"
      >
        <Input
          style={{ textTransform: "none" }} // Prevents forced uppercase
          placeholder={t("loginForm.usernamePlaceholder")}
        />
      </Form.Item>
      <Form.Item
        label={<span lang={i18n.language}>{t("loginForm.passwordLabel")}</span>}
        name="password"
      >
        <Input
          className="ant-input-password"
          type={showPassword ? "text" : "password"} // Toggle between 'text' and 'password'
          style={{ textTransform: "none" }} // Prevents forced uppercase
          placeholder={t("loginForm.passwordPlaceholder")}
          suffix={
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                cursor: "pointer",
                userSelect: "none",
                fontSize: "9px",
                marginRight: "5px",
              }}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          }
        />
      </Form.Item>
      <Form.Item>
        <Flex vertical gap={10}>
          <Button
            type="primary"
            className="login-form-button"
            style={{ width: "100%" }}
            htmlType="submit"
            loading={isLoading}
          >
            <span lang={i18n.language}>{t("loginForm.loginButton")}</span>
          </Button>

          {/* Text: Have you ever registered? */}
          <Text style={{ textAlign: "center" }}>
            <span lang={i18n.language}>{t("loginForm.noAccount")}</span>
          </Text>

          {/* Register Link */}
          <Text style={{ textAlign: "center" }}>
            <a
              onClick={(e) => {
                e.preventDefault();
                setModalType("register");
              }}
            >
              {t("loginForm.register")}
            </a>
          </Text>

          {/* Forgot Password Link */}
          <Text style={{ textAlign: "center" }}>
            <a
              onClick={(e) => {
                e.preventDefault();
                setModalType("forgot-password");
              }}
            >
              {t("loginForm.forgotPassword")}
            </a>
          </Text>
        </Flex>
      </Form.Item>
    </Form>
  );
}

export default LoginForm;
