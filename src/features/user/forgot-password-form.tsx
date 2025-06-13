import { Button, Form, Input } from "antd";
import { useTranslation } from "react-i18next";

function ForgotPasswordForm() {
  const { t, i18n } = useTranslation(); // i18n hook

  const onFinish = (values: any) => {
    console.log(values);
  };

  return (
    <Form
      labelCol={{ xs: { span: 24 }, sm: { span: 8 } }}
      wrapperCol={{ xs: { span: 24 }, sm: { span: 16 } }}
      onFinish={onFinish}
    >
      <Form.Item label={<span lang={i18n.language}>{t("forgotPasswordForm.emailLabel")}</span>} name="username">
        <Input placeholder={t("forgotPasswordForm.emailPlaceholder")} />
      </Form.Item>

      <Form.Item label={null}>
        <Button type="primary" style={{ width: "100%" }} htmlType="submit" className="login-form-button">
          {t("forgotPasswordForm.sendButton")}
        </Button>
      </Form.Item>
    </Form>
  );
}

export default ForgotPasswordForm;
