import { Button, Flex, Form, Modal, Slider, Table, message } from "antd";
import { useCreateWithdrawalMutation, useFetchWithdrawalsQuery } from "../../api/user";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
// import "../../styles/withdraw.css";

type FormValues = {
  amount: number;
};

type Withdrawal = {
  withdrawalId: string;
  createDate: string;
  amount: number;
  approvedBy?: string;
  approveDate?: string;
};

function WithdrawTable({ balance = 0 }: { balance?: number }) {
  const { t } = useTranslation();
  const { data } = useFetchWithdrawalsQuery();
  const [createWithdrawal, { isSuccess: isCreateSuccess, isError: isCreateError, error: createError }] =
    useCreateWithdrawalMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm<FormValues>();
  const [messageApi, contextHolder] = message.useMessage();

  const formatCurrency = (value: number | undefined) =>
    value?.toLocaleString(undefined, { style: "currency", currency: "MNT" }) || "";

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    return date.toLocaleString(undefined, options);
  };

  useEffect(() => {
    if (isCreateSuccess) {
      messageApi.success(t("withdrawal.createSuccess"));
      setIsModalOpen(false);
      form.resetFields();
    }
    if (isCreateError) {
      console.error("Withdrawal creation failed:", createError);
      messageApi.error(
        (createError && "data" in createError && (createError as any).data?.message) || t("withdrawal.unknownError")
      );
    }
  }, [isCreateSuccess, isCreateError, createError, messageApi, t, form]);

  const columns = [
    {
      title: t("withdrawal.code"),
      dataIndex: "withdrawalId",
      key: "withdrawalId",
    },
    {
      title: t("withdrawal.requestDate"),
      dataIndex: "createDate",
      key: "createDate",
      render: (text: string) => <span>{formatDate(text)}</span>,
    },
    {
      title: t("withdrawal.amount"),
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => <span>{formatCurrency(amount)}</span>,
    },
    {
      title: t("withdrawal.approvedBy"),
      dataIndex: "approvedBy",
      key: "approvedBy",
      render: (approvedBy?: string) => approvedBy || "-",
    },
    {
      title: t("withdrawal.approveDate"),
      dataIndex: "approveDate",
      key: "approveDate",
      render: (text: string) => <span>{formatDate(text)}</span>,
    },
    {
      title: t("withdrawal.status"),
      key: "state",
      render: (_: any, record: Withdrawal) =>
        record.approvedBy ? (
          <span style={{ color: "green" }}>{t("withdrawal.approved")}</span>
        ) : (
          <span style={{ color: "red" }}>{t("withdrawal.notApproved")}</span>
        ),
    },
  ];

  const openModal = () => {
    form.setFieldsValue({
      amount: Math.min(balance, 1000),
    });
    setIsModalOpen(true);
  };

  return (
    <Flex
      className="withdraw-table-container"
      style={{
        width: "100%",
        height: "50%",
        padding: "8px 16px",
        flexDirection: "column",
        gap: 16,
      }}
    >
      {contextHolder}

      <Modal
        title={t("withdrawal.createTitle")}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form<FormValues>
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          onFinish={(values) => {
            createWithdrawal({
              amount: values.amount,
              details: {},
            });
          }}
          layout="horizontal"
          style={{ maxWidth: 600, margin: "0 auto" }}
          initialValues={{ amount: 1000 }}
        >
          <Form.Item
            label={t("withdrawal.amount")}
            name="amount"
            rules={[
              { required: true, message: t("withdrawal.amountRequired") },
              {
                type: "number",
                min: 1000,
                max: balance,
                message: t("withdrawal.amountRange", { min: 1000, max: balance }),
              },
            ]}
          >
            <Slider min={1000} max={balance} tooltip={{ formatter: (value) => `${value?.toLocaleString()}₮` }} />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
            <Flex justify="end" align="center" gap={8}>
              <Button type="primary" htmlType="submit" disabled={balance < 1000}>
                {t("withdrawal.submit")}
              </Button>
              <Button onClick={() => setIsModalOpen(false)}>{t("withdrawal.back")}</Button>
            </Flex>
          </Form.Item>
        </Form>
      </Modal>

      <Flex className="withdraw-table-buttons" justify="end" align="center">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={openModal}
          disabled={balance < 1000}
          aria-disabled={balance < 1000}
        >
          {t("withdrawal.createButton")}
        </Button>
      </Flex>

      <Table<Withdrawal>
        rowKey="withdrawalId"
        columns={columns}
        dataSource={data}
        style={{ width: "100%", height: "100%" }}
        pagination={{ pageSize: 5, showSizeChanger: true }}
        locale={{
          emptyText: t("withdrawal.noData"),
        }}
      />
    </Flex>
  );
}

export default WithdrawTable;
