import { useFetchDepositsQuery } from "../../api/user";
import { Table } from "antd";
import { useTranslation } from "react-i18next";

function DepositTable() {
  const { data } = useFetchDepositsQuery();
  const { t } = useTranslation();

  const columns = [
    {
      title: t("deposit.code"),
      dataIndex: "depositId",
      key: "depositId",
    },
    {
      title: t("deposit.amount"),
      dataIndex: "amount",
      key: "amount",
      render: (text: number) => `${text.toLocaleString()}₮`,
    },
    {
      title: t("deposit.createDate"),
      dataIndex: "createDate",
      key: "createDate",
      render: (text: string) => new Date(text).toLocaleString(),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={{
        pageSize: 5,
        showSizeChanger: true,
      }}
      style={{
        width: "100%",
      }}
      rowKey="depositId"
    />
  );
}

export default DepositTable;
