import { Button, Flex, Popover, Table } from "antd";
import type { Deposit } from "../../api/admin";

function AdminDepositList({ deposits }: { deposits: Deposit[] }) {
  const columns = [
    {
      title: "Хэрэглэгч",
      dataIndex: "userId",
      key: "userId",
      render: (_: string, record: Deposit) => {
        return (
          <Flex>
            <div>{record.user?.email}</div>
          </Flex>
        );
      },
    },
    {
      title: "Amount",
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
      title: "Төрөл",
      dataIndex: "type",
      key: "type",
      render: (text: string) => {
        switch (text) {
          case "BANK_TRANSFER":
            return "Банкны шилжүүлэг";
          case "CASH":
            return "Бэлнээр";
          case "CRYPTO":
            return "Крипто";
          default:
            return text;
        }
      },
    },
    {
      title: "Үүсгэсэн огноо",
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
      title: "Үйлдэл",
      dataIndex: "action",
      key: "action",
      render: (_: string, record: Deposit) => {
        return (
          <Flex>
            <Popover
              content={<div>{JSON.stringify(record.details, null, 2)}</div>}
            >
              <Button>Дэлгэрэнгүй</Button>
            </Popover>
          </Flex>
        );
      },
    },
  ];

  return (
    <Table dataSource={deposits} columns={columns} style={{ width: "100%" }} />
  );
}

export default AdminDepositList;
