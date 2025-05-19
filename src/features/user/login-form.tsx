import { Button, Flex, Form, Input, message, Typography } from "antd";
import { useLoginMutation, type LoginCredentials } from "../../api/user";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { setAuthenticated } from "../../providers/auth-slice";

const { Text } = Typography;

function LoginForm({ setModalType }: { setModalType: (type: string) => void }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [messageAPI, contextHolder] = message.useMessage();
  const [login, { data, isLoading, isError, error }] = useLoginMutation();

  const onFinish = (values: LoginCredentials) => {
    login(values);
  };

  useEffect(() => {
    if (data) {
      messageAPI.success("Амжилттай нэвтэрлээ");
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
          "Нэвтрэхэд алдаа гарлаа: " + (error as any).data.errorMessage
        );
      } else {
        messageAPI.error("Нэвтрэхэд алдаа гарлаа");
      }
    }
  }, [isError, error]);

  return (
    <Form labelCol={{ span: 8 }} wrapperCol={{ span: 18 }} onFinish={onFinish}>
      {contextHolder}
      <Form.Item label="Цахим хаяг" name="email">
        <Input placeholder="Цахим хаягаа оруулна уу" />
      </Form.Item>
      <Form.Item label="Нууц үг" name="password">
        <Input type="password" placeholder="Нууц үгээ оруулна уу" />
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
