import { Table } from "antd";
import { useFetchOutcomesQuery } from "../../api/user";
import { useTranslation } from "react-i18next";

function OutcomeTable() {
  const { data } = useFetchOutcomesQuery();
  const { t } = useTranslation();

  const renderType = (type: string) => {
    switch (type) {
      case "GAMEPLAY":
        return t("outcome.type.gameplay");
      case "BONUS":
        return t("outcome.type.bonus");
      case "RECHARGE":
        return t("outcome.type.recharge");
      case "LEAVE_SEAT":
        return t("outcome.type.leave_seat");
      case "BUY_IN":
        return t("outcome.type.buy_in");
      default:
        return type;
    }
  };

  const columns = [
    {
      title: t("outcome.code"),
      dataIndex: "outcomeId",
      key: "outcomeId",
    },
    {
      title: t("outcome.type.title"),
      dataIndex: "type",
      key: "type",
      render: renderType,
    },
    {
      title: t("outcome.amount"),
      dataIndex: "amount",
      key: "amount",
      render: (text: number) =>
        text.toLocaleString(undefined, {
          style: "currency",
          currency: "MNT",
        }),
    },
    {
      title: t("outcome.date"),
      dataIndex: "accountDate",
      key: "accountDate",
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
        return date.toLocaleString(undefined, options);
      },
    },
  ];

  return <Table dataSource={data} columns={columns} pagination={{ pageSize: 5 }} rowKey="outcomeId" />;
}

export default OutcomeTable;
