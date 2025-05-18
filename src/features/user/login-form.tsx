import { Button, Flex, Form, Input, Typography } from "antd";

const { Text } = Typography;

function LoginForm({ setModalType }: { setModalType: (type: string) => void }) {
  const onFinish = (values: any) => {
    console.log(values);
  };

  return (
    <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} onFinish={onFinish}>
      <Form.Item label="Цахим хаяг" name="username">
        <Input placeholder="Цахим хаягаа оруулна уу" />
      </Form.Item>
      <Form.Item label="Нууц үг" name="username">
        <Input placeholder="Нууц үгээ оруулна уу" />
      </Form.Item>
      <Form.Item label={null}>
        <Flex vertical gap={10}>
          <Button type="primary" style={{ width: "100%" }} htmlType="submit">
            Нэвтрэх
          </Button>
          <Text style={{ textAlign: "end" }}>
            Та өмнө бүртгүүлж байгаагүй юу?{" "}
            <a
              onClick={(e) => {
                e.preventDefault();
                setModalType("register");
              }}
            >
              Бүртгүүлэх
            </a>
          </Text>
          <a
            style={{ textAlign: "end" }}
            onClick={(e) => {
              e.preventDefault();
              setModalType("forgot-password");
            }}
          >
            Нууц үг сэргээх
          </a>
        </Flex>
      </Form.Item>
    </Form>
  );
}

export default LoginForm;
