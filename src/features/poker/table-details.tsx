import { Flex, Skeleton, Table, Typography } from "antd";

const { Title } = Typography;

const columns = [
  {
    title: "Нэр",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Мөнгөн дүн",
    dataIndex: "amount",
    key: "amount",
  },
];

const dataSource = [
  {
    key: "1",
    name: "Тоглогч 1",
    amount: "1000₮",
  },
  {
    key: "2",
    name: "Тоглогч 2",
    amount: "2000₮",
  },
];

function TableDetails({ table }: { table: any }) {
  return (
    <Flex style={{ width: "100%", height: "100%" }} vertical>
      <Title level={3}>
        {table?.table?.length > 0 ? table?.table : "Default"}
      </Title>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        style={{
          width: "100%",
        }}
      />
      <Skeleton
        style={{
          height: "300px",
        }}
      />
    </Flex>
  );
}

export default TableDetails;
