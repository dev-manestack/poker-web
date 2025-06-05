import { Table, Typography, Grid } from "antd";
import type { ColumnsType } from "antd/es/table";

const { Title } = Typography;
const { useBreakpoint } = Grid;

interface Player {
  key: string;
  name: string;
  amount: number;
}

interface TableDetailsProps {
  table: {
    tableName?: string;
    players?: Player[];
  } | null;
}

function TableDetails({ table }: TableDetailsProps) {
  const screens = useBreakpoint();

  const dataSource =
    table?.players?.map((player) => ({
      key: player.key,
      name: player.name,
      amount: player.amount,
    })) || [];

  const mobileColumns: ColumnsType<Player> = [
    {
      title: "Нэр",
      dataIndex: "name",
      key: "name",
      align: "center",
      width: "50%",
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: "Мөнгөн дүн",
      dataIndex: "amount",
      key: "amount",
      align: "center",
      render: (amount: number) => amount.toLocaleString("mn-MN") + "₮",
    },
  ];

  const desktopColumns = [
    {
      title: "Нэр",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Мөнгөн дүн",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => amount.toLocaleString("mn-MN") + "₮",
    },
  ];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <Table
        columns={screens.xs ? mobileColumns : desktopColumns}
        dataSource={dataSource}
        pagination={screens.xs ? { pageSize: 5 } : false}
        scroll={{ x: 300 }}
        locale={{ emptyText: "Тоглогч байхгүй" }}
        style={{
          width: "100%",
          fontSize: screens.xs ? 14 : 16, // smaller font size on mobile
        }}
        title={() => (
          <Title
            level={screens.xs ? 5 : 4} // smaller title on mobile
            style={{ margin: 0, textAlign: "center" }}
          >
            {table?.tableName || "Ширээ сонгоогүй байна"}
          </Title>
        )}
      />
    </div>
  );
}

export default TableDetails;
