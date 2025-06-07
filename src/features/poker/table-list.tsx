import { Button, Row, Col, Table, Grid } from "antd";
import { useNavigate } from "react-router";
import type { GameTable } from "../../api/admin";
import { useFetchTablesQuery } from "../../api/user";
import { useState, useMemo, useCallback } from "react";
import "../../styles/table-list.css";
import type { ColumnsType } from "antd/es/table";

const currencySymbol = "₮";
const { useBreakpoint } = Grid;

function TableList({ setSelectedTable }: { setSelectedTable: (table: any) => void }) {
  const [selectedRowKey, setSelectedRowKey] = useState<string | number | null>(null);
  const navigate = useNavigate();
  const { data: tableData } = useFetchTablesQuery();
  const screens = useBreakpoint();

  const renderVariant = useCallback((text: string) => {
    switch (text) {
      case "TEXAS":
        return "Texas Holdem";
      default:
        return "Unknown";
    }
  }, []);

  const renderBuyInRange = useCallback(
    (_: any, record: GameTable) =>
      `${currencySymbol}${record.minBuyIn.toLocaleString("mn-MN")} / ${currencySymbol}${record.maxBuyIn.toLocaleString(
        "mn-MN"
      )}`,
    []
  );

  const renderBlinds = useCallback(
    (_: any, record: GameTable) =>
      `${currencySymbol}${record.smallBlind.toLocaleString(
        "mn-MN"
      )} / ${currencySymbol}${record.bigBlind.toLocaleString("mn-MN")}`,
    []
  );

  const renderActions = useCallback(
    (_: any, record: GameTable) => (
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Button
          style={{ background: "#f37b06" }}
          type="primary"
          onClick={() => {
            navigate("/table/" + record.tableId);
          }}
          size="middle"
        >
          Тоглох
        </Button>
        <Button size="middle">Үзэх</Button>
      </div>
    ),
    [navigate]
  );

  const desktopColumns = useMemo(
    () => [
      {
        title: "Нэр",
        dataIndex: "tableName",
        key: "tableName",
      },
      {
        title: "Төрөл",
        dataIndex: "variant",
        key: "variant",
        render: renderVariant,
      },
      {
        title: "Оролт",
        key: "buyInRange",
        render: renderBuyInRange,
      },
      {
        title: "Тоглогчид",
        dataIndex: "maxPlayers",
        key: "maxPlayers",
      },
      {
        title: "Ул",
        key: "blinds",
        render: renderBlinds,
      },
      {
        title: "Actions",
        key: "actions",
        render: renderActions,
      },
    ],
    [renderVariant, renderBuyInRange, renderBlinds, renderActions]
  );

  const renderMobileVariant = useCallback(
    (_: any, record: GameTable) => (
      <div style={{ fontSize: 12, padding: "8px 12px" }}>{record.variant === "TEXAS" ? "HOLD'EM" : "Unknown"}</div>
    ),
    []
  );

  const renderMobileTableName = useCallback(
    (text: string) => (
      <div style={{ padding: "8px 12px" }}>
        <strong>{text}</strong>
      </div>
    ),
    []
  );

  const renderMobileBlinds = useCallback(
    (_: any, record: GameTable) => (
      <div style={{ padding: "8px 12px" }}>
        {`${record.smallBlind.toLocaleString("mn-MN")} / ${record.bigBlind.toLocaleString("mn-MN")}`}
      </div>
    ),
    []
  );

  const renderMobilePlayers = useCallback(
    (_: any, record: GameTable) => <div style={{ padding: "8px 12px" }}>{record.maxPlayers}</div>,
    []
  );

  const mobileColumns: ColumnsType<GameTable> = useMemo(
    () => [
      {
        title: () => <div style={{ padding: "8px 12px" }}>Төрөл</div>,
        key: "variant",
        align: "center" as const,
        render: renderMobileVariant,
      },
      {
        title: () => <div style={{ padding: "8px 12px" }}>Ширээ</div>,
        dataIndex: "tableName",
        key: "tableName",
        align: "center" as const,
        render: renderMobileTableName,
      },
      {
        title: () => <div style={{ padding: "8px 12px" }}>Үл</div>,
        key: "blindStakes",
        align: "center" as const,
        render: renderMobileBlinds,
      },
      {
        title: () => <div style={{ padding: "8px 12px" }}>Тоглогчид</div>,
        key: "players",
        align: "center" as const,
        render: renderMobilePlayers,
      },
    ],
    [renderMobileVariant, renderMobileTableName, renderMobileBlinds, renderMobilePlayers]
  );

  const handleRowClick = useCallback(
    (record: GameTable) => {
      if (record.tableId === selectedRowKey) {
        setSelectedRowKey(null);
        setSelectedTable(null);
      } else {
        setSelectedRowKey(record.tableId);
        setSelectedTable(record);
      }
    },
    [selectedRowKey, setSelectedTable]
  );

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={24} md={24} lg={24} xl={24}>
        <Table
          columns={screens.xs ? mobileColumns : desktopColumns}
          dataSource={tableData}
          rowKey="tableId"
          pagination={false}
          scroll={{ x: "max-content" }}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
          })}
          rowClassName={(record) => (record.tableId === selectedRowKey ? "selected-row" : "hover-row")}
          style={{
            fontSize: screens.xs ? 14 : 16,
          }}
        />
      </Col>
    </Row>
  );
}

export default TableList;
