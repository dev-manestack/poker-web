import { Button, Flex, Table } from "antd";

const currencySymbol = "₮";

const dataSource = [
  {
    key: "1",
    table: "Ширээ 1",
    bid: "1000 / 2000" + currencySymbol,
    pot: "2000" + currencySymbol,
    player: "Тоглогч 1",
    type: "Төрөл 1",
  },
  {
    key: "2",
    table: "Ширээ 2",
    bid: "2000 / 4000" + currencySymbol,
    pot: "4000" + currencySymbol,
    player: "Тоглогч 2",
    type: "Төрөл 2",
  },
];

function TableList({
  setSelectedTable,
}: {
  setSelectedTable: (table: any) => void;
}) {
  const columns = [
    {
      title: "Ширээ",
      dataIndex: "table",
      key: "table",
    },
    {
      title: "Ул",
      dataIndex: "bid",
      key: "bid",
    },
    {
      title: "Пот",
      dataIndex: "pot",
      key: "pot",
    },
    {
      title: "Тоглогч",
      dataIndex: "player",
      key: "player",
    },
    {
      title: "Төрөл",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Үйлдэл",
      key: "action",
      render: (_: any, record: any) => (
        <Flex gap={5}>
          <Button
            type="primary"
            onClick={() => {
              setSelectedTable(record);
            }}
          >
            Тоглох
          </Button>
          <Button>Үзэх</Button>
        </Flex>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      style={{
        width: "100%",
      }}
    />
  );
}

export default TableList;
