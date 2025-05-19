import { Button, Flex, Form, Input, Select, Typography } from "antd";

const { Text } = Typography;

const banks = [
  {
    value: "khanbank",
    label: "Хаан банк",
  },
  {
    value: "golomtbank",
    label: "Голомт банк",
  },
  {
    value: "xacbank",
    label: "Хас банк",
  },
  {
    value: "tradeanddevelopmentbank",
    label: "Худалдаа хөгжлийн банк",
  },
  {
    value: "capbank",
    label: "Капитал банк",
  },
  {
    value: "statebank",
    label: "Төрийн банк",
  },
  {
    value: "mbank",
    label: "М банк",
  },
];

function RegisterForm({
  setModalType,
}: {
  setModalType: (type: string) => void;
}) {
  const onFinish = (values: any) => {
    console.log(values);
  };

  return (
    <Form labelCol={{ span: 8 }} wrapperCol={{ span: 18 }} onFinish={onFinish}>
      <Form.Item label="Цахим хаяг" name="email">
        <Input placeholder="Цахим хаягаа оруулна уу" />
      </Form.Item>
      <Form.Item label="Тоглогчийн нэр" name="username">
        <Input placeholder="Тоглогчийн нэрээ оруулна уу" />
      </Form.Item>
      <Form.Item label="Нууц үг" name="password">
        <Input placeholder="Нууц үгээ оруулна уу" />
      </Form.Item>
      <Form.Item label="Нууц үг давтах" name="password-repeat">
        <Input placeholder="Нууц үгээ дахин оруулна уу" />
      </Form.Item>
      <Form.Item label="Банк" name="bank-name">
        <Select placeholder="Банк" options={banks} />
      </Form.Item>
      <Form.Item label="Дансны дугаар" name="account-number">
        <Input placeholder="Дансны дугаар" />
      </Form.Item>
      <Form.Item label={null}>
        <Flex vertical gap={10}>
          <Button type="primary" style={{ width: "100%" }} htmlType="submit">
            Нэвтрэх
          </Button>
          <Text style={{ textAlign: "end" }}>
            Та өмнө бүртгэл үүсгэж байсан уу?{" "}
            <a
              onClick={(e) => {
                e.preventDefault();
                setModalType("login");
              }}
            >
              Нэвтрэх
            </a>
          </Text>
        </Flex>
      </Form.Item>
    </Form>
  );
}

export default RegisterForm;
