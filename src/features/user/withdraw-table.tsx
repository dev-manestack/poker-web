import { Button, Flex, Form, Modal, Slider, Table, message } from "antd";
import {
  useCreateWithdrawalMutation,
  useFetchWithdrawalsQuery,
} from "../../api/user";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

function WithdrawTable({ balance }: { balance?: number }) {
  const { data } = useFetchWithdrawalsQuery();
  const [messageAPI, contextHolder] = message.useMessage();
  const [
    createWithdrawal,
    { isSuccess: isCreateSuccess, isError: isCreateError, error: createError },
  ] = useCreateWithdrawalMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = [
    {
      title: "Код",
      dataIndex: "withdrawalId",
      key: "withdrawalId",
    },
    {
      title: "Хүсэлтийн огноо",
      dataIndex: "createDate",
      key: "createDate",
      render: (text: string) => {
        const date = new Date(text);
        const options: Intl.DateTimeFormatOptions = {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        };
        return date.toLocaleString("mn-MN", options);
      },
    },
    {
      title: "Дүн",
      dataIndex: "amount",
      key: "amount",
      render: (text: number) => {
        return text.toLocaleString("mn-MN", {
          style: "currency",
          currency: "MNT",
        });
      },
    },
    {
      title: "Баталсан Админ",
      dataIndex: "approvedBy",
      key: "approvedBy",
    },
    {
      title: "Баталсан огноо",
      dataIndex: "approveDate",
      key: "approveDate",
      render: (text: string) => {
        const date = new Date(text);
        const options: Intl.DateTimeFormatOptions = {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        };
        return date.toLocaleString("mn-MN", options);
      },
    },
    {
      title: "Төлөв",
      key: "state",
      render: (_: any, record: any) =>
        record.approvedBy ? (
          <span style={{ color: "green" }}>Батлагдсан</span>
        ) : (
          <span style={{ color: "red" }}>Батлагдаагүй</span>
        ),
    },
  ];

  useEffect(() => {
    if (isCreateSuccess) {
      setIsModalOpen(false);
    }
    if (isCreateError) {
      console.error("Withdrawal creation failed:", createError);
      messageAPI.error(
        `Withdrawal creation failed: ${
          (createError &&
            "data" in createError &&
            (createError as any).data?.message) ||
          "Unknown error"
        }`
      );
    }
  }, [isCreateSuccess, isCreateError, createError, data]);

  return (
    <Flex
      style={{
        width: "100%",
        height: "100%",
        padding: "8px 16px",
        flexDirection: "column",
        gap: 16,
      }}
    >
      {contextHolder}
      <Modal
        title="Татан авалт үүсгэх"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form
          labelCol={{
            span: 6,
          }}
          wrapperCol={{ span: 18 }}
          onFinish={(e) => {
            createWithdrawal({
              amount: e.amount,
              details: {},
            });
          }}
          layout="horizontal"
          style={{ maxWidth: 600 }}
        >
          <Form.Item
            label="Дүн"
            name="amount"
            rules={[{ required: true, message: "Дүнг оруулна уу!" }]}
          >
            <Slider max={balance ? balance : 0} min={1000} />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
            <Flex justify="end" align="center" gap={8}>
              <Button type="primary" htmlType="submit">
                Илгээх
              </Button>
              <Button onClick={() => setIsModalOpen(false)}>Буцах</Button>
            </Flex>
          </Form.Item>
        </Form>
      </Modal>
      <Flex justify="end" align="center">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
        >
          Create
        </Button>
      </Flex>
      <Table
        columns={columns}
        dataSource={data}
        style={{
          width: "100%",
          height: "100%",
        }}
        pagination={{
          pageSize: 5,
          showSizeChanger: true,
        }}
      />
    </Flex>
  );
}

export default WithdrawTable;
