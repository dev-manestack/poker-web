import { Button, Flex, Table } from "antd";
import { useNavigate } from "react-router";
import type { GameTable } from "../../api/admin";
import { useFetchTablesQuery } from "../../api/user";

const currencySymbol = "₮";

function TableList({
  setSelectedTable,
}: {
  setSelectedTable: (table: any) => void;
}) {
  const navigate = useNavigate();
  const { data: tableData } = useFetchTablesQuery();

  const columns = [
    {
      title: "Нэр",
      dataIndex: "tableName",
      key: "tableName",
    },
    {
      title: "Төрөл",
      dataIndex: "variant",
      key: "variant",
      render: (text: string) => {
        switch (text) {
          case "TEXAS": {
            return "Texas Holdem";
          }
          default: {
            return "Unknown";
          }
        }
      },
    },
    {
      title: "Үүсгэсэн огноо",
      dataIndex: "createdAt",
      key: "createdAt",
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
      title: "Ширээний доод лимит",
      dataIndex: "minBuyIn",
      key: "minBuyIn",
      render: (text: number) => {
        return currencySymbol + text.toLocaleString("mn-MN");
      },
    },
    {
      title: "Ширээний дээд лимит",
      dataIndex: "maxBuyIn",
      key: "maxBuyIn",
      render: (text: number) => {
        return currencySymbol + text.toLocaleString("mn-MN");
      },
    },
    {
      title: "Тоглогчийн тоо",
      dataIndex: "maxPlayers",
      key: "maxPlayers",
    },
    {
      title: "Big Blind",
      dataIndex: "bigBlind",
      key: "bigBlind",
      render: (text: number) => {
        return currencySymbol + text.toLocaleString("mn-MN");
      },
    },
    {
      title: "Small Blind",
      dataIndex: "smallBlind",
      key: "smallBlind",
      render: (text: number) => {
        return currencySymbol + text.toLocaleString("mn-MN");
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: GameTable) => (
        <Flex gap={5}>
          <Button
            type="primary"
            onClick={() => {
              navigate("/table/" + record.tableId);
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
      dataSource={tableData}
      rowKey="tableId"
      onRow={(record) => {
        return {
          onClick: () => setSelectedTable(record),
        };
      }}
      style={{
        width: "100%",
      }}
    />
  );
}

export default TableList;
