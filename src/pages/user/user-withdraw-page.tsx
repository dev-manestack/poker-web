import { Card, Flex, Tabs, Typography } from "antd";
import DepositTable from "../../features/user/deposit-table";
import WithdrawTable from "../../features/user/withdraw-table";
import OutcomeTable from "../../features/user/outcome-table";
import { useMeQuery } from "../../api/user";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../../styles/user-withdraw.css";

function UserWithdrawPage() {
  const { data } = useMeQuery();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <Flex className="user-withdraw-page" vertical gap={16}>
      <Typography.Title level={3} className="user-withdraw-page__title">
        <span lang={i18n.language}>{t("userWithdrawPage.balanceTitle")}</span>
      </Typography.Title>

      <Flex className="user-withdraw-page__balance-cards">
        <Card className="user-withdraw-page__card">
          <Flex vertical gap={8} style={{ height: "100%" }} align="center" justify="center">
            <Typography.Text className="user-withdraw-page__card-text-small">
              <span lang={i18n.language}>{t("userWithdrawPage.balance")}</span>
            </Typography.Text>
            <Typography.Text className="user-withdraw-page__card-text-large">
              {`${data?.userBalance?.balance?.toLocaleString() || "0"}₮`}
            </Typography.Text>
          </Flex>
        </Card>

        <Card className="user-withdraw-page__card">
          <Flex vertical gap={8} style={{ height: "100%" }} align="center" justify="center">
            <Typography.Text className="user-withdraw-page__card-text-small">
              <span lang={i18n.language}>{t("userWithdrawPage.locked")}</span>
            </Typography.Text>
            <Typography.Text className="user-withdraw-page__card-text-large">
              {`${data?.userBalance?.lockedAmount?.toLocaleString() || "0"}₮`}
            </Typography.Text>
          </Flex>
        </Card>
      </Flex>

      <Tabs
        className="user-withdraw-page__tabs"
        items={[
          {
            key: "1",
            label: <span lang={i18n.language}>{t("userWithdrawPage.tabs.deposit")}</span>,
            children: <DepositTable />,
          },
          {
            key: "2",
            label: <span lang={i18n.language}>{t("userWithdrawPage.tabs.withdraw")}</span>,
            children: <WithdrawTable balance={data?.userBalance?.balance} />,
          },
          {
            key: "3",
            label: <span lang={i18n.language}>{t("userWithdrawPage.tabs.outcome")}</span>,
            children: <OutcomeTable />,
          },
        ]}
      />
    </Flex>
  );
}

export default UserWithdrawPage;
