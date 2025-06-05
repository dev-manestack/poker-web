import { Table, Typography, Grid, Flex } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { GameTable } from "../../api/admin";
import TexasTableGame from "./texas-table-game";
import { useState } from "react";

const { Title } = Typography;
const { useBreakpoint } = Grid;

interface Player {
  key: string;
  name: string;
  amount: number;
}

function TableDetails({ table }: { table: GameTable | null }) {
  const screens = useBreakpoint();
  const [dataSource, setDataSource] = useState<Player[]>([]);

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
        height: "400px",
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
      <Flex style={{ marginTop: "50px" }}>
        <TexasTableGame
          isPreview
          previewTableId={table?.tableId ? String(table?.tableId) : ""}
          setPreviewSeats={(seats) => {
            const players: Player[] = [];
            seats?.forEach((seat) => {
              if (seat?.user) {
                players.push({
                  key: String(seat.user.userId),
                  name: seat.user.username,
                  amount: seat.stack,
                });
              }
            });
            setDataSource(players);
          }}
        />
      </Flex>
    </div>
  );
}

export default TableDetails;
