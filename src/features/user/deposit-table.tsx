import { useFetchDepositsQuery } from "../../api/user";
import { Table } from "antd";

function DepositTable() {
  const { data } = useFetchDepositsQuery();

  const columns = [
    {
      title: "Код",
      dataIndex: "depositId",
      key: "depositId",
    },
    {
      title: "Дүн",
      dataIndex: "amount",
      key: "amount",
      render: (text: number) => `${text.toLocaleString()}₮`,
    },
    {
      title: "Батлагдсан огноо",
      dataIndex: "createDate",
      key: "createDate",
      render: (text: string) => new Date(text).toLocaleString(),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={{
        pageSize: 5,
        showSizeChanger: true,
      }}
      style={{
        width: "100%",
      }}
    />
  );
}

export default DepositTable;
