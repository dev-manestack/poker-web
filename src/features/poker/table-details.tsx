import { Table, Typography, Grid } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { GameTable } from "../../api/admin";
import { useState } from "react";
import bannerGif from "../../assets/banner.gif";
import { useTranslation } from "react-i18next";

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
  const { t, i18n } = useTranslation();

  // Determine current language for lang attribute on spans
  const lang = i18n.language === "mn" ? "mn" : "en";

  const mobileColumns: ColumnsType<Player> = [
    {
      title: <span lang={lang}>{t("name")}</span>,
      dataIndex: "name",
      key: "name",
      align: "center",
      width: "50%",
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: <span lang={lang}>{t("amount")}</span>,
      dataIndex: "amount",
      key: "amount",
      align: "center",
      render: (amount: number) => amount.toLocaleString("mn-MN") + "₮",
    },
  ];

  const desktopColumns = [
    {
      title: <span lang={lang}>{t("name")}</span>,
      dataIndex: "name",
      key: "name",
    },
    {
      title: <span lang={lang}>{t("amount")}</span>,
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
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="banner" style={{ marginBottom: 16 }}>
        <img
          src={bannerGif}
          alt="banner"
          style={{
            width: "100%",
            height: "auto",
            borderRadius: "12px",
            border: "2px solid rgb(14, 71, 139)",
            objectFit: "cover",
          }}
        />
      </div>

      <Table
        columns={screens.xs ? mobileColumns : desktopColumns}
        dataSource={dataSource}
        pagination={screens.xs ? { pageSize: 5 } : false}
        scroll={{ x: 300 }}
        locale={{ emptyText: <span lang={lang}>{t("noPlayers")}</span> }}
        style={{
          width: "100%",
          fontSize: screens.xs ? 14 : 16,
          background: "#040404 !important",
          border: "none",
        }}
        title={() => (
          <Title
            level={screens.xs ? 5 : 4}
            style={{ margin: 0, textAlign: "center", fontFamily: "'Montserrat', sans-serif", fontSize: "14px" }}
            lang={lang}
          >
            {table?.tableName || t("noTableSelected")}
          </Title>
        )}
      />
    </div>
  );
}

export default TableDetails;
