import { Table, Typography, Grid } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { GameTable } from "../../api/admin";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BannerGif } from "../../assets/image";

const { Title } = Typography;
const { useBreakpoint } = Grid;

interface Player {
  key: string;
  name: string;
  amount: number;
}

function TableDetails({ table }: { table: GameTable | null }) {
  const screens = useBreakpoint();
  const [dataSource, _] = useState<Player[]>([]);
  const { t, i18n } = useTranslation();

  const lang = i18n.language === "mn" ? "mn" : "en";

  const mobileColumns: ColumnsType<Player> = [
    {
      title: <span lang={lang}>{t("name")}</span>,
      dataIndex: "name",
      key: "name",
      align: "center",
      width: "50%",
      className: "table-column-name",
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: <span lang={lang}>{t("amount")}</span>,
      dataIndex: "amount",
      key: "amount",
      align: "center",
      width: "50%",
      className: "table-column-name",
      render: (amount: number) => amount.toLocaleString("mn-MN") + "₮",
    },
  ];

  const desktopColumns = [
    {
      title: <span lang={lang}>{t("name")}</span>,
      dataIndex: "name",
      key: "name",
      className: "table-column-name",
    },
    {
      title: <span lang={lang}>{t("amount")}</span>,
      dataIndex: "amount",
      key: "amount",
      className: "table-column-name",
      render: (amount: number) => amount.toLocaleString("mn-MN") + "₮",
    },
  ];

  return (
    <div className="table-details-container">
      <div className="table-details-banner">
        <img
          src={BannerGif}
          alt="banner"
          className="table-details-banner-img"
        />
      </div>

      <Table
        columns={screens.xs ? mobileColumns : desktopColumns}
        dataSource={dataSource}
        pagination={screens.xs ? { pageSize: 5 } : false}
        scroll={{ x: "max-content" }}
        locale={{ emptyText: <span lang={lang}>{t("noPlayers")}</span> }}
        className="table-details-table"
        title={() => (
          <Title level={screens.xs ? 5 : 4} className="table-details-title">
            <span style={{ fontSize: "14px" }} lang={lang}>
              {table?.tableName || t("noTableSelected")}
            </span>
          </Title>
        )}
      />
    </div>
  );
}

export default TableDetails;
