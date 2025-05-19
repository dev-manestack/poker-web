import { Button, Form, Input } from "antd";

function ForgotPasswordForm() {
  const onFinish = (values: any) => {
    console.log(values);
  };

  return (
    <Form labelCol={{ span: 8 }} wrapperCol={{ span: 18 }} onFinish={onFinish}>
      <Form.Item label="Цахим хаяг" name="username">
        <Input placeholder="Цахим хаягаа оруулна уу" />
      </Form.Item>
      <Form.Item label={null}>
        <Button type="primary" style={{ width: "100%" }} htmlType="submit">
          Мэйл илгээх
        </Button>
      </Form.Item>
    </Form>
  );
}

export default ForgotPasswordForm;
