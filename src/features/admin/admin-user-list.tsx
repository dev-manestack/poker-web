import { Table, Typography } from "antd";
import type { User } from "../../api/user";
import banks from "../../assets/data/banks";

function AdminUserList({ users }: { users: User[] }) {
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
      dataIndex: "email",
      key: "email",
      render: (_: string, record: User) => {
        return <div>{record.email}</div>;
      },
    },
    {
      title: "Нэр",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Дансны дугаар",
      dataIndex: "accountNumber",
      key: "accountNumber",
    },
    {
      title: "Банк",
      dataIndex: "bankName",
      key: "bankName",
      render: (_: string, record: User) => {
        const bank = banks.find((bank) => bank.value === record.bankName);
        return <div>{bank ? bank.label : record.bankName}</div>;
      },
    },
  ];

  return <Table dataSource={users} columns={columns} />;
}

export default AdminUserList;
