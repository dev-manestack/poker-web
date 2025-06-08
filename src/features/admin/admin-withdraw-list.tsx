import { Button, Flex, Popover, Table, Typography } from "antd";
import { useApproveWithdrawalMutation, type Withdrawal } from "../../api/admin";

function AdminWithdrawList({ withdrawals }: { withdrawals: Withdrawal[] }) {
  const [approve] = useApproveWithdrawalMutation();

  const columns = [
    {
      title: "№",
      dataIndex: "index",
      key: "index",
      render: (_: any, __: any, index: number) => {
        return <Typography.Text>{index + 1}</Typography.Text>;
      },
    },
    {
      title: "Хэрэглэгч",
      dataIndex: "userId",
      key: "userId",
      render: (_: string, record: Withdrawal) => {
        return (
          <Flex>
            <div>{record.user?.email}</div>
          </Flex>
        );
      },
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
    {
      title: "Үйлдэл",
      key: "action",
      render: (_: any, record: any) => (
        <Flex gap={5}>
          <Button
            type="primary"
            disabled={record?.approvedBy}
            onClick={() => {
              console.log(record?.withdrawalId);
              approve({
                id: record?.withdrawalId,
              });
            }}
          >
            Батлах
          </Button>
          <Popover
            placement="bottom"
            content={
              <Typography.Text>
                {JSON.stringify(record.details)}
              </Typography.Text>
            }
          >
            <Button>Нэмэлт мэдээлэл</Button>
          </Popover>
        </Flex>
      ),
    },
  ];

  return (
    <Table
      dataSource={withdrawals}
      columns={columns}
      style={{ width: "100%" }}
    />
  );
}

export default AdminWithdrawList;
