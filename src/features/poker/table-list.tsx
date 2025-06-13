import { Button, Row, Col, Table, Grid, Typography } from "antd";
import { useNavigate } from "react-router";
import type { GameTable } from "../../api/admin";
import { useFetchTablesQuery } from "../../api/user";
import { useState, useMemo, useCallback } from "react";
import "../../styles/table-list.css";
import type { ColumnsType } from "antd/es/table";
import { useTranslation } from "react-i18next";

const currencySymbol = "₮";
const { useBreakpoint } = Grid;

interface TableListProps {
  setSelectedTable: (table: GameTable | null) => void;
  tableType?: string;
  isAuthenticated: boolean;
  onRequestLogin: () => void;
}

function TableList({ setSelectedTable, tableType, isAuthenticated, onRequestLogin }: TableListProps) {
  const [selectedRowKey, setSelectedRowKey] = useState<string | number | null>(null);
  const navigate = useNavigate();
  const { data: tableData } = useFetchTablesQuery();
  const screens = useBreakpoint();
  const isMobileOrTablet = !screens.lg;
  const { t, i18n } = useTranslation();
  const lang = i18n.language === "mn" ? "mn" : "en";
  const [loadingTableId, setLoadingTableId] = useState<number | null>(null);

  const filteredTables = useMemo(() => {
    if (!tableData) return [];
    if (!tableType) return tableData;
    return tableData.filter((table) => table.variant?.toLowerCase() === tableType.toLowerCase());
  }, [tableData, tableType]);

  const handlePlayClick = useCallback(
    (record: GameTable) => {
      if (!isAuthenticated) {
        onRequestLogin();
      } else {
        setLoadingTableId(record.tableId);
        setTimeout(() => {
          navigate("/table/" + record.tableId);
        }, 300);
      }
    },
    [isAuthenticated, navigate, onRequestLogin]
  );

  const renderActions = useCallback(
    (_: any, record: GameTable) => (
      <div className="actions-wrapper">
        <Button
          className="play-button"
          type="default"
          loading={loadingTableId === record.tableId}
          onClick={() => handlePlayClick(record)}
          size="middle"
        >
          {t("actions.play")}
        </Button>
      </div>
    ),
    [loadingTableId, t, handlePlayClick]
  );

  const renderVariant = useCallback(
    (text: string) => {
      switch (text.toUpperCase()) {
        case "TEXAS":
          return t("variant.texas");
        case "OMAHA":
          return t("variant.omaha");
        default:
          return t("variant.unknown");
      }
    },
    [t]
  );

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

  const desktopColumns = useMemo(
    () => [
      {
        title: <span lang={lang}>{t("tableList.index")}</span>,
        dataIndex: "index",
        key: "index",
        render: (_: any, __: any, index: number) => <Typography.Text>{index + 1}</Typography.Text>,
      },
      {
        title: <span lang={lang}>{t("tableList.name")}</span>,
        dataIndex: "tableName",
        key: "tableName",
      },
      {
        title: <span lang={lang}>{t("tableList.variant")}</span>,
        dataIndex: "variant",
        key: "variant",
        render: renderVariant,
      },
      {
        title: <span lang={lang}>{t("tableList.players")}</span>,
        dataIndex: "maxPlayers",
        key: "maxPlayers",
      },
      {
        title: <span lang={lang}>{t("tableList.blinds")}</span>,
        key: "blinds",
        render: renderBlinds,
      },
      {
        title: <span lang={lang}>{t("actions.actions")}</span>,
        key: "actions",
        render: renderActions,
      },
    ],
    [renderVariant, renderBlinds, renderActions, t, lang]
  );

  const renderMobileVariant = useCallback(
    (_: any, record: GameTable) => (
      <div className="mobile-variant" lang={lang}>
        {record.variant?.toUpperCase() === "TEXAS"
          ? t("variant.holdem")
          : record.variant?.toUpperCase() === "OMAHA"
          ? t("variant.omaha")
          : t("variant.unknown")}
      </div>
    ),
    [t, lang]
  );

  const renderMobileTableName = useCallback(
    (text: string) => (
      <div className="mobile-table-name" lang={lang}>
        {text}
      </div>
    ),
    [lang]
  );

  const renderMobileBlinds = useCallback(
    (_: any, record: GameTable) => (
      <div className="mobile-blinds" lang={lang}>
        {`${record.smallBlind.toLocaleString("mn-MN")} / ${record.bigBlind.toLocaleString("mn-MN")}`}
      </div>
    ),
    [lang]
  );

  const renderMobilePlayers = useCallback(
    (_: any, record: GameTable) => (
      <div className="mobile-players" lang={lang}>
        {record.maxPlayers}
      </div>
    ),
    [lang]
  );

  const mobileColumns: ColumnsType<GameTable> = useMemo(
    () => [
      {
        title: (
          <div className="mobile-column-header" lang={lang}>
            <span>{t("tableList.variant")}</span>
          </div>
        ),
        key: "variant",
        align: "center" as const,
        render: renderMobileVariant,
      },
      {
        title: (
          <div className="mobile-column-header" lang={lang}>
            <span>{t("tableList.table")}</span>
          </div>
        ),
        dataIndex: "tableName",
        key: "tableName",
        align: "center" as const,
        render: renderMobileTableName,
      },
      {
        title: (
          <div className="mobile-column-header" lang={lang}>
            <span>{t("tableList.blinds")}</span>
          </div>
        ),
        key: "blindStakes",
        align: "center" as const,
        render: renderMobileBlinds,
      },
      {
        title: (
          <div className="mobile-column-header" lang={lang}>
            <span>{t("tableList.players")}</span>
          </div>
        ),
        key: "players",
        align: "center" as const,
        render: renderMobilePlayers,
      },
      {
        title: <span lang={lang}>{t("actions.actions")}</span>,
        key: "actions",
        render: renderActions,
      },
    ],
    [renderMobileVariant, renderMobileTableName, renderMobileBlinds, renderMobilePlayers, renderActions, t, lang]
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
          className={`${isMobileOrTablet ? "table-mobile" : "table-desktop"} ${lang === "mn" ? "lang-mn" : "lang-en"}`}
          columns={isMobileOrTablet ? mobileColumns : desktopColumns}
          dataSource={filteredTables}
          rowKey="tableId"
          pagination={false}
          scroll={{ x: "max-content" }}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
          })}
          rowClassName={(record) => {
            let className = "custom-table-row";
            if (record.tableId === selectedRowKey) className += " selected-row";
            else className += " hover-row";
            return className;
          }}
        />
      </Col>
    </Row>
  );
}

export default TableList;
