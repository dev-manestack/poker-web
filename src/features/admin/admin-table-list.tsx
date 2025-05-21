import { Button, Flex, Table } from "antd";
import { type GameTable } from "../../api/admin";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

function AdminTableList({
  tables,
  editTable,
  deleteTable,
}: {
  tables: GameTable[];
  editTable: (table: GameTable) => void;
  deleteTable: (table: GameTable) => void;
}) {
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
    },
    {
      title: "Ширээний дээд лимит",
      dataIndex: "maxBuyIn",
      key: "maxBuyIn",
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
    },
    {
      title: "Small Blind",
      dataIndex: "smallBlind",
      key: "smallBlind",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: GameTable) => (
        <Flex gap={5} justify="center" align="center">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => editTable(record)}
          />
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => deleteTable(record)}
          />
        </Flex>
      ),
    },
  ];

  return (
    <Table
      dataSource={tables}
      columns={columns}
      style={{
        width: "100%",
      }}
    />
  );
}

export default AdminTableList;
