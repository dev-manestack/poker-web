import { Button, Flex, Form, Input, message, Select, Typography } from "antd";
import { useRegisterMutation, type User } from "../../api/user";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { setAuthenticated } from "../../providers/auth-slice";

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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [messageAPI, contextHolder] = message.useMessage();

  const [register, { isLoading, data, isError, error }] = useRegisterMutation();

  const onFinish = (values: User) => {
    register(values);
  };

  useEffect(() => {
    if (data) {
      messageAPI.success("Амжилттай бүртгэгдлээ");
      localStorage.setItem("accessToken", data?.token);
      dispatch(setAuthenticated(true));
      setModalType("");
      navigate("/");
    }
  }, [data]);

  useEffect(() => {
    if (data) {
      messageAPI.success("Амжилттай бүртгэгдлээ");
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      console.error(error);
      if ("data" in error && (error as any).data?.errorMessage) {
        messageAPI.error(
          "Нэвтрэхэд алдаа гарлаа: " + (error as any).data.errorMessage
        );
      } else {
        messageAPI.error("Нэвтрэхэд алдаа гарлаа");
      }
    }
  }, [isError, error]);

  return (
    <Form labelCol={{ span: 10 }} wrapperCol={{ span: 18 }} onFinish={onFinish}>
      {contextHolder}
      <Form.Item label="Цахим хаяг" name="email">
        <Input placeholder="Цахим хаягаа оруулна уу" />
      </Form.Item>
      <Form.Item label="Тоглогчийн нэр" name="username">
        <Input placeholder="Тоглогчийн нэрээ оруулна уу" />
      </Form.Item>
      <Form.Item label="Нууц үг" name="password">
        <Input placeholder="Нууц үгээ оруулна уу" type="password" />
      </Form.Item>
      <Form.Item label="Нууц үг давтах" name="passwordRepeat">
        <Input placeholder="Нууц үгээ дахин оруулна уу" type="password" />
      </Form.Item>
      <Form.Item label="Банк" name="bankName">
        <Select placeholder="Банк" options={banks} />
      </Form.Item>
      <Form.Item label="Дансны дугаар" name="accountNumber">
        <Input placeholder="Дансны дугаар" />
      </Form.Item>
      <Form.Item label={null}>
        <Flex vertical gap={10}>
          <Button
            type="primary"
            style={{ width: "100%" }}
            htmlType="submit"
            loading={isLoading}
          >
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
