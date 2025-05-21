import { Button, Flex, Form, InputNumber, message, Modal, Select } from "antd";
import AdminDepositList from "../../features/admin/admin-deposit-list";
import {
  useCreateDepositMutation,
  useFetchDepositsQuery,
} from "../../api/admin";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useSearchUsersQuery } from "../../api/user";

function DepositPage() {
  const [messageAPI, contextHolder] = message.useMessage();

  const { data: deposits } = useFetchDepositsQuery();
  const { data: users } = useSearchUsersQuery();
  const [createDeposit, { isError, error }] = useCreateDepositMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (error) {
      console.error(error);
      if ("data" in error && (error as any).data?.errorMessage) {
        messageAPI.error(
          "Үүсгэхэд алдаа гарлаа: " + (error as any).data.errorMessage
        );
      } else {
        messageAPI.error("Үүсгэхэд алдаа гарлаа");
      }
    }
  }, [isError, error]);

  return (
    <Flex
      style={{
        width: "100%",
      }}
      vertical
      gap={16}
    >
      {contextHolder}
      <Flex style={{ width: "100%" }} justify="end">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
        />
      </Flex>
      <AdminDepositList deposits={deposits ? deposits : []} />
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form
          labelCol={{ span: 6 }}
          style={{
            padding: "16px",
          }}
          onFinish={(values) => {
            createDeposit({
              userId: values.userId,
              amount: values.amount,
              type: values.type,
              details: {},
            }).then(() => {
              setIsModalOpen(false);
            });
          }}
        >
          <Form.Item label="Хэрэглэгч" name="userId">
            <Select
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              placeholder="Хэрэглэгчийг сонгоно уу"
              options={
                users
                  ? users?.map((user) => {
                      return {
                        label: user.email,
                        value: user.userId,
                      };
                    })
                  : []
              }
            />
          </Form.Item>
          <Form.Item label="Хэмжээ" name="amount">
            <InputNumber placeholder="10,000" />
          </Form.Item>
          <Form.Item label="Төрөл" name="type">
            <Select
              placeholder="Төрлийг сонгоно уу"
              options={[
                { label: "Банкны шилжүүлэг", value: "BANK_TRANSFER" },
                { label: "Бэлнээр", value: "CASH" },
                { label: "Крипто", value: "CRYPTO" },
              ]}
            />
          </Form.Item>
          <Form.Item>
            <Flex justify="end">
              <Button type="primary" htmlType="submit">
                Хадгалах
              </Button>
            </Flex>
          </Form.Item>
        </Form>
      </Modal>
    </Flex>
  );
}

export default DepositPage;
