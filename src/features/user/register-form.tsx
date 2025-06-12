import { Button, Flex, Form, Input, message, Select, Typography } from "antd";
import { useRegisterMutation, type User } from "../../api/user";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { setAuthenticated } from "../../providers/auth-slice";
import banks from "../../assets/data/banks";
import { useTranslation } from "react-i18next";

const { Text } = Typography;

function RegisterForm({ setModalType }: { setModalType: (type: string) => void }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [messageAPI, contextHolder] = message.useMessage();

  const [register, { isLoading, data, isError, error }] = useRegisterMutation();

  const onFinish = (values: User) => {
    register(values);
  };

  useEffect(() => {
    if (data) {
      messageAPI.success(t("registerForm.successMessage"));
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
        messageAPI.error(t("registerForm.errorMessage") + (error as any).data.errorMessage);
      } else {
        messageAPI.error(t("registerForm.errorMessageGeneric"));
      }
    }
  }, [isError, error]);

  return (
    <Form className="register-form-container" layout="vertical" onFinish={onFinish}>
      {contextHolder}

      <Form.Item
        label={
          <span className="responsive-label" lang={i18n.language}>
            {t("registerForm.emailLabel")}
          </span>
        }
        name="email"
      >
        <Input className="responsive-input" placeholder={t("registerForm.emailPlaceholder")} />
      </Form.Item>

      <Form.Item
        label={
          <span className="responsive-label" lang={i18n.language}>
            {t("registerForm.usernameLabel")}
          </span>
        }
        name="username"
      >
        <Input className="responsive-input" placeholder={t("registerForm.usernamePlaceholder")} />
      </Form.Item>

      <Form.Item
        label={
          <span className="responsive-label" lang={i18n.language}>
            {t("registerForm.passwordLabel")}
          </span>
        }
        name="password"
      >
        <Input className="responsive-input" type="password" placeholder={t("registerForm.passwordPlaceholder")} />
      </Form.Item>

      <Form.Item
        label={
          <span className="responsive-label" lang={i18n.language}>
            {t("registerForm.passwordRepeatLabel")}
          </span>
        }
        name="passwordRepeat"
      >
        <Input className="responsive-input" type="password" placeholder={t("registerForm.passwordRepeatPlaceholder")} />
      </Form.Item>

      <Form.Item
        label={
          <span className="responsive-label" lang={i18n.language}>
            {t("registerForm.bankLabel")}
          </span>
        }
        name="bankName"
      >
        <Select className="responsive-select" placeholder={t("registerForm.bankPlaceholder")} options={banks} />
      </Form.Item>

      <Form.Item
        label={
          <span className="responsive-label" lang={i18n.language}>
            {t("registerForm.accountNumberLabel")}
          </span>
        }
        name="accountNumber"
      >
        <Input className="responsive-input" placeholder={t("registerForm.accountNumberPlaceholder")} />
      </Form.Item>

      <Form.Item>
        <Flex vertical gap={10}>
          <Button type="primary" className="register-form-button" htmlType="submit" loading={isLoading}>
            {t("registerForm.registerButton")}
          </Button>

          <Text className="register-form-footer">
            {t("registerForm.haveAccount")}{" "}
            <a
              className="register-form-link"
              onClick={(e) => {
                e.preventDefault();
                setModalType("login");
              }}
            >
              {t("registerForm.loginLink")}
            </a>
          </Text>
        </Flex>
      </Form.Item>
    </Form>
  );
}

export default RegisterForm;
