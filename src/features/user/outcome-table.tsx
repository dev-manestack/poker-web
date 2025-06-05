import { Table } from "antd";
import { useFetchOutcomesQuery } from "../../api/user";

function OutcomeTable() {
  const { data } = useFetchOutcomesQuery();

  const columns = [
    {
      title: "Код",
      dataIndex: "outcomeId",
      key: "outcomeId",
    },
    {
      title: "Төрөл",
      dataIndex: "type",
      key: "type",
      render: (text: string) => {
        switch (text) {
          case "GAMEPLAY":
            return "Тоглолтын хожил";
          case "BONUS":
            return "Бонус";
          case "RECHARGE":
            return "Явцын цэнэглэлт";
          case "LEAVE_SEAT":
            return "Босох";
          case "BUY_IN":
            return "Суух";
          default:
            return text;
        }
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
      title: "Огноо",
      dataIndex: "accountDate",
      key: "accountDate",
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
  ];

  return (
    <Table dataSource={data} columns={columns} pagination={{ pageSize: 5 }} />
  );
}

export default OutcomeTable;
