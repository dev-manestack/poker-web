import { Button, Flex, Popover, Table, Typography } from "antd";
import { useApproveWithdrawalMutation, type Withdrawal } from "../../api/admin";

function AdminWithdrawList({ withdrawals }: { withdrawals: Withdrawal[] }) {
  const [approve] = useApproveWithdrawalMutation();

  const columns = [
    {
      title: <span lang="mn">№</span>,
      dataIndex: "index",
      key: "index",
      render: (_: any, __: any, index: number) => <Typography.Text>{index + 1}</Typography.Text>,
    },
    {
      title: <span lang="mn">Хэрэглэгч</span>,
      dataIndex: "userId",
      key: "userId",
      render: (_: string, record: Withdrawal) => (
        <Flex>
          <div>{record.user?.email}</div>
        </Flex>
      ),
    },
    {
      title: <span lang="mn">Хүсэлтийн огноо</span>,
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
      title: <span lang="mn">Дүн</span>,
      dataIndex: "amount",
      key: "amount",
      render: (text: number) =>
        text.toLocaleString("mn-MN", {
          style: "currency",
          currency: "MNT",
        }),
    },
    {
      title: <span lang="mn">Баталсан Админ</span>,
      dataIndex: "approvedBy",
      key: "approvedBy",
    },
    {
      title: <span lang="mn">Баталсан огноо</span>,
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
      title: <span lang="mn">Төлөв</span>,
      key: "state",
      render: (_: any, record: Withdrawal) =>
        record.approvedBy ? (
          <span style={{ color: "green" }} lang="mn">
            Батлагдсан
          </span>
        ) : (
          <span style={{ color: "red" }} lang="mn">
            Батлагдаагүй
          </span>
        ),
    },
    {
      title: <span lang="mn">Үйлдэл</span>,
      key: "action",
      render: (_: any, record: Withdrawal) => (
        <Flex gap={5}>
          <Button
            type="primary"
            disabled={!!record.approvedBy}
            onClick={() => {
              approve({ id: record.withdrawalId });
            }}
          >
            Батлах
          </Button>
          <Popover placement="bottom" content={<Typography.Text>{JSON.stringify(record.details)}</Typography.Text>}>
            <Button>Нэмэлт мэдээлэл</Button>
          </Popover>
        </Flex>
      ),
    },
  ];

  return <Table dataSource={withdrawals} columns={columns} style={{ width: "100%" }} />;
}

export default AdminWithdrawList;
